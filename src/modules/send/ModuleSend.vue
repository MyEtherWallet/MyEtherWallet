<template>
  <div>
    <div
      class="max-w-[478px] flex flex-col items-center justify-items-stretch gap-5"
    >
      <app-sheet sheetClass="w-full !px-4 mt-4">
        <div class="mb-5">
          <app-enter-amount
            v-model:amount="amount"
            v-model:selected-token="tokenSelected"
            v-model:error="amountError"
            :validate-input="checkAmountForError"
          />
        </div>
        <app-address-book v-model="toAddress" class="mb-1" />
        <app-select-tx-fee />
      </app-sheet>
      <app-base-button
        v-if="isWalletConnected"
        :disabled="!validSend"
        @click="handleSubmit"
        class="w-full mt-4"
      >
        {{ $t('common.send') }}</app-base-button
      >
    </div>
  </div>

  <!-- TODO: replace network with actual selected network info -->
  <evm-transaction-confirmation
    v-if="isWalletConnected && tokenSelected"
    :fromAddress="address"
    :toAddress="toAddress"
    :networkFeeUSD="networkFeeUSD"
    :networkFeeCrypto="networkFeeCrypto"
    :network="selectedChain || null"
    :to-token="tokenSelected"
    :to-amount="amount.toString()"
    :to-amount-fiat="amountToFiat"
    :signed-tx="signedTx"
    v-model="openTxModal"
  />
</template>
<script setup lang="ts">
import { onMounted, ref, computed, type Ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { toWei, fromWei, toBigInt, toHex } from 'web3-utils'
import { Contract } from 'web3-eth-contract'
import AppSheet from '@/components/AppSheet.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppEnterAmount from '@/components/AppEnterAmount.vue'
import AppSelectTxFee from '@/components/AppSelectTxFee.vue'
import AppAddressBook from '@/components/AppAddressBook.vue'
import { type TokenBalance } from '@/mew_api/types'
import { useWalletStore, MAIN_TOKEN_CONTRACT } from '@/stores/walletStore'
import { abi } from './tokenAbi'
import {
  GasPriceType,
  type GasFeeResponse,
  type HexPrefixedString,
} from '@/providers/types'
import { hexToBigInt } from '@ethereumjs/util'
import EvmTransactionConfirmation from './components/EvmTransactionConfirmation.vue'
import BigNumber from 'bignumber.js'
import { useChainsStore } from '@/stores/chainsStore'
import { WalletType } from '@/providers/types'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const walletStore = useWalletStore()
const { wallet, isWalletConnected, isLoadingBalances, safeMainTokenBalance } =
  storeToRefs(walletStore)

const chainsStore = useChainsStore()
const { selectedChain } = storeToRefs(chainsStore)
const amount = ref<number | string>('0')
const toAddress = ref('')
const tokenSelected: Ref<TokenBalance | undefined> = ref()
const amountError = ref('')
const gasPrice = ref('30000000000') // TODO: Implement gas price once api is ready
const data = ref('0x')
const gasFees: Ref<GasFeeResponse> = ref({} as GasFeeResponse)
const selectedFee = ref(GasPriceType.REGULAR)

const openTxModal = ref(false)
const isLoadingFees = ref(true)

const signedTx = ref<HexPrefixedString | string>('')
const address = ref('')

onMounted(async () => {
  //NOTE: The send module should not be loaded before the chains data has been retrieved.
  //AS of Right now, skeleton loader is shown while the chains data is being fetched.
  tokenSelected.value = safeMainTokenBalance.value || undefined
  if (!wallet.value) return
  address.value = await wallet.value.getAddress()
  //TODO: DOUBLE CHECK in theory PreTransaction interface might be different for different chains. IE they will  not use  HexPrefixedString
  isLoadingFees.value = true
  gasFees.value = await wallet.value.getGasFee({
    to: '0x0000000000000000000000000000000000000000',
    address: address.value as HexPrefixedString,
    value: '0x0' as HexPrefixedString,
    data: data.value as HexPrefixedString,
  })

  isLoadingFees.value = false
})

const checkAmountForError = () => {
  const baseAmount = amount.value ? toWei(amount.value, 'ether') : 0
  const tokenSelectedBalance = tokenSelected.value?.balance
    ? tokenSelected.value.balance
    : '0'
  const baseTokenBalance = toWei(tokenSelectedBalance, 'ether')

  // model.value = amount.value
  if (amount.value === undefined || amount.value === '')
    amountError.value = t('error.amount.required') // amount is undefined or blank
  else if (BigInt(baseAmount) < 0)
    amountError.value = t('error.amount.less_than_zero') // amount less than 0
  else if (BigInt(baseTokenBalance) < BigInt(baseAmount))
    amountError.value = t('error.balance.insufficient') // amount greater than selected balance
  else amountError.value = ''
}

// Gas Fee for display
const hasGasFees = computed(() => {
  return Object.keys(gasFees.value).length > 0
})
const networkFeeUSD = computed(() => {
  if (!hasGasFees.value) return '0'
  return gasFees.value?.fees[selectedFee.value]?.fiatValue || '0'
})
const networkFeeCrypto = computed(() => {
  if (!hasGasFees.value) return '0'
  return (
    fromWei(gasFees.value?.fees[selectedFee.value]?.nativeValue, 'ether') || '0'
  )
})

const validSend = computed(() => {
  return (
    amountError.value === '' && toAddress.value !== '' && !isLoadingFees.value
  )
})

const amountToFiat = computed(() => {
  if (isLoadingBalances.value || !tokenSelected.value?.price) return '0'
  return BigNumber(tokenSelected.value.price)
    .times(BigNumber(amount.value))
    .toString()
})

watch(
  () => [selectedFee.value, gasFees.value?.fees],
  () => {
    if (!gasFees.value?.fees || !gasFees.value.fees[selectedFee.value]) return
    gasPrice.value = hexToBigInt(
      gasFees.value.fees[selectedFee.value].nativeValue,
    ).toString()
  },
)

watch(
  () => [tokenSelected.value, amount.value, toAddress.value],
  async () => {
    if (
      tokenSelected.value &&
      tokenSelected.value.contract &&
      tokenSelected.value.contract !== MAIN_TOKEN_CONTRACT &&
      toAddress.value !== '' &&
      amount.value !== ''
    ) {
      const web3Contract = new Contract(abi, tokenSelected.value.contract)
      data.value = web3Contract.methods
        .transfer(toAddress.value, toWei(amount.value, 'ether'))
        .encodeABI() //
    } else {
      data.value = '0x'
    }
    if (!toAddress.value) return
    isLoadingFees.value = true
    gasFees.value = {} as GasFeeResponse
    gasFees.value = (await wallet.value?.getGasFee({
      to: toAddress.value as HexPrefixedString,
      address:
        (address.value as HexPrefixedString) ||
        '0x0000000000000000000000000000000000000000',
      value: toHex(toBigInt(toWei(amount.value, 'ether'))) as HexPrefixedString,
      data: data.value as HexPrefixedString,
    })) as GasFeeResponse
    isLoadingFees.value = false
  },
)

watch(
  () => openTxModal.value,
  (value: boolean) => {
    if (!value) {
      amount.value = '0'
      toAddress.value = ''
      signedTx.value = ''
    }
  },
)

// toast store
const toastStore = useToastStore()

const handleSubmit = async () => {
  if (!wallet.value) return
  // generate signable transaction
  const signableTx = await wallet.value?.getSignableTransaction({
    priority: selectedFee.value,
    quoteId: gasFees.value?.quoteId,
  })

  if (
    wallet.value?.getWalletType() === WalletType.WAGMI ||
    wallet.value?.getWalletType() === WalletType.INJECTED
  ) {
    openTxModal.value = true
    signedTx.value = signableTx.serialized
    return
  }

  // sign transaction
  if (!wallet.value?.SignTransaction) {
    console.error('SignTransaction not implemented')
    return
  }
  try {
    const signResponse = await wallet.value?.SignTransaction(
      signableTx.serialized,
    )

    signedTx.value = signResponse.signed
    openTxModal.value = true
  } catch (e) {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: e instanceof Error ? e.message : t('send.toast.failed_to_sign'),
    })
  }
}
</script>
