<template>
  <div>
    <div
      :class="[
        'static w-full flex flex-col items-center justify-items-stretch gap-3',
      ]"
    >
      <div class="w-full max-w-[500px] relative">
        <div :class="['flex items-end justify-between mb-2 px-4', blurClass]">
          <p class="font-bold text-s-28">
            {{ isSwapView ? 'Swap' : 'Bridge' }}
          </p>
          <app-btn-text
            v-if="supportedNetwork"
            class="text-primary text-s-14 pb-1"
            @click="clearValues"
            >Clear all</app-btn-text
          >
        </div>
        <div :class="['relative transition-all duration-300', blurClass]">
          <!-- From Section -->
          <div class="bg-mewBg rounded-20 px-4 pb-4 pt-2 mx-auto">
            <p
              class="text-s-12 font-bold ml-3"
              :class="{ 'mb-1': !isSwapView }"
            >
              You are selling
            </p>
            <select-chain-for-app
              v-if="!isSwapView"
              :passed-chains="fromChains"
            />
            <app-swap-enter-amount
              v-model:amount="fromAmount"
              v-model:selected-token="fromTokenSelected!"
              v-model:error="fromAmountError"
              :network-name="selectedChain?.name"
              :external-loading="fromLoadingState"
              :tokens="parsedFromTokens"
              :show-balance="isWalletConnected"
              :is-pristine="isPristine"
              :class="isSwapView ? 'mt-1' : 'mt-3'"
            />
          </div>

          <!-- Arrow Button -->
          <div class="relative h-0 z-10 flex justify-center items-center">
            <div
              class="absolute right-[50%+20px] top-[calc(50%-11px)] bg-white rounded-xl h-10 w-10 flex justify-center items-center"
            >
              <arrow-down-icon class="w-5 h-5 text-primary" />
            </div>
          </div>

          <!-- To Section -->
          <div class="bg-mewBg rounded-20 px-4 pb-4 pt-2 mx-auto mt-2">
            <p class="text-s-12 font-bold ml-3">You are buying</p>
            <select-chain-for-app
              :can-store="false"
              :passed-chains="parsedToChains"
              :preselected-chain="selectedToChain"
              :class="{
                hidden:
                  isSwapView &&
                  selectedChain?.name === selectedToChain?.name &&
                  !isBitcoinChain,
              }"
              @update:selected-chain="setToChain"
            />
            <app-swap-enter-amount
              v-model:amount="toAmount"
              v-model:selected-token="toTokenSelected!"
              v-model:error="toAmountError"
              :external-loading="toLoadingState"
              :show-balance="false"
              :tokens="filteredToTokens"
              :readonly="true"
              :is-estimate="true"
              :is-from-view="false"
              :network-name="selectedToChain?.name"
              :is-pristine="isPristine"
              :class="
                isSwapView &&
                selectedChain?.name === selectedToChain?.name &&
                !isBitcoinChain
                  ? 'mt-1'
                  : 'mt-3'
              "
            />
            <div
              class="pt-4"
              v-if="(!isSwapView && isCrossChain) || isBitcoinChain"
            ></div>
            <address-input
              v-if="(!isSwapView && isCrossChain) || isBitcoinChain"
              v-model:adr-input="userToAddress"
              :resolved-address="toAddress"
              :found-nick-name="foundNickName"
              :address-error-messages="toAddressError"
              :network="selectedToChain"
              :is-pristine="isPristine"
              @validate:address="validateToAddress"
            />
          </div>
        </div>

        <!-- Network Not Supported Banner - Centered Overlay -->
        <div
          v-if="swapLoaded && !supportedNetwork"
          class="absolute flex top-[100px] z-20 pointer-events-none"
        >
          <div
            class="w-full max-w-[380px] px-5 py-5 bg-white border border-warning rounded-16 shadow-button shadow-button-elevated pointer-events-auto"
          >
            <div class="flex items-center gap-2 justify-center mb-2">
              <exclamation-circle-icon class="w-5 h-5 text-warning" />
              <p class="text-warning font-medium text-s-16">
                Network Not Supported
              </p>
            </div>
            <p class="text-info text-s-14 text-center mb-4">
              {{ isSwapView ? 'Swapping' : 'Bridging' }} is not available on
              {{ selectedChain?.nameLong || selectedChain?.name }}. Please
              switch to a supported network.
            </p>

            <select-chain-for-app
              :passed-chains="fromChains"
              :preselected-chain="defualtChainWhenNetworkUnsupported"
              :can-store="false"
              id="SWAP:NetworkNotSupported"
              class="mt-4"
              @update:selected-chain="switchGlobalNetwork"
            />
          </div>
        </div>
      </div>

      <!-- Error Display -->
      <div
        v-if="!isLoading && generalError"
        :class="blurClass"
        class="w-full max-w-[340px] p-4 bg-error-10 border border-error rounded-12 mb-2"
      >
        <p class="text-error text-s-14 text-center">
          {{ generalError }}
        </p>
      </div>
      <app-base-button
        v-if="!isWalletConnected || isWatchOnly"
        :class="['mx-auto w-full max-w-[340px]', blurClass]"
        @click="connectWalletForSwap"
      >
        {{ t('connect_wallet') }}</app-base-button
      >
      <div v-else :class="['w-full max-w-[340px]', blurClass]">
        <transition name="fade" mode="out-in">
          <app-no-chain-balance v-if="!hasChainBalance" class="mb-5 -mt-1" />
          <app-base-button
            v-else
            :disabled="isSwapDisabled"
            @click="swapButton"
            class="w-full"
          >
            {{ isSwapView ? 'Swap' : 'Bridge' }}</app-base-button
          >
        </transition>
      </div>

      <app-need-help
        title="Need help swaping?"
        help-link="https://help.myetherwallet.com/en/article/what-is-gas"
        class="mx-auto"
        :class="blurClass"
      />
    </div>
    <best-offer-modal v-model:best-offer-open="bestSwapLoadingOpen" />
    <swap-offer-modal
      v-model:swap-offer-open="bestOfferSelectionOpen"
      v-model:selected-quote="selectedQuote"
      v-model:loading="txProceeding"
      @update:proceedWithSwap="proceedWithSwap"
      @update:declineSwap="bestOfferSelectionOpen = false"
      :quotes="providers"
      :amount="fromAmount"
      :from-chain="selectedChain"
      :to-chain="selectedToChain"
      :swap-info="swapInfo || undefined"
      :swap-gas-fee-quote="swapGasFeeQuote || undefined"
      :swap-fee-error="swapFeeError"
    />
    <swap-initiated-modal
      v-model:swap-initiated-open="swapInitiatedOpen"
      :from-chain="selectedChain"
      :to-chain="selectedToChain"
      :selected-quote="selectedQuote"
      :tx-hash="txHash"
      :to-address="toAddress"
      :from-address="userAddress"
      :swap-gas-fee-quote="swapGasFeeQuote"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, computed, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import BigNumber from 'bignumber.js'
import { useI18n } from 'vue-i18n'
import { useDebounceFn } from '@vueuse/core'
import { ArrowDownIcon, ExclamationCircleIcon } from '@heroicons/vue/24/solid'

// Components
import AppBaseButton from '@/components/AppBaseButton.vue'
import BestOfferModal from './components/BestOfferModal.vue'
import SwapOfferModal from './components/SwapOfferModal.vue'
import SwapInitiatedModal from './components/SwapInitiatedModal.vue'
import AppNeedHelp from '@/components/AppNeedHelp.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import SelectChainForApp from '@/components/select_chain/SelectChainForApp.vue'
import AppSwapEnterAmount from '@/components/AppSwapEnterAmount.vue'
import AddressInput from '@/components/address_book/AddressInput.vue'
import AppNoChainBalance from '@/components/AppNoChainBalance.vue'

// Stores and Composables
import { useWalletStore, MAIN_TOKEN_CONTRACT } from '@/stores/walletStore'
import { useSwap, type NewTokenInfo } from '@/composables/useSwap'
import { useChainsStore } from '@/stores/chainsStore'
import { useGlobalStore } from '@/stores/globalStore'
import { useInputStore } from '@/stores/inputStore'
import { useToastStore } from '@/stores/toastStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useAccessStore } from '@/stores/accessStore'
import { useAddressBookStore, type Address } from '@/stores/addressBook'
import { analytics, ConnectWalletEvent } from '@/analytics'

// Utils and Types
import {
  enumToChain,
  supportedSwapEnums,
} from '@/providers/ethereum/chainToEnum'
import { formatUnits, parseUnits } from 'viem'
import dataTxAction from '@/utils/dataTxAction'
import {
  type Chain,
  type EvmTransactionAction,
  type QuotesResponse,
} from '@/mew_api/types'
import {
  type ProviderQuoteResponse,
  type ProviderSwapResponse,
  type EVMTransaction,
  type TokenType,
  type GenericTransaction,
  getSupportedNetworks,
} from '@enkryptcom/swap'
import {
  GasPriceType,
  WalletType,
  type HexPrefixedString,
} from '@/providers/types'
import { ToastType } from '@/types/notification'
import configs from '@/configs'
import { isSignableWallet } from '@/utils/walletUtils'
import { captureException } from '@sentry/vue'

const isDevMode = configs.IS_DEV_MODE

// --- Stores ---
const walletMenu = useWalletMenuStore()
const { walletPanel } = storeToRefs(walletMenu)
const { inAddressBook, addAddress } = useAddressBookStore()
const walletStore = useWalletStore()
const globalStore = useGlobalStore()
const chainsStore = useChainsStore()
const inputStore = useInputStore()
const toastStore = useToastStore()
const accessStore = useAccessStore()
const { t } = useI18n()

// --- Refs from Stores ---
const { gasPriceType } = storeToRefs(globalStore)
const {
  isWalletConnected,
  walletAddress,
  wallet,
  isWatchOnly,
  tokens,
  balanceWei,
  hasChainBalance,
} = storeToRefs(walletStore)
const { selectedChain, isBitcoinChain, chains } = storeToRefs(chainsStore)
const { hasSwapValues, swapValues } = storeToRefs(inputStore)
const { storeSwapValues, clearSwapValues } = inputStore

// --- Use Swap Composable ---
const {
  initSwapper,
  supportedNetwork,
  swapLoaded,
  toChains,
  fromTokens,
  toTokens,
  getQuote,
  getSwap,
} = useSwap()

// --- Local State ---

// Selections
const selectedToChain = ref<Chain>()
const fromTokenSelected = ref<NewTokenInfo | null>(null)
const toTokenSelected = ref<NewTokenInfo | null>(null)

// Error State
const toAddressError = ref<string>('')
const generalError = ref<string>('')
const isPristine = ref(true) // Track if form is in pristine (untouched/cleared) state

// Data Models
const fromAmount = ref<string>('')
const toAmount = ref<string>('')
const userToAddress = ref<string>('')
const foundNickName = ref<string>('')
const providers = ref<ProviderQuoteResponse[]>([])
const selectedQuote = ref<ProviderQuoteResponse | undefined>(undefined)
const swapInfo = ref<ProviderSwapResponse | null>(null)
const swapGasFeeQuote = ref<QuotesResponse | undefined>(undefined)
const txHash = ref<HexPrefixedString>('0x')
const localToTokens = ref<NewTokenInfo[]>([])

// UI Loading States
const isLoadingQuotes = ref(false)
const bestSwapLoadingOpen = ref(false)
const bestOfferSelectionOpen = ref(false)
const swapInitiatedOpen = ref(false)
const txProceeding = ref(false)

// --- Computed Helpers ---
const isSwapView = computed(() => walletPanel.value === 'swap')

const isCrossChain = computed(
  () => selectedChain.value?.type !== selectedToChain.value?.type,
)

const isSameToken = computed(() => {
  if (!fromTokenSelected.value || !toTokenSelected.value) return false
  return (
    selectedChain.value?.name === selectedToChain.value?.name &&
    fromTokenSelected.value.address.toLowerCase() ===
      toTokenSelected.value.address.toLowerCase()
  )
})

const parsedFromTokens = computed<NewTokenInfo[]>(() => {
  if (!fromTokens.value || !selectedChain.value || !selectedToChain.value)
    return []
  return fromTokens.value
})

const filteredToTokens = computed<NewTokenInfo[]>(() => {
  if (
    !fromTokenSelected.value ||
    selectedChain.value?.name !== selectedToChain.value?.name
  )
    return localToTokens.value
  return localToTokens.value.filter(
    t =>
      t.address.toLowerCase() !==
      fromTokenSelected.value!.address.toLowerCase(),
  )
})

const parsedToChains = computed<Chain[]>(() => {
  if (!toChains.value) return []
  if (isBitcoinChain.value) {
    return toChains.value.filter(chain => chain.name !== 'BITCOIN')
  }
  return toChains.value
})

const userAddress = computed(
  () => walletAddress.value || configs.MEW_DONATION_ADDRESS,
)

const isLoading = computed(() => !swapLoaded.value || isLoadingQuotes.value)

const fromChains = computed(() => {
  const supportedNetworks = getSupportedNetworks()
  return supportedNetworks
    .map(chain => {
      const toChainByEnum = enumToChain[chain.id]
      if (!toChainByEnum) return null
      return chains.value.find(c => c.name === toChainByEnum) || null
    })
    .filter((chain): chain is Chain => chain !== null)
})

const defualtChainWhenNetworkUnsupported = computed(() => {
  return (
    fromChains.value.filter(chain => chain.name === 'ETHEREUM')[0] ||
    fromChains.value[0]
  )
})

const blurClass = computed(() => {
  return swapLoaded && !supportedNetwork.value
    ? 'blur-sm pointer-events-none opacity-60'
    : ''
})

const toAddress = computed(() => {
  if (selectedToChain.value?.name === selectedChain.value?.name)
    return userAddress.value
  if (!isCrossChain.value) return userAddress.value
  return userToAddress.value || ''
})

const toLoadingState = computed(() => isLoading.value)
const fromLoadingState = computed(() => !swapLoaded.value)

const fromAmountError = computed(() => {
  if (!fromAmount.value || fromAmount.value === '0' || fromAmount.value === '')
    return t('swap.error.amount-required')

  if (!fromTokenSelected.value) return ''

  // Validate Decimals
  const decimals = fromTokenSelected.value.decimals || 18
  if (BigNumber(fromAmount.value).toFixed().split('.')[1]?.length > decimals) {
    return t('swap.error.too-many-decimals')
  }

  // Ensure > 0
  const amountBN = BigNumber(fromAmount.value)
  if (amountBN.lte(0)) return t('swap.error.more-than-zero')

  // Calculate Base Units
  const baseAmount = parseUnits(amountBN.toFixed(), decimals)

  // Balance Check
  const tokenParams = getTokenBalanceParams(fromTokenSelected.value)
  const remainingBalance = tokenParams.totalBalance - baseAmount

  // Insufficient Balance Error
  if (isWalletConnected.value && tokenParams.baseBalance < baseAmount) {
    return t('swap.error.insufficient-native', {
      symbol: fromTokenSelected.value.symbol,
    })
  }

  if (selectedQuote.value) {
    // Fee Check
    const fees = BigInt(
      selectedQuote.value.additionalNativeFees?.toString() || '0',
    )
    if (isWalletConnected.value && fees > remainingBalance) {
      return t('swap.error.insufficient-balance-for-fees', {
        symbol: selectedChain.value?.currencyName,
      })
    }

    // Min/Max Check
    const min = BigInt(
      selectedQuote.value.minMax?.minimumFrom.toString() || '0',
    )
    const max = BigInt(
      selectedQuote.value.minMax?.maximumFrom.toString() || '0',
    )
    if (baseAmount < min) return t('swap.error.minimum-amount')
    if (baseAmount > max) return t('swap.error.maximum-amount')
  }

  return ''
})

const toAmountError = computed(() => {
  // In bridge mode, if toAddress is missing, don't show "no quotes" — the address input handles it
  if (isCrossChain.value && !toAddress.value) {
    return ''
  }
  if (
    !isLoading.value &&
    qoutesError.value &&
    fromAmount.value !== '0' &&
    fromAmount.value !== '' &&
    fromAmountError.value === ''
  ) {
    return t('swap.error.no-quotes')
  }
  return ''
})

const isSwapDisabled = computed(
  () =>
    (swapLoaded.value && !supportedNetwork.value) ||
    !(
      fromAmount.value !== '' &&
      fromAmount.value !== '0' &&
      fromAmountError.value === '' &&
      toAmount.value !== '0'
    ) ||
    (isCrossChain.value && toAddressError.value !== '') ||
    isLoadingQuotes.value ||
    !hasChainBalance.value ||
    isSameToken.value,
)

// --- Helper Methods ---

const getTokenBalanceParams = (token: NewTokenInfo) => {
  const isMainToken = token.address === MAIN_TOKEN_CONTRACT
  const balance = token.balance || '0'
  const baseTokenBalance = walletStore.getTokenBalance(MAIN_TOKEN_CONTRACT)
  const baseNetworkBalance = parseUnits(
    baseTokenBalance?.balance || '0',
    baseTokenBalance?.decimals || 18,
  )

  const baseBalance = isMainToken ? baseNetworkBalance : BigInt(balance)
  // For calculating remaining balance (native logic)
  const totalBalance =
    isMainToken && isWalletConnected.value
      ? baseNetworkBalance
      : BigInt(balance)

  return { baseBalance, totalBalance, baseNetworkBalance }
}

const switchGlobalNetwork = (chain: Chain) => {
  globalStore.setSelectedNetwork(chain.name)
}

const clearValues = () => {
  isPristine.value = true // Reset to pristine state
  toAddressError.value = '' // Clear error immediately
  generalError.value = '' // Clear general error
  clearSwapValues()
  fromAmount.value = ''
  toAmount.value = ''
  userToAddress.value = ''
  foundNickName.value = ''
  selectedQuote.value = undefined
  // Reset token selections so setToToken/setFromToken will set defaults
  fromTokenSelected.value = null
  toTokenSelected.value = null
  setToToken()
  setFromToken()
}

const validateToAddress = async () => {
  // Skip validation if form is pristine
  if (isPristine.value) {
    toAddressError.value = ''
    return
  }
  if (!userToAddress.value) {
    toAddressError.value = 'Recipient address is required for bridging'
    return
  }
  const valid = await toTokenSelected.value?.networkInfo.isAddress(
    userToAddress.value,
  )
  toAddressError.value = valid ? '' : 'invalid address'
}

// --- Swap Logic & Transactions ---

const handleBitcoinTransaction = async (quoteId: string) => {
  const txCtx = wallet.value
  if (!txCtx) return

  const signableTx = await txCtx.getSignableTransaction({
    priority: gasPriceType.value as GasPriceType,
    quoteId: quoteId,
  })

  const isHardware =
    txCtx.getWalletType() !== WalletType.WAGMI &&
    txCtx.getWalletType() !== WalletType.INJECTED

  if (!isHardware) {
    return txCtx.SendTransaction?.(signableTx.serialized as HexPrefixedString)
  } else {
    const signedTx = await txCtx.SignTransaction?.(
      signableTx.serialized as HexPrefixedString,
    )
    return txCtx.broadcastTransaction(
      signedTx?.signed as unknown as HexPrefixedString,
    )
  }
}

const handleEvmTransaction = async (quoteId: string) => {
  const txCtx = wallet.value
  if (!txCtx) return

  const txs = await txCtx.getMultipleSignableTransactions?.({
    priority: gasPriceType.value as GasPriceType,
    quoteId: quoteId,
  })

  if (!txs?.serialized?.length) return

  let lastTxPromise

  for (const [index, tx] of txs.serialized.entries()) {
    const isLast = index === txs.serialized.length - 1
    if (!tx) continue

    if (!isSignableWallet(txCtx)) {
      const broadcast = await txCtx.SendTransaction?.(tx as HexPrefixedString)
      if (isLast) lastTxPromise = broadcast
    } else {
      const signedTx = await txCtx.SignTransaction?.(tx as HexPrefixedString)
      const broadcast = txCtx.broadcastTransaction(
        signedTx?.signed as unknown as HexPrefixedString,
      )
      await new Promise(resolve => setTimeout(resolve, 1000))
      if (isLast) lastTxPromise = broadcast
    }
  }
  return lastTxPromise
}

const proceedWithSwap = async (quoteId: string) => {
  txProceeding.value = true
  generalError.value = ''
  try {
    let txPromise: Promise<string> | undefined

    if (isBitcoinChain.value) {
      txPromise = handleBitcoinTransaction(
        quoteId,
      ) as unknown as Promise<string>
    } else {
      txPromise = handleEvmTransaction(quoteId) as unknown as Promise<string>
    }

    if (txPromise) {
      const hash = await txPromise
      txHash.value = hash as HexPrefixedString
      bestOfferSelectionOpen.value = false
      swapInitiatedOpen.value = true
    }
  } catch (e: any) {
    const errorMessage =
      e instanceof Error && e.message
        ? e.message.toLowerCase()
        : typeof e === 'string'
          ? e
          : t('swap.toast.tx-sign-failed')
    if (errorMessage.includes('user rejected')) {
      toastStore.addToastMessage({
        type: ToastType.Info,
        text: 'Swap canceled by user',
      })
    } else {
      generalError.value = errorMessage
      toastStore.addToastMessage({
        type: ToastType.Error,
        text: 'Swap Failed',
        textSecondary: errorMessage,
        duration: 10000,
      })
      if (isDevMode) {
        console.error('Error proceeding with swap:', e)
      } else {
        captureException(e, {
          extra: {
            title: 'SWAP: Error proceeding with swap',
            errorMessage,
          },
        })
      }
    }
  } finally {
    txProceeding.value = false
  }
}

// --- Pre-Swap & Quotes ---

const swapFeeError = computed<string | undefined>(() => {
  if (
    !swapGasFeeQuote.value?.fees ||
    !swapGasFeeQuote.value.fees[gasPriceType.value] ||
    fromTokenSelected.value === null
  ) {
    return undefined
  }
  const isMainToken = fromTokenSelected.value.address === MAIN_TOKEN_CONTRACT
  const fee = BigInt(
    swapGasFeeQuote.value?.fees[gasPriceType.value]?.nativeValue || '0',
  )
  const mainTokenBalance = BigInt(balanceWei.value)

  if (!isMainToken) {
    if (fee > mainTokenBalance) {
      return 'NOT_ENOUGH_BALANCE'
    }
  } else {
    const totalBalanceNeeded =
      fee +
      BigInt(parseUnits(fromAmount.value, fromTokenSelected.value.decimals))
    if (totalBalanceNeeded > mainTokenBalance) {
      return 'NOT_ENOUGH_BALANCE'
    }
  }
  return undefined
})
const swapForBtc = async () => {
  bestSwapLoadingOpen.value = true
  generalError.value = ''
  try {
    await debounceFetchQuotes()

    const transactions = (
      (swapInfo.value?.transactions as GenericTransaction[]) || []
    ).map(tx => ({ address: tx.to, amount: tx.value }))

    const txForm = {
      fromAddresses: [userAddress.value],
      consolidationAddress: userAddress.value,
      outputs: transactions,
    }

    const res = await wallet.value?.getBtcGasFee?.(txForm)
    swapGasFeeQuote.value = (res as QuotesResponse) || undefined
    bestOfferSelectionOpen.value = true
  } catch (e: any) {
    generalError.value = e?.message || 'Error fetching BTC gas fees'
    if (isDevMode) {
      console.error('Error fetching BTC gas fees:', e)
    } else {
      captureException(e, {
        extra: {
          title: 'SWAP: Error fetching BTC gas fees',
          errorMessage: generalError.value,
        },
      })
    }
  } finally {
    bestSwapLoadingOpen.value = false
  }
}

const swapForEvm = async () => {
  bestSwapLoadingOpen.value = true
  generalError.value = ''
  try {
    await debounceFetchQuotes()

    // Filter for EVM Transactions
    const transactions = (swapInfo.value?.transactions || []).filter(
      (tx): tx is EVMTransaction => 'gasLimit' in tx && 'data' in tx,
    )

    const parsedTransactions = transactions.map(tx => ({
      address: tx.from,
      to: tx.to,
      data: tx.data,
      value: tx.value || '0x0',
      action: dataTxAction(tx) as EvmTransactionAction,
    }))
    if (!swapInfo.value) {
      throw new Error('Pair currently not available')
    }
    const res = await wallet.value?.getMultipleGasFees?.(parsedTransactions)
    swapGasFeeQuote.value = res || undefined
    bestOfferSelectionOpen.value = true
  } catch (e: any) {
    generalError.value = e?.message || 'Error fetching gas fees'
    if (isDevMode) {
      console.error('Error fetching gas fees:', e)
    } else {
      captureException(e, {
        extra: {
          title: 'SWAP: Error fetching gas fees',
          errorMessage: generalError.value,
        },
      })
    }
  } finally {
    bestSwapLoadingOpen.value = false
  }
}

const swapButton = () => {
  return isBitcoinChain.value ? swapForBtc() : swapForEvm()
}

const qoutesError = ref<boolean>(false)

const fetchQuotes = async () => {
  if (!fromTokenSelected.value || !toTokenSelected.value || isSameToken.value)
    return
  isLoadingQuotes.value = true
  providers.value = []
  selectedQuote.value = undefined

  generalError.value = ''
  toAmount.value = '0'
  qoutesError.value = false
  try {
    const quotes = await getQuote({
      fromToken: fromTokenSelected.value,
      toToken: toTokenSelected.value,
      amount: fromAmount.value,
      fromAddress: userAddress.value,
      toAddress: toAddress.value,
    })

    if (quotes && quotes.length > 0) {
      const fromDecimals = fromTokenSelected.value?.decimals || 18
      const fromAmountBase = parseUnits(fromAmount.value, fromDecimals)

      providers.value = quotes
        .sort((a, b) => {
          const aMin = BigInt(a.minMax.minimumFrom.toString())
          const bMin = BigInt(b.minMax.minimumFrom.toString())
          return aMin > bMin ? 1 : bMin > aMin ? -1 : 0
        })
        .filter(
          quote =>
            BigInt(quote.minMax.minimumFrom.toString()) <= fromAmountBase,
        )

      selectedQuote.value = providers.value[0] || undefined
      if (providers.value.length === 0) {
        qoutesError.value = true
      }
    } else {
      qoutesError.value = true
    }
  } catch (err: any) {
    generalError.value = t('swap.error.fetching-quotes')
    if (isDevMode) {
      console.error('Error fetching quotes:', err)
    } else {
      captureException(err, {
        extra: {
          title: 'SWAP: fetchQuotes Error',
          errorMessage: err?.message || 'Unknown error',
        },
      })
    }
  } finally {
    isLoadingQuotes.value = false
  }
}

const debounceFetchQuotes = useDebounceFn(fetchQuotes, 750)

// --- Token Setup Methods ---

const setToChain = (chain: Chain) => {
  if (hasSwapValues.value) {
    selectedToChain.value = swapValues.value.toChain
  } else if (chain) {
    selectedToChain.value = chain
  }
  toAmount.value = ''
  setToToken()
}

const setToToken = () => {
  const currentToChain = selectedToChain.value
  if (!currentToChain) {
    if (!hasSwapValues.value) return
    generalError.value = t('swap.toast.select-chain')
    return
  }

  const enkryptEnum = supportedSwapEnums[currentToChain.name]
  if (!enkryptEnum) {
    generalError.value = t('swap.toast.unsupported-chain')
    return
  }

  // 1. Prepare Local To Tokens
  const allToTokensRaw =
    toTokens.value?.all[enkryptEnum as keyof typeof toTokens.value.all] || []

  localToTokens.value = allToTokensRaw.map((token: TokenType) => {
    let tokenBalance = '0'
    let tokenPrice = token.price
    const sameNetworks = currentToChain.name === selectedChain.value?.name
    if (sameNetworks && (tokens.value.length > 0 || balanceWei.value !== '0')) {
      if (token.address.toLowerCase() === MAIN_TOKEN_CONTRACT) {
        tokenBalance = balanceWei.value
        tokenPrice = tokenPrice || selectedChain.value?.price || 0
      } else {
        const found = tokens.value.find(
          t => t.contract.toLowerCase() === token.address.toLowerCase(),
        )
        if (found) {
          tokenBalance = found.balanceWei
          tokenPrice = tokenPrice || (found as any).price || 0
        }
      }
    }
    return {
      ...token,
      balance: tokenBalance,
      price: tokenPrice,
    } as NewTokenInfo
  })

  // 2. Select Token Logic
  if (hasSwapValues.value) {
    // Deep link / restore values - use stored token

    const match = localToTokens.value.find(
      t =>
        t.address.toLowerCase() ===
        swapValues.value.toToken.address.toLowerCase(),
    )
    if (match) {
      toTokenSelected.value = match
    } else if (localToTokens.value.length > 0) {
      const fallback = localToTokens.value[0]
      toTokenSelected.value = {
        ...fallback,
        balance: formatUnits(
          BigInt(fallback.balance?.toString() ?? '0'),
          fallback.decimals ?? 18,
        ),
      } as NewTokenInfo
    }
  } else if (toTokenSelected.value) {
    // Token already selected and no stored values - keep selection if it exists in list
    const sameNetworks = currentToChain.name === selectedChain.value?.name
    const existsInList = localToTokens.value.find(
      t =>
        t.address.toLowerCase() ===
        toTokenSelected.value?.address?.toLowerCase(),
    )
    const collidesWithFrom =
      sameNetworks &&
      fromTokenSelected.value &&
      toTokenSelected.value.address.toLowerCase() ===
        fromTokenSelected.value.address.toLowerCase()

    if (existsInList && !collidesWithFrom) {
      // Update with fresh data but keep selection
      toTokenSelected.value = existsInList as NewTokenInfo
      return
    }
    // Selected token doesn't exist in new list, fall through to default selection
    if (toTokens.value && allToTokensRaw.length > 0) {
      const allToTrending =
        toTokens.value.trending[
          enkryptEnum as keyof typeof toTokens.value.trending
        ]
      const candidates = allToTrending?.length ? allToTrending : allToTokensRaw
      const sameNetworks = currentToChain.name === selectedChain.value?.name

      const defaultToken = sameNetworks
        ? candidates.find(
            t =>
              t.address.toLowerCase() !==
              fromTokenSelected.value?.address.toLowerCase(),
          )
        : candidates[0]

      if (defaultToken) {
        toTokenSelected.value = {
          ...defaultToken,
          balance: formatUnits(
            BigInt(defaultToken.balance?.toString() ?? '0'),
            defaultToken.decimals ?? 18,
          ),
        } as NewTokenInfo
      }
    }
  } else {
    // No token selected, no stored values - use default
    if (toTokens.value && allToTokensRaw.length > 0) {
      const allToTrending =
        toTokens.value.trending[
          enkryptEnum as keyof typeof toTokens.value.trending
        ]
      const candidates = allToTrending?.length ? allToTrending : allToTokensRaw
      const sameNetworks = currentToChain.name === selectedChain.value?.name

      const defaultToken = sameNetworks
        ? candidates.find(
            t =>
              t.address.toLowerCase() !==
              fromTokenSelected.value?.address.toLowerCase(),
          )
        : candidates[0]

      if (defaultToken) {
        toTokenSelected.value = {
          ...defaultToken,
          balance: formatUnits(
            BigInt(defaultToken.balance?.toString() ?? '0'),
            defaultToken.decimals ?? 18,
          ),
        } as NewTokenInfo
      }
    }
  }
}

const setFromToken = () => {
  if (!fromTokens.value?.length) return

  if (hasSwapValues.value) {
    // Deep link / restore values - use stored token
    const match = fromTokens.value.find(
      t =>
        t.address.toLowerCase() ===
        swapValues.value.fromToken.address?.toLowerCase(),
    )
    fromTokenSelected.value = (match || fromTokens.value[0]) as NewTokenInfo
  } else if (fromTokenSelected.value) {
    // Token already selected and no stored values - keep selection if it exists in list
    const existsInList = fromTokens.value.find(
      t =>
        t.address.toLowerCase() ===
        fromTokenSelected.value?.address?.toLowerCase(),
    )
    if (existsInList) {
      // Update with fresh data but keep selection
      fromTokenSelected.value = existsInList as NewTokenInfo
      return
    }
    // Selected token doesn't exist in new list, fall through to default
    const mewToken = fromTokens.value.find(
      t => t.address.toLowerCase() === MAIN_TOKEN_CONTRACT,
    )
    fromTokenSelected.value = (mewToken || fromTokens.value[0]) as NewTokenInfo
  } else {
    // No token selected, no stored values - use default
    const mewToken = fromTokens.value.find(
      t => t.address.toLowerCase() === MAIN_TOKEN_CONTRACT,
    )
    fromTokenSelected.value = (mewToken || fromTokens.value[0]) as NewTokenInfo
  }
}

const connectWalletForSwap = () => {
  if (swapLoaded.value && supportedNetwork.value) {
    storeSwapValues({
      fromToken: fromTokenSelected.value!,
      toToken: toTokenSelected.value!,
      toChain: selectedToChain.value!,
      fromAmount: fromAmount.value,
    })
  }
  const source = isSwapView.value ? 'Swap' : 'Bridge'
  analytics.trackConnectWalletEvent(ConnectWalletEvent.CLICKED, {
    source,
  })
  accessStore.openAccessDialog()
}

// --- Watchers ---

// Deep Link / Swap Values Watcher
watch(
  () => swapValues.value,
  async newVal => {
    if (hasSwapValues.value) {
      isPristine.value = false // Restoring values means form is not pristine
      selectedToChain.value = newVal.toChain
      await nextTick()
      setToToken()
      setFromToken()
      fromAmount.value = newVal.fromAmount
      setTimeout(() => clearSwapValues(), 1000)
    }
  },
  { deep: true },
)

// Reset state on Swap Success Dialog close
watch(
  () => swapInitiatedOpen.value,
  isOpen => {
    if (!isOpen) {
      // Add address to book if new
      if (!foundNickName.value && toAddress.value) {
        addAddress(
          {
            address: toAddress.value,
            name: '',
            chainName: selectedToChain.value?.name || '',
            chainType: selectedToChain.value?.type || '',
          },
          selectedToChain.value?.type || '',
        )
      }

      // Cleanup
      txHash.value = '0x'
      providers.value = []
      clearValues()
    }
  },
)

// Fetch Quote Trigger
watch(
  () => [
    fromAmount.value,
    fromTokenSelected.value?.address,
    userAddress.value,
    toAddress.value,
    toTokenSelected.value?.address,
  ],
  () => {
    generalError.value = ''

    qoutesError.value = false
    if (isSameToken.value) {
      toAmount.value = ''
      return
    }

    if (
      !BigNumber(fromAmount.value).isNaN() &&
      !BigNumber(fromAmount.value).isZero() &&
      toTokenSelected.value
    ) {
      if (isCrossChain.value && !toAddress.value && !isPristine.value) {
        // Highlight the missing address instead of silently returning
        toAddressError.value = 'Recipient address is required for bridging'
        return
      }
      debounceFetchQuotes()
    }
  },
)

// Update SwapInfo when Quote Selected
watch(
  () => selectedQuote.value,
  async provider => {
    if (provider) {
      swapInfo.value = await getSwap(provider)
    }
  },
  { deep: true },
)

const bestRate = computed(() => {
  if (providers.value.length === 0) return null
  return providers.value[0]
})

// Update To Amount Estimate
watch(
  () => bestRate.value,
  () => {
    if (
      bestRate.value &&
      providers.value.length > 0 &&
      !fromAmountError.value
    ) {
      const val = formatUnits(
        BigInt(bestRate.value.toTokenAmount.toString()),
        toTokenSelected.value?.decimals || 18,
      )

      const BigNumberVal = BigNumber(val)
      if (BigNumberVal.gte(100000)) {
        toAmount.value = BigNumberVal.toFixed(0) // No decimals for very large numbers
        return
      }
      if (BigNumberVal.gte(10)) {
        toAmount.value = BigNumberVal.toFixed(2) // 2 decimals for numbers >= 10
        return
      }
      if (BigNumberVal.gte(1)) {
        toAmount.value = BigNumberVal.toFixed(4) // 4 decimals for numbers between 0 and 10
        return
      }
      toAmount.value = BigNumberVal.toFixed(6) // Limit to 8 decimals for display
    }
  },
)

// Watch Chain Name for Nickname lookup
watch(
  () => toAddress.value,
  addr => {
    foundNickName.value = ''
    if (!addr) return
    const found = inAddressBook(addr, selectedToChain.value?.type || '')
    if (found) foundNickName.value = (found as Address).name
  },
  { immediate: true },
)

// Reset toChain and inputs when global chain changes in swap view
watch(
  () => selectedChain.value?.name,
  (newName, oldName) => {
    if (!newName || !oldName || newName === oldName) return

    if (newName === 'BITCOIN') {
      const eth = chains.value.find(c => c.name === 'ETHEREUM')
      if (eth) selectedToChain.value = eth
    } else {
      if (isSwapView.value) {
        selectedToChain.value = selectedChain.value!
      }
    }
    clearValues()
  },
)

// Handle From Tokens Updates
watch(
  () => fromTokens.value,
  () => setFromToken(),
  { deep: true },
)

// When from-token changes on same chain, auto-switch to-token if it matches
watch(
  () => fromTokenSelected.value?.address,
  () => {
    if (
      fromTokenSelected.value &&
      toTokenSelected.value &&
      selectedChain.value?.name === selectedToChain.value?.name &&
      fromTokenSelected.value.address.toLowerCase() ===
        toTokenSelected.value.address.toLowerCase()
    ) {
      const alt = filteredToTokens.value[0]
      toTokenSelected.value = alt || null
    }
  },
)

// Handle To Tokens Updates (e.g. swap re-init on chain change)
watch(
  () => toTokens.value,
  () => setToToken(),
  { deep: true },
)

// Refresh localToTokens balances when wallet balances update
watch(
  () => [tokens.value, balanceWei.value],
  () => setToToken(),
  { deep: true },
)

// Mark form as not pristine when user starts typing in address or amount field
watch(
  () => [userToAddress.value, fromAmount.value],
  ([newAdr, newAmount], [oldAdr, oldAmount]) => {
    if (
      (newAdr !== '' && oldAdr === '') ||
      (newAmount !== '' && oldAmount === '')
    ) {
      isPristine.value = false
    }
  },
)

// --- Lifecycle ---

onBeforeMount(async () => {
  if (hasSwapValues.value) {
    isPristine.value = false // Restoring values means form is not pristine
    selectedToChain.value = swapValues.value.toChain
  }
  if (isSwapView.value && !hasSwapValues.value && !isBitcoinChain.value) {
    selectedToChain.value = selectedChain.value
  }

  await nextTick()
  await initSwapper()

  setToToken()
  setFromToken()

  if (hasSwapValues.value) {
    fromAmount.value = swapValues.value.fromAmount
  }

  setTimeout(() => clearSwapValues(), 1000)
})
</script>
