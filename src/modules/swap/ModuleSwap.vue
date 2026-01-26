<template>
  <div>
    <div
      :class="[
        'static w-full flex flex-col items-center justify-items-stretch gap-3',
      ]"
    >
      <div class="w-full max-w-[500px]">
        <div class="flex items-end justify-between mb-2 px-4">
          <p class="font-bold text-s-28">
            {{ walletPanel === 'swap' ? 'Swap' : 'Bridge' }}
          </p>
          <app-btn-text class="text-primary text-s-14 pb-1" @click="clearValues"
            >Clear all</app-btn-text
          >
        </div>
        <div class="relative">
          <!-- From Section -->
          <div class="bg-mewBg rounded-20 px-4 pb-4 pt-2 mx-auto">
            <p class="text-s-12 mb-1 font-bold ml-3">You are selling</p>
            <select-chain-for-app
              :filter-chain-type="true"
              :can-store="false"
              :passed-chains="fromChains"
              :preselected-chain="selectedFromChain"
            />
            <div
              v-if="swapLoaded && !isLoading && !supportedNetwork"
              class="min-h-[108px] mt-4 w-full rounded-16 bg-white py-4 box-border border-transparent border-2 transition-colors shadow-button shadow-button-elevated"
            >
              <p class="text-error text-center text-s-12">
                {{ t('swap.not-supported-network') }}
              </p>
            </div>
            <app-swap-enter-amount
              v-else
              v-model:amount="fromAmount"
              v-model:selected-token="fromTokenSelected!"
              v-model:error="fromAmountError"
              :external-loading="fromLoadingState"
              :tokens="parsedFromTokens"
              :show-balance="isWalletConnected"
              class="mt-3"
            />
          </div>

          <!-- Arrow Button -->
          <div class="relative h-0 z-10 flex justify-center items-center">
            <div
              class="absolute right-[50%+20px] top-[calc(50%-11px)] bg-white rounded-xl h-10 w-10 flex justify-center items-center"
            >
              <arrows-up-down-icon class="w-5 h-5 text-primary" />
            </div>
          </div>

          <!-- To Section -->
          <div class="bg-mewBg rounded-20 px-4 pb-4 pt-2 mx-auto mt-2">
            <p class="text-s-12 mb-1 font-bold ml-3">You are buying</p>
            <select-chain-for-app
              :can-store="false"
              :passed-chains="toChains"
              :preselected-chain="selectedToChain"
              @update:selected-chain="setToChain"
            />
            <app-swap-enter-amount
              v-model:amount="toAmount"
              v-model:selected-token="toTokenSelected!"
              v-model:error="toAmountError"
              :external-loading="toLoadingState"
              :show-balance="false"
              :tokens="parsedToTokens"
              :readonly="true"
              :is-estimate="true"
              :is-from-view="false"
              class="mt-4"
            />
            <div class="pt-4" v-if="isCrossChain"></div>
            <address-input
              v-model:adr-input="userToAddress"
              :resolved-address="toAddress"
              :found-nick-name="foundNickName"
              :address-error-messages="toAddressError"
              :network="selectedToChain"
              @validate:address="validateToAddress"
              v-if="isCrossChain"
            />
          </div>
        </div>
      </div>

      <!-- Error Display -->
      <div
        v-if="!isLoading && generalError"
        class="w-full max-w-[340px] p-4 bg-error-10 border border-error rounded-12 mb-2"
      >
        <p class="text-error text-s-14 text-center">
          {{ generalError }}
        </p>
      </div>

      <app-base-button
        class="w-full max-w-[340px]"
        v-if="isWalletConnected && !isWatchOnly"
        :disabled="isSwapDisabled"
        @click="swapButton"
      >
        {{ t('common.swap') }}</app-base-button
      >
      <div class="mx-auto w-full max-w-[340px]" v-else>
        <app-base-button
          class="w-full"
          :disabled="swapLoaded && !supportedNetwork"
          @click="connectWalletForSwap"
        >
          {{ t('connect_wallet') }}</app-base-button
        >
      </div>
      <app-need-help
        title="Need help swaping?"
        help-link="https://help.myetherwallet.com/en/article/what-is-gas"
        class="mx-auto"
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
      :to-chain="selectedToChain"
      :swap-info="swapInfo || undefined"
      :swap-gas-fee-quote="swapGasFeeQuote || undefined"
    />
    <swap-initiated-modal
      v-model:swap-initiated-open="swapInitiatedOpen"
      :from-chain="selectedChain"
      :to-chain="selectedToChain"
      :selected-quote="selectedQuote"
      :tx-hash="txHash"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, computed, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import BigNumber from 'bignumber.js'
import { useI18n } from 'vue-i18n'
import { useDebounceFn } from '@vueuse/core'
import { ArrowsUpDownIcon } from '@heroicons/vue/24/solid'

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

// Utils and Types
import {
  enumToChain,
  supportedSwapEnums,
} from '@/providers/ethereum/chainToEnum'
import { formatUnits, parseUnits } from 'viem'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
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
const selectedFromChain = ref<Chain>()
const selectedToChain = ref<Chain>()
const fromTokenSelected = ref<NewTokenInfo | null>(null)
const toTokenSelected = ref<NewTokenInfo | null>(null)

// Error State
const toAddressError = ref<string>('')
const generalError = ref<string>('')

// Data Models
const fromAmount = ref<string>('0')
const toAmount = ref<string>('0')
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

const isCrossChain = computed(
  () => selectedChain.value?.type !== selectedToChain.value?.type,
)

const parsedFromTokens = computed(() => fromTokens.value as NewTokenInfo[])
const parsedToTokens = computed(() => localToTokens.value)

const userAddress = computed(() => walletAddress.value || configs.MEW_DONATION_ADDRESS)

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

const toAddress = computed(() => {
  if (selectedToChain.value?.name === selectedChain.value?.name)
    return userAddress.value
  if (!isCrossChain.value) return userAddress.value
  return userToAddress.value || ''
})

const toLoadingState = computed(() => isLoading.value)
const fromLoadingState = computed(() => !swapLoaded.value)

const fromAmountError = computed(() => {
  if (!fromAmount.value || fromAmount.value === '0')
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
  if (
    !isLoading.value &&
    providers.value.length === 0 &&
    fromAmount.value !== '0' &&
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
    isLoadingQuotes.value,
)

// --- Helper Methods ---

const getTokenBalanceParams = (token: NewTokenInfo) => {
  const isMainToken = token.address === MAIN_TOKEN_CONTRACT
  const balance = token.balance || '0'
  const decimals = token.decimals || 18

  const baseNetworkBalance = parseUnits(
    walletStore.getTokenBalance(MAIN_TOKEN_CONTRACT)?.balance || '0',
    18,
  )

  const baseBalance = isMainToken
    ? baseNetworkBalance
    : parseUnits(balance, decimals)

  // For calculating remaining balance (native logic)
  const totalBalance =
    isMainToken && isWalletConnected.value
      ? baseNetworkBalance
      : parseUnits(balance, decimals)

  return { baseBalance, totalBalance, baseNetworkBalance }
}

const clearValues = () => {
  clearSwapValues()
  fromAmount.value = '0'
  toAmount.value = '0'
  userToAddress.value = ''
  foundNickName.value = ''
  selectedQuote.value = undefined
  setToToken()
  setFromToken()
}

const validateToAddress = async () => {
  if (!userToAddress.value) {
    toAddressError.value = 'address is required'
    return
  }
  const valid = await toTokenSelected.value?.networkInfo.isAddress(
    userToAddress.value.toLowerCase(),
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
  const isHardware =
    txCtx.getWalletType() !== WalletType.WAGMI &&
    txCtx.getWalletType() !== WalletType.INJECTED

  for (const [index, tx] of txs.serialized.entries()) {
    const isLast = index === txs.serialized.length - 1
    if (!tx) continue

    if (!isHardware) {
      const broadcast = txCtx.SendTransaction?.(tx as HexPrefixedString)
      if (isLast) lastTxPromise = broadcast
    } else {
      const signedTx = await txCtx.SignTransaction?.(tx as HexPrefixedString)
      const broadcast = txCtx.broadcastTransaction(
        signedTx?.signed as unknown as HexPrefixedString,
      )
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
      toastStore.addToastMessage({
        type: ToastType.Success,
        text: t('swap.toast.tx-send-success'),
        duration: 10000,
      })
    }
  } catch (e: any) {
    const errorMsg =
      e?.message || t('swap.toast.tx-sign-failed') || 'Transaction failed'
    generalError.value = errorMsg
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: errorMsg,
      duration: 10000,
    })
  } finally {
    txProceeding.value = false
  }
}

// --- Pre-Swap & Quotes ---

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

    const res = await wallet.value?.getMultipleGasFees?.(parsedTransactions)
    swapGasFeeQuote.value = res || undefined
    bestOfferSelectionOpen.value = true
  } catch (e: any) {
    generalError.value = e?.message || 'Error fetching gas fees'
  } finally {
    bestSwapLoadingOpen.value = false
  }
}

const swapButton = () => {
  return isBitcoinChain.value ? swapForBtc() : swapForEvm()
}

const fetchQuotes = async () => {
  if (!fromTokenSelected.value || !toTokenSelected.value) return

  providers.value = []
  selectedQuote.value = undefined
  isLoadingQuotes.value = true
  generalError.value = ''
  toAmount.value = '0'

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
        generalError.value = t('swap.error.no-quotes')
      }
    } else {
      generalError.value = t('swap.error.no-quotes')
    }
  } catch (err: any) {
    generalError.value = t('swap.error.fetching-quotes')
    console.error('Swap: fetchQuotes failed', err)
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
    const sameNetworks = currentToChain.chainID === selectedChain.value?.chainID

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
  if (!hasSwapValues.value) {
    if (toTokens.value && allToTokensRaw.length > 0) {
      const allToTrending =
        toTokens.value.trending[
          enkryptEnum as keyof typeof toTokens.value.trending
        ]
      const candidates = allToTrending?.length ? allToTrending : allToTokensRaw
      const sameNetworks =
        currentToChain.chainID === selectedChain.value?.chainID

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
  }
}

const setFromToken = () => {
  if (!fromTokens.value?.length) return

  if (!hasSwapValues.value) {
    const mewToken = fromTokens.value.find(
      t => t.address.toLowerCase() === MAIN_TOKEN_CONTRACT,
    )
    fromTokenSelected.value = (mewToken || fromTokens.value[0]) as NewTokenInfo
  } else {
    // Deep link match
    const match = fromTokens.value.find(
      t =>
        t.address.toLowerCase() ===
        swapValues.value.fromToken.address?.toLowerCase(),
    )
    fromTokenSelected.value = (match || fromTokens.value[0]) as NewTokenInfo
  }
}

const connectWalletForSwap = () => {
  storeSwapValues({
    fromToken: fromTokenSelected.value!,
    toToken: toTokenSelected.value!,
    toChain: selectedToChain.value!,
    fromAmount: fromAmount.value,
  })
  accessStore.openAccessDialog()
}

// --- Watchers ---

// Deep Link / Swap Values Watcher
watch(
  () => swapValues.value,
  async newVal => {
    if (hasSwapValues.value) {
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
      selectedQuote.value = undefined
      fromAmount.value = '0'
      toAmount.value = '0'
      userToAddress.value = ''
      foundNickName.value = ''
      setToToken()
      setFromToken()
    }
  },
)

// Fetch Quote Trigger
watch(
  () => [
    fromAmount.value,
    fromTokenSelected.value,
    userAddress.value,
    toAddress.value,
    toTokenSelected.value,
  ],
  () => {
    generalError.value = ''
    const isSameChain =
      selectedChain.value?.chainID === selectedToChain.value?.chainID
    const isSameToken =
      fromTokenSelected.value?.address === toTokenSelected.value?.address

    // Auto-switch token if duplicate selected on same chain
    if (fromTokenSelected.value && isSameToken && isSameChain) {
      setToToken()
    }

    if (
      !BigNumber(fromAmount.value).isNaN() &&
      !BigNumber(fromAmount.value).isZero() &&
      toTokenSelected.value
    ) {
      if (isCrossChain.value && !toAddress.value) return
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

// Update To Amount Estimate
watch(
  () => providers.value,
  () => {
    if (providers.value.length > 0 && !fromAmountError.value) {
      const best = providers.value[0]
      const val = formatUnits(
        BigInt(best.toTokenAmount.toString()),
        toTokenSelected.value?.decimals || 18,
      )
      toAmount.value = `≈ ${formatFloatingPointValue(val).value}`
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

// Handle From Tokens Updates
watch(
  () => fromTokens.value,
  () => setFromToken(),
  { deep: true },
)

// --- Lifecycle ---

onBeforeMount(async () => {
  if (hasSwapValues.value) {
    selectedToChain.value = swapValues.value.toChain
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
