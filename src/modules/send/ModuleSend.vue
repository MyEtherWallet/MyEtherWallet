<template>
  <div>
    <div class="static w-full flex flex-col items-center justify-items-stretch">
      <div class="w-full max-w-[500px]">
        <div class="flex items-end justify-between mb-4 px-4">
          <p class="font-bold text-s-28">{{ $t('common.send') }}</p>
          <app-base-button
            type="link"
            size="small"
            class="text-primary text-s-15 pb-1"
            @click="resetSendModule"
            >{{ $t('common.clear_all') }}</app-base-button
          >
        </div>
        <div class="p-5 rounded-20 bg-mewBg mb-6 flex flex-col gap-4">
          <app-enter-amount
            v-model:amount="amount"
            v-model:selected-token="tokenSelectedContract"
            v-model:error="amountError"
            :validate-input="checkAmountForError"
            :is-pristine="isPristine"
          >
            <template #balance-action>
              <div
                v-if="
                  isWalletConnected &&
                  !isWatchOnly &&
                  tokenSelected &&
                  isInternalWallet()
                "
              >
                <button
                  type="button"
                  class="px-2.5 py-0.5 text-s-11 leading-p-120 font-semibold bg-white hoverBGWhite rounded-full transition-all duration-150 shadow-button shadow-button-elevated"
                  @click="setMaxAmount"
                >
                  {{ $t('common.max') }}
                </button>
              </div>
            </template>
          </app-enter-amount>
          <address-input
            v-model:adr-input="adrInput"
            :resolved-address="toAddress"
            :address-error-messages="toAddressError"
            :network="selectedChain"
            :found-nick-name="foundNickName"
            :is-pristine="isPristine"
            @validate:address="validateAddressInput"
            @immediate-update:resolved-address="onInput"
          />
          <app-select-tx-fee
            v-if="isBitcoinChain ? hasChainBalance : true"
            :fees="gasFees"
            :is-loading-fees="isLoadingFees"
            :txRequestBody="gasFeeTxEstimate"
            v-model:gas-fee-error="gasFeeError"
            v-model:selected-fee-native-value="selectedFeeNativeValue"
            @fee-is-loading="setDefaultFee"
          />
        </div>
      </div>
      <app-base-button
        v-if="!isWalletConnected || isWatchOnly"
        class="w-full capitalize"
        @click="connectWallet"
      >
        {{ $t('common.connect_wallet') }}</app-base-button
      >
      <div v-else class="flex w-full">
        <app-no-chain-balance
          v-if="!hasChainBalance"
          source="send"
          class="mb-5 -mt-1"
        />
        <app-base-button
          v-else
          :disabled="!validSend"
          :is-loading="isLoadingFees"
          @click="handleSubmit"
          class="w-full max-w-[340px]"
        >
          {{ $t('common.send') }}</app-base-button
        >
      </div>

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
      @tx-sent="onTxSent"
    />
    <send-initiated-modal
      v-model:send-initiated-open="sendInitiatedOpen"
      :chain="sendModalData.chain"
      :tx-hash="sendModalData.txHash"
      :to-address="sendModalData.toAddress"
      :from-address="sendModalData.fromAddress"
      :amount="sendModalData.amount"
      :amount-fiat="sendModalData.amountFiat"
      :token-symbol="sendModalData.tokenSymbol"
      :token-icon="sendModalData.tokenIcon"
      :token-address="sendModalData.tokenAddress"
    />
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, computed, type Ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { fromWei } from 'web3-utils'
import { Contract } from 'web3-eth-contract'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppEnterAmount from '@/components/AppEnterAmount.vue'
import AppSelectTxFee from '@/components/AppSelectTxFee.vue'
import AddressInput from '@/components/address_book/AddressInput.vue'
import AppNoChainBalance from '@/components/AppNoChainBalance.vue'
import type {
  QuotesResponse,
  EstimatesRequestBody,
  BitcoinQuotesRequestBody,
} from '@/mew_api/types'
import { isP2shAddress } from '@/providers/common/btcInfo'
import { useWalletStore, MAIN_TOKEN_CONTRACT } from '@/stores/walletStore'
import { abi } from './tokenAbi'
import { type HexPrefixedString } from '@/providers/types'
import { hexToBigInt } from '@ethereumjs/util'
import EvmTransactionConfirmation from './components/EvmTransactionConfirmation.vue'
import SendInitiatedModal from './components/SendInitiatedModal.vue'
import BigNumber from 'bignumber.js'
import { useChainsStore } from '@/stores/chainsStore'
import { WalletType } from '@/providers/types'
import { useToastStore } from '@/stores/toastStore'
import { useGlobalStore } from '@/stores/globalStore'
import { ToastType } from '@/types/notification'
import { useI18n } from 'vue-i18n'
import { getLocalizedWalletError } from '@/utils/walletUtils'
import { formatUnits } from 'viem'
import { safeParseUnits } from '@/utils/unit'
import { watchDebounced } from '@vueuse/core'
import { useAddressInput } from '@/composables/useAddressInput'
import { useMaxAmount } from '@/composables/useMaxAmount'
import { useAccessStore } from '@/stores/accessStore'
import AppNeedHelp from '@/components/AppNeedHelp.vue'
import {
  analytics,
  ConnectWalletEvent,
  SendEvent,
  SendEventError,
} from '@/analytics'

const { t } = useI18n()
const walletStore = useWalletStore()
const {
  wallet,
  isWalletConnected,
  isLoadingBalances,
  balanceWei,
  isWatchOnly,
  hasChainBalance,
  walletAddress,
} = storeToRefs(walletStore)

/** ----------------
 * Current Selected Fee
 ------------------*/
const globalStore = useGlobalStore()
const { gasPriceType: selectedFee } = storeToRefs(globalStore)

// stored inputs
import { useInputStore } from '@/stores/inputStore'
import { useAddressBookStore, type Address } from '@/stores/addressBook'

const inputStore = useInputStore()
const { storeSendValues, clearSendValues } = inputStore
const { hasSendValues, sendValues } = storeToRefs(inputStore)
const { inAddressBook, addRecentAddress } = useAddressBookStore()

const chainsStore = useChainsStore()
const { selectedChain, isEvmChain, isBitcoinChain } = storeToRefs(chainsStore)
const amount = ref<number | string>('')
const tokenSelectedContract: Ref<string> = ref(MAIN_TOKEN_CONTRACT)
const amountError = ref('')
const isPristine = ref(true) // Track if form is in pristine (untouched/cleared) state
const gasPrice = ref('0x0')
const data = ref('0x')
const gasFeeTxEstimate = ref<
  EstimatesRequestBody | BitcoinQuotesRequestBody | undefined
>(undefined)
const gasFees: Ref<QuotesResponse | undefined> = ref(undefined)
const gasFeeError = ref('')
const selectedFeeNativeValue = ref('0')

const openTxModal = ref(false)
const sendInitiatedOpen = ref(false)
const isLoadingFees = ref(false)

const signedTx = ref<HexPrefixedString | string>('')
const sentTxHash = ref<HexPrefixedString>('0x')
const sendModalData = ref({
  chain: undefined as typeof selectedChain.value,
  txHash: '0x' as HexPrefixedString,
  toAddress: '',
  fromAddress: '',
  amount: '',
  amountFiat: '',
  tokenSymbol: '',
  tokenIcon: '',
  tokenAddress: '',
})
const address = ref('')
// 0x-prefixed compressed public key, populated for Bitcoin-family wallets;
// required to declare a P2SH from-address in the quote request.
const publicKey = ref('')
const foundNickName = ref('')

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
  publicKey.value = (await wallet.value.getPublicKey?.()) ?? ''

  if (hasSendValues.value) {
    isPristine.value = false // Restoring values means form is not pristine
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

const isNativeTokenSelected = computed(() => {
  return (
    tokenSelected.value?.contract.toLowerCase() ===
    MAIN_TOKEN_CONTRACT.toLowerCase()
  )
})

/** ----------------
 * Max Amount
 ------------------*/
const { setMaxAmount, resetMaxState, isInternalWallet, isMaxSelected } =
  useMaxAmount({
    getBalance: () => BigInt(tokenSelected.value?.balanceWei || '0'),
    getDecimals: () => tokenSelected.value?.decimals ?? 18,
    getEstimatedFee: () => BigInt(selectedFeeNativeValue.value || '0'),
    isNativeToken: () => isNativeTokenSelected.value,
    isTokenSelected: () => !!tokenSelected.value,
    amountRef: amount,
    isPristineRef: isPristine,
    getTokenIdentifier: () => tokenSelectedContract.value,
    getDependencies: () => [
      tokenSelected.value?.balanceWei,
      selectedFeeNativeValue.value,
    ],
    onMaxApplied: () => checkAmountForError(),
  })

const checkAmountForError = () => {
  // Skip validation if form is pristine (just cleared or initial state)
  if (isPristine.value) {
    amountError.value = ''
    return
  }
  //TODO: IMPLEMENET PROPER TO BASE AMOUNT in tokens

  const baseTokenBalance = safeParseUnits(
    tokenSelected.value?.balance || '0',
    tokenSelected.value?.decimals ?? 18,
  )
  const baseAmount = amount.value
    ? safeParseUnits(
        amount.value.toString(),
        tokenSelected.value?.decimals ?? 18,
      )
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
  analytics.trackConnectWalletEvent(ConnectWalletEvent.CLICKED, {
    source: 'Send',
  })
  accessStore.openAccessDialog()
}

// Gas Fee for display
const hasGasFees = computed(() => {
  return gasFees.value !== undefined && gasFees.value.fees !== undefined
})
const networkFeeUSD = computed(() => {
  if (!hasGasFees.value) return '0'
  const _fee = gasFees.value?.fees[selectedFee.value]
  return _fee?.fiatValue || _fee?.fiatFeeTotal || '0'
})
const networkFeeCrypto = computed(() => {
  if (!hasGasFees.value) return '0'
  const _fee = gasFees.value?.fees[selectedFee.value]
  const nativeValue = _fee?.nativeValue || _fee?.nativeFeeTotal || '0'
  return isEvmChain.value
    ? fromWei(nativeValue, 'ether')
    : formatUnits(BigInt(nativeValue), 8)
})

const defaultFeeIsFetching = ref(true)
const setDefaultFee = (isLoading: boolean) => {
  defaultFeeIsFetching.value = isLoading
}

const validSend = computed(() => {
  return (
    amount.value !== '' &&
    amountError.value === '' &&
    toAddress.value !== undefined &&
    toAddressError.value === '' &&
    isValidAdrInput.value &&
    !isLoadingFees.value &&
    !defaultFeeIsFetching.value &&
    gasFeeError.value === '' &&
    hasChainBalance.value
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
  const amountBase = safeParseUnits(
    amount.value.toString(),
    tokenSelected.value?.decimals ?? 18,
  )
  return data.value === '0x' ? `0x${amountBase.toString(16)}` : '0x0'
})

const getTxRequestBody = ():
  | EstimatesRequestBody
  | BitcoinQuotesRequestBody
  | undefined => {
  if (
    tokenSelected.value &&
    tokenSelected.value.contract &&
    toAddress.value &&
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
            safeParseUnits(
              amount.value.toString(),
              tokenSelected.value?.decimals ?? 18,
            ).toString(),
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
      const body: BitcoinQuotesRequestBody = {
        fromAddresses: [address.value],
        changeAddress: address.value,
        outputs: [
          {
            address: toAddress.value ?? '',
            amount: safeParseUnits(amount.value.toString(), 8).toString(),
          },
        ],
      }
      // A P2SH from-address must declare its type and public key so the backend
      // can build the correct redeem script for the quote.
      if (
        publicKey.value &&
        wallet.value &&
        isP2shAddress(address.value, wallet.value.getProvider())
      ) {
        body.p2shAddressTypes = [
          {
            address: address.value,
            type: 'P2SH_P2WPKH',
            publicKey: publicKey.value,
          },
        ]
      }
      return body
    }
  }
}

// Get Estimates
const prevToken = ref<string | null>(null)
const prevToAddress = ref<string | null>(null)

watchDebounced(
  () => [tokenSelected.value, amount.value, toAddress.value],
  async () => {
    gasFeeError.value = ''
    foundNickName.value = ''

    const currentToken = tokenSelected.value?.contract || null
    const currentToAddress = toAddress.value || null
    const onlyAmountChanged =
      prevToken.value === currentToken &&
      prevToAddress.value === currentToAddress &&
      prevToken.value !== null

    prevToken.value = currentToken
    prevToAddress.value = currentToAddress

    if (
      isMaxSelected.value &&
      onlyAmountChanged &&
      isNativeTokenSelected.value
    ) {
      return
    }

    const body = getTxRequestBody()
    const foundAddress = inAddressBook(
      toAddress.value || '',
      selectedChain.value?.type || '',
    )
    foundNickName.value = foundAddress ? (foundAddress as Address).name : ''
    if (!body) return
    gasFeeTxEstimate.value = body
  },
  { debounce: 500, maxWait: 2000 },
)

const resetSendModule = () => {
  isPristine.value = true // Reset to pristine state
  amountError.value = '' // Clear error immediately
  resetMaxState()
  amount.value = ''
  toAddress.value = ''
  signedTx.value = ''
  tokenSelectedContract.value = MAIN_TOKEN_CONTRACT
  clearAddressInput()
}

// Mark form as not pristine when user starts typing
watch(
  () => [amount.value, adrInput.value],
  ([newAmount, newAdr], [oldAmount, oldAdr]) => {
    if (
      (newAmount !== '' && oldAmount === '') ||
      (newAdr !== '' && oldAdr === '')
    ) {
      isPristine.value = false
    }
  },
)

watch(
  () => selectedChain.value,
  () => {
    resetSendModule()
  },
)

watch(
  () => walletAddress.value,
  () => {
    checkAmountForError()
  },
)

const onTxSent = (txHash: string) => {
  // Capture data for modal BEFORE reset
  sendModalData.value = {
    chain: selectedChain.value,
    txHash: txHash as HexPrefixedString,
    toAddress: toAddress.value || '',
    fromAddress: walletAddress.value || '',
    amount: new BigNumber(amount.value).toFixed(),
    amountFiat: amountToFiat.value,
    tokenSymbol: tokenSelected.value?.symbol || '',
    tokenIcon: tokenSelected.value?.logo_url || '',
    tokenAddress: tokenSelected.value?.contract || '',
  }
  sentTxHash.value = txHash as HexPrefixedString
  sendInitiatedOpen.value = true
  saveToAddressBookAfterSending()
}

const saveToAddressBookAfterSending = () => {
  if (toAddress.value) {
    const newAddress: Address = {
      address: toAddress.value || '',
      name: '',
      chainName: selectedChain.value?.name || '',
      chainType: selectedChain.value?.type || '',
    }
    addRecentAddress(newAddress, selectedChain.value?.name)
  }
  resetSendModule()
}

// toast store
const toastStore = useToastStore()

// Get quotes:
const getGasFeeQuotes = async () => {
  try {
    gasFeeError.value = ''
    const body = getTxRequestBody()
    if (!body || !tokenSelected.value) return
    gasFeeTxEstimate.value = body
    isLoadingFees.value = true
    if (isEvmChain.value) {
      gasFees.value = await wallet.value?.getGasFee?.(
        gasFeeTxEstimate.value as EstimatesRequestBody,
      )
    } else {
      gasFees.value = (await wallet.value?.getBtcGasFee?.(
        gasFeeTxEstimate.value as BitcoinQuotesRequestBody,
      )) as QuotesResponse
    }
    //Check if user has enough balance to cover gas fees
    if (!gasFees.value?.fees || !gasFees.value.fees[selectedFee.value]) {
      gasFeeError.value = t('send.toast.failed_to_fetch_gas_fees')
    }
    const btcValue = (body as BitcoinQuotesRequestBody).outputs?.[0].amount
    const evmValue = (body as EstimatesRequestBody).value
    const totalBalanceNeeded =
      BigInt(gasFees.value?.fees[selectedFee.value]?.nativeValue || '0') +
      BigInt(isEvmChain.value ? evmValue : (btcValue ?? 0))

    if (BigInt(totalBalanceNeeded) > BigInt(balanceWei.value)) {
      gasFeeError.value = t('send.toast.failed_to_fetch_gas_fees')
    }
    isLoadingFees.value = false
    return gasFees.value
  } catch (e) {
    if (e instanceof Error) {
      if (e.message) {
        const isInsufficientFundsError = e.message
          .toLowerCase()
          .includes('insufficient funds')
        const isERC20InsufficientBalance = e.message.includes(
          'ERC20InsufficientBalance',
        )
        const tokenHasBalance = BigInt(balanceWei.value || '0') > BigInt(0)
        if (isInsufficientFundsError) {
          gasFeeError.value = 'NOT_ENOUGH_BALANCE'
        } else if (isERC20InsufficientBalance && tokenHasBalance) {
          gasFeeError.value = t('send.toast.frozen_token')
        } else {
          gasFeeError.value = e.message
        }
      } else {
        gasFeeError.value = t('send.toast.failed_to_fetch_gas_fees')
      }
    }
    isLoadingFees.value = false
    return undefined
  }
}

const handleSubmit = async () => {
  analytics.trackSendEvent(SendEvent.CLICK_SEND, {
    token: tokenSelected.value?.symbol,
  })
  const latestGasFees = await getGasFeeQuotes()
  if (!wallet.value || !latestGasFees || gasFeeError.value) return
  // generate signable transaction
  const signableTx = await wallet.value?.getSignableTransaction({
    priority: selectedFee.value,
    quoteId: latestGasFees.quoteId,
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
      const errorMsg =
        e instanceof Error ? e.message : (e as { message?: string })?.message
      analytics.trackSendErrorEvent(SendEventError.SIGN_ERROR, {
        token: tokenSelected.value?.symbol,
        errorMsg: errorMsg ?? 'Unknown error during signing',
      })
      toastStore.addToastMessage({
        type: ToastType.Error,
        text: t('send.toast.failed_to_sign'),
        textSecondary: getLocalizedWalletError(errorMsg) ?? errorMsg,
      })
    }
    return
  }

  openTxModal.value = true
  signedTx.value = signableTx.serialized
}
</script>
