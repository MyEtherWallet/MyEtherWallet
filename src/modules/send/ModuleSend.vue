<template>
  <div>
    <div
      class="static w-full flex flex-col items-center justify-items-stretch gap-1"
    >
      <div class="mb-3">
        <p class="font-bold text-s-28 ml-5 mb-4 mt-1 xs:mt-5">Send</p>
        <div class="p-4 rounded-20 bg-mewBg mb-2 relative">
          <div class="absolute -top-8 right-4">
            <app-btn-text class="text-primary ml-auto" @click="resetSendModule"
              >Clear all</app-btn-text
            >
          </div>
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
            @immediate-update:resolved-address="onInput"
          />
          <app-select-tx-fee
            :fees="gasFees"
            :is-loading-fees="isLoadingFees"
            :txRequestBody="gasFeeTxEstimate"
            v-model:gas-fee-error="gasFeeError"
          />
        </div>
      </div>
      <app-base-button
        v-if="isWalletConnected && !isWatchOnly"
        :disabled="!validSend"
        :is-loading="isLoadingFees"
        @click="handleSubmit"
        class="w-[70%]"
      >
        {{ $t('common.send') }}</app-base-button
      >
      <app-base-button class="w-[70%] capitalize" @click="connectWallet" v-else>
        {{ $t('common.connect_wallet') }}</app-base-button
      >
      <app-need-help
        :title="$t('send.need-help')"
        help-link="https://help.myetherwallet.com/en/article/what-is-gas"
        class="mt-5"
      />
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
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppEnterAmount from '@/components/AppEnterAmount.vue'
import AppSelectTxFee from '@/components/AppSelectTxFee.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import AddressInput from '@/components/address_book/AddressInput.vue'
import type {
  QuotesResponse,
  EstimatesRequestBody,
  GetBtcTransactionEstimateBody,
} from '@/mew_api/types'
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
import { useAccessStore } from '@/stores/accessStore'
import AppNeedHelp from '@/components/AppNeedHelp.vue'

const { t } = useI18n()
const walletStore = useWalletStore()
const {
  wallet,
  isWalletConnected,
  isLoadingBalances,
  balanceWei,
  isWatchOnly,
} = storeToRefs(walletStore)

/** ----------------
 * Current Selected Fee
 ------------------*/
const globalStore = useGlobalStore()
const { gasPriceType: selectedFee } = storeToRefs(globalStore)

// stored inputs
import { useInputStore } from '@/stores/inputStore'
const inputStore = useInputStore()
const { storeSendValues, clearSendValues } = inputStore
const { hasSendValues, sendValues } = storeToRefs(inputStore)

const chainsStore = useChainsStore()
const { selectedChain, isEvmChain, isBitcoinChain } = storeToRefs(chainsStore)
const amount = ref<number | string>('0')
const tokenSelectedContract: Ref<string> = ref(MAIN_TOKEN_CONTRACT)
const amountError = ref('')
const gasPrice = ref('30000000000') // TODO: Implement gas price once api is ready
const data = ref('0x')
const gasFeeTxEstimate = ref<
  EstimatesRequestBody | GetBtcTransactionEstimateBody | undefined
>(undefined)
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
  clearAddressInput,
} = useAddressInput(selectedChain)

onMounted(async () => {
  //NOTE: The send module should not be loaded before the chains data has been retrieved.
  //AS of Right now, skeleton loader is shown while the chains data is being fetched.
  if (!wallet.value) return
  address.value = await wallet.value.getAddress()

  if (hasSendValues.value) {
    amount.value = sendValues.value.amount
    toAddress.value = sendValues.value.toAddress
    tokenSelectedContract.value = sendValues.value.token
    clearSendValues()
  }
})

const tokenSelected = computed(() => {
  if (isLoadingBalances.value || !tokenSelectedContract.value) {
    return null
  }
  return walletStore.getTokenBalance(tokenSelectedContract.value)
})

const checkAmountForError = () => {
  //TODO: IMPLEMENET PROPER TO BASE AMOUNT in tokens

  const baseTokenBalance = BigInt(
    toBase(
      tokenSelected.value?.balance || '0',
      tokenSelected.value?.decimals ?? 18,
    ),
  )
  const baseAmount = amount.value
    ? BigInt(toBase(amount.value, tokenSelected.value?.decimals ?? 18))
    : BigInt(0)
  if (amount.value === undefined || amount.value === '')
    amountError.value = t('error.amount.required') // amount is undefined or blank
  else if (baseAmount < 0)
    amountError.value = t('error.amount.less_than_zero') // amount less than 0
  else if (isWalletConnected.value && BigInt(baseTokenBalance) < baseAmount) {
    amountError.value = t('error.balance.insufficient') // amount greater than selected balance
  } else amountError.value = ''
}

const accessStore = useAccessStore()

const connectWallet = () => {
  storeSendValues({
    toAddress: toAddress.value ?? '',
    amount: amount.value.toString(),
    token: tokenSelectedContract.value,
  })
  accessStore.openAccessDialog()
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
    const _fee = gasFees.value.fees[selectedFee.value]
    gasPrice.value = hexToBigInt(
      _fee.nativeValue ?? _fee.nativeFeeTotal,
    ).toString()
  },
)
const amountToHex = computed(() => {
  const amountBase = BigInt(
    toBase(Number(amount.value), tokenSelected.value?.decimals ?? 18),
  )
  return data.value === '0x' ? (toHex(amountBase) as HexPrefixedString) : '0x0'
})

const getTxRequestBody = ():
  | EstimatesRequestBody
  | GetBtcTransactionEstimateBody
  | undefined => {
  if (
    tokenSelected.value &&
    tokenSelected.value.contract &&
    toAddress.value !== '' &&
    amount.value !== ''
  ) {
    if (isEvmChain.value) {
      const isSendingContractToken =
        tokenSelected.value.contract !== MAIN_TOKEN_CONTRACT
      if (isSendingContractToken) {
        const web3Contract = new Contract(abi, tokenSelected.value.contract)
        data.value = web3Contract.methods
          .transfer(
            toAddress.value,
            toBase(amount.value, tokenSelected.value?.decimals ?? 18),
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
    } else if (isBitcoinChain.value) {
      return {
        fromAddresses: [address.value],
        changeAddress: address.value,
        outputs: [
          {
            address: toAddress.value ?? '',
            amount: toBase(amount.value, 8),
          },
        ],
      }
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
  clearAddressInput()
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
    if (isEvmChain.value) {
      gasFees.value = await wallet.value?.getGasFee?.(
        gasFeeTxEstimate.value as EstimatesRequestBody,
      )
    } else {
      gasFees.value = (await wallet.value?.getBtcGasFee?.(
        gasFeeTxEstimate.value as GetBtcTransactionEstimateBody,
      )) as QuotesResponse
    }
    //Check if user has enough balance to cover gas fees
    if (!gasFees.value?.fees || !gasFees.value.fees[selectedFee.value]) {
      gasFeeError.value = t('send.toast.failed_to_fetch_gas_fees')
    }
    const btcValue = (body as GetBtcTransactionEstimateBody).outputs?.[0].amount
    const evmValue = (body as EstimatesRequestBody).value
    const totalBalanceNeeded =
      BigInt(gasFees.value?.fees[selectedFee.value]?.nativeValue || '0') +
      BigInt(isEvmChain.value ? evmValue : (btcValue ?? 0))

    if (BigInt(totalBalanceNeeded) > BigInt(balanceWei.value)) {
      gasFeeError.value = t('send.toast.failed_to_fetch_gas_fees')
    }
    isLoadingFees.value = false
  } catch (e) {
    isLoadingFees.value = false
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
    wallet.value?.getWalletType() === WalletType.PRIVATE_KEY ||
    wallet.value?.getWalletType() === WalletType.MNEMONIC
  ) {
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
    return
  }

  openTxModal.value = true
  signedTx.value = signableTx.serialized
}
</script>
