<template>
  <div>
    <div
      class="max-w-[478px] flex flex-col items-center justify-items-stretch gap-5"
    >
      <app-sheet sheetClass="w-full !px-4 mt-4 !pb-1">
        <div class="mb-[25px]">
          <app-enter-amount
            v-model:amount="amount"
            v-model:selected-token="tokenSelectedContract"
            v-model:error="amountError"
            :validate-input="checkAmountForError"
          />
        </div>
        <address-input
          v-model:adr-input="adrInput"
          :resolved-address="toAddress"
          :address-error-messages="toAddressError"
          :network="selectedChain"
          @validate:address="validateAddressInput"
          @immidate-update:resolved-address="onInput"
        />
        <app-select-tx-fee
          :fees="gasFees"
          :is-loading-fees="isLoadingFees"
          :txRequestBody="gasFeeTxEstimate"
          v-model:gas-fee-error="gasFeeError"
        />
      </app-sheet>
      <app-base-button
        v-if="isWalletConnected"
        :disabled="!validSend"
        :is-loading="isLoadingFees"
        @click="handleSubmit"
        class="w-full mt-4"
      >
        {{ $t('common.send') }}</app-base-button
      >
    </div>
    <!-- TODO: replace network with actual selected network info -->
    <evm-transaction-confirmation
      v-if="isWalletConnected && tokenSelected && toAddress"
      :fromAddress="address"
      :toAddress="toAddress"
      :networkFeeUSD="networkFeeUSD"
      :networkFeeCrypto="networkFeeCrypto"
      :network="selectedChain || null"
      :to-token="tokenSelected"
      :to-amount="new BigNumber(amount).toFixed()"
      :to-amount-fiat="amountToFiat"
      :signed-tx="signedTx"
      v-model="openTxModal"
      @tx-sent="resetSendModule"
    />
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, computed, type Ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { fromWei, toHex } from 'web3-utils'
import { Contract } from 'web3-eth-contract'
import AppSheet from '@/components/AppSheet.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppEnterAmount from '@/components/AppEnterAmount.vue'
import AppSelectTxFee from '@/components/AppSelectTxFee.vue'
import AddressInput from '@/components/address_book/AddressInput.vue'
import type { QuotesResponse, EstimatesRequestBody } from '@/mew_api/types'
import { useWalletStore, MAIN_TOKEN_CONTRACT } from '@/stores/walletStore'
import { abi } from './tokenAbi'
import { type HexPrefixedString } from '@/providers/types'
import { hexToBigInt } from '@ethereumjs/util'
import EvmTransactionConfirmation from './components/EvmTransactionConfirmation.vue'
import BigNumber from 'bignumber.js'
import { useChainsStore } from '@/stores/chainsStore'
import { WalletType } from '@/providers/types'
import { useToastStore } from '@/stores/toastStore'
import { useGlobalStore } from '@/stores/globalStore'
import { ToastType } from '@/types/notification'
import { useI18n } from 'vue-i18n'
import { toBase } from '@/utils/unit'
import { watchDebounced } from '@vueuse/core'
import { useAddressInput } from '@/composables/useAddressInput'

const { t } = useI18n()
const walletStore = useWalletStore()
const { wallet, isWalletConnected, isLoadingBalances, balanceWei } =
  storeToRefs(walletStore)

/** ----------------
 * Current Selected Fee
 ------------------*/
const globalStore = useGlobalStore()
const { gasPriceType: selectedFee } = storeToRefs(globalStore)

const chainsStore = useChainsStore()
const { selectedChain } = storeToRefs(chainsStore)
const amount = ref<number | string>('0')
const tokenSelectedContract: Ref<string> = ref(MAIN_TOKEN_CONTRACT)
const amountError = ref('')
const gasPrice = ref('30000000000') // TODO: Implement gas price once api is ready
const data = ref('0x')
const gasFeeTxEstimate = ref<EstimatesRequestBody | undefined>(undefined)
const gasFees: Ref<QuotesResponse | undefined> = ref(undefined)
const gasFeeError = ref('')

const openTxModal = ref(false)
const isLoadingFees = ref(false)

const signedTx = ref<HexPrefixedString | string>('')
const address = ref('')

/** ----------------
 * Address Input
 ------------------*/
const {
  adrInput,
  adrError: toAddressError,
  resolvedAddress: toAddress,
  isValidAdrInput,
  onInput,
  validateAddressInput,
} = useAddressInput(selectedChain.value)

onMounted(async () => {
  //NOTE: The send module should not be loaded before the chains data has been retrieved.
  //AS of Right now, skeleton loader is shown while the chains data is being fetched.
  if (!wallet.value) return
  address.value = await wallet.value.getAddress()
})

const tokenSelected = computed(() => {
  if (isLoadingBalances.value || !tokenSelectedContract.value) {
    return null
  }
  return walletStore.getTokenBalance(tokenSelectedContract.value)
})

const checkAmountForError = () => {
  //TODO: IMPLEMENET PROPER TO BASE AMOUNT in tokens

  const baseTokenBalance = tokenSelected.value?.balanceWei || '0'
  const baseAmount = amount.value
    ? BigInt(toBase(amount.value, tokenSelected.value?.decimals || 18))
    : BigInt(0)
  if (amount.value === undefined || amount.value === '')
    amountError.value = t('error.amount.required') // amount is undefined or blank
  else if (baseAmount < 0)
    amountError.value = t('error.amount.less_than_zero') // amount less than 0
  else if (isWalletConnected.value && BigInt(baseTokenBalance) < baseAmount)
    amountError.value = t('error.balance.insufficient') // amount greater than selected balance
  else amountError.value = ''
}

// Gas Fee for display
const hasGasFees = computed(() => {
  return gasFees.value !== undefined && gasFees.value.fees !== undefined
})
const networkFeeUSD = computed(() => {
  if (!hasGasFees.value) return '0'
  return gasFees.value?.fees[selectedFee.value]?.fiatValue || '0'
})
const networkFeeCrypto = computed(() => {
  if (!hasGasFees.value) return '0'
  return fromWei(
    gasFees.value?.fees[selectedFee.value]?.nativeValue || 0,
    'ether',
  )
})

const validSend = computed(() => {
  return (
    amountError.value === '' &&
    toAddress.value !== undefined &&
    toAddressError.value === '' &&
    isValidAdrInput.value &&
    !isLoadingFees.value &&
    gasFeeError.value === ''
  )
})

const amountToFiat = computed(() => {
  if (isLoadingBalances.value || !tokenSelected.value?.price) return '0'
  return BigNumber(tokenSelected.value.price)
    .times(BigNumber(amount.value))
    .toFixed()
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
const amountToHex = computed(() => {
  const amountBase = Number(
    toBase(amount.value, tokenSelected.value?.decimals || 18),
  )
  return data.value === '0x' ? (toHex(amountBase) as HexPrefixedString) : '0x0'
})

const getTxRequestBody = (): EstimatesRequestBody | undefined => {
  if (
    tokenSelected.value &&
    tokenSelected.value.contract &&
    toAddress.value !== '' &&
    amount.value !== ''
  ) {
    const isSendingContractToken =
      tokenSelected.value.contract !== MAIN_TOKEN_CONTRACT
    if (isSendingContractToken) {
      const web3Contract = new Contract(abi, tokenSelected.value.contract)
      data.value = web3Contract.methods
        .transfer(
          toAddress.value,
          toBase(amount.value, tokenSelected.value?.decimals || 18),
        )
        .encodeABI() //
    } else {
      data.value = '0x'
    }
    return {
      to: isSendingContractToken
        ? tokenSelected.value.contract
        : (toAddress.value as HexPrefixedString),
      address:
        (address.value as HexPrefixedString) ||
        '0x0000000000000000000000000000000000000000',
      value: amountToHex.value,
      data: data.value as HexPrefixedString,
    }
  }
}

// Get Estimates
watchDebounced(
  () => [tokenSelected.value, amount.value, toAddress.value],
  async () => {
    gasFeeError.value = ''
    const body = getTxRequestBody()
    if (!body) return
    gasFeeTxEstimate.value = body
  },
  { debounce: 500, maxWait: 2000 },
)

const resetSendModule = () => {
  amount.value = '0'
  toAddress.value = ''
  signedTx.value = ''
}

// toast store
const toastStore = useToastStore()

// Get quotes:

const getGasFeeQuotes = async () => {
  try {
    const body = getTxRequestBody()
    if (!body || !tokenSelected.value || !validSend.value) return
    gasFeeTxEstimate.value = body
    isLoadingFees.value = true
    gasFees.value = await wallet.value?.getGasFee(gasFeeTxEstimate.value)
    //Check if user has enough balance to cover gas fees
    if (!gasFees.value?.fees || !gasFees.value.fees[selectedFee.value]) {
      gasFeeError.value = t('send.toast.failed_to_fetch_gas_fees')
    }
    const totalBalanceNeeded =
      BigInt(gasFees.value?.fees[selectedFee.value]?.nativeValue || '0') +
      BigInt(body.value)

    if (BigInt(totalBalanceNeeded) > BigInt(balanceWei.value)) {
      gasFeeError.value = t('send.toast.failed_to_fetch_gas_fees')
    }
    isLoadingFees.value = false
  } catch (e) {
    isLoadingFees.value = false
    //TODO: implement error localization
    if (e instanceof Error) {
      if (e.message) {
        gasFeeError.value = e.message.includes('insufficient funds')
          ? 'NOT_ENOUGH_BALANCE'
          : e.message
      } else {
        gasFeeError.value = t('send.toast.failed_to_fetch_gas_fees')
      }
    }
  }
}

const handleSubmit = async () => {
  gasFeeError.value = ''
  await getGasFeeQuotes()
  if (!wallet.value || !gasFees.value) return
  // generate signable transaction
  const signableTx = await wallet.value?.getSignableTransaction({
    priority: selectedFee.value,
    quoteId: gasFees.value.quoteId,
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
      signableTx.serialized as HexPrefixedString,
    )

    signedTx.value = signResponse.signed
    openTxModal.value = true
  } catch (e) {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: e instanceof Error ? e.message : t('send.toast.tx-send-failed'),
    })
  }
}
</script>
