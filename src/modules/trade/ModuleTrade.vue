<template>
  <div
    class="flex flex-col -mx-4 -mb-6 sm:-mt-6 min-h-[calc(100%+24px)] sm:min-h-[calc(100%+48px)]"
  >
    <div class="flex flex-col gap-1 pt-8 px-5 w-full max-w-[540px] mx-auto">
      <p class="text-s-20 font-bold leading-[22px] tracking-[-0.4px]">
        {{ $t('trade.title') }}
      </p>
      <p class="text-s-12 text-info leading-[18px]">
        {{ $t('trade.subtitle') }}
      </p>
    </div>
    <div
      :class="[
        'static w-full flex flex-col items-center justify-items-stretch gap-3 p-5',
      ]"
    >
      <div class="w-full max-w-[500px] relative">
        <trade-market-status-pill
          status="regular"
          until-text="Until 3:59 PM"
          class="mb-3"
        />
        <div :class="['relative transition-all duration-300', blurClass]">
          <!-- Sell Section -->
          <trade-amount-card
            v-if="supportedNetwork"
            v-model:amount="fromAmount"
            v-model:selected-token="fromTokenSelected!"
            v-model:error="fromAmountError"
            side="sell"
            :external-loading="isLoading || !swapLoaded"
            :tokens="fromTokens"
            :show-balance="isWalletConnected"
            :network-name="selectedFromChain?.name"
            :is-pristine="isPristine"
            :disabled-tokens="disabledTokenAddresses"
            :max-disabled="fromTokenSelected?.address === MAIN_TOKEN_CONTRACT"
            sort-context="trade"
            @percent="setPercentageAmount"
          />

          <!-- Swap Direction Button -->
          <div class="relative h-0 z-10 flex justify-center">
            <button
              type="button"
              :aria-label="$t('trade.swap_from_to')"
              class="absolute top-[6px] -translate-y-1/2 bg-bgBase border-4 border-white rounded-12 p-2.5 transition-colors hoverNoBG"
              @click="swapTokens"
            >
              <arrows-up-down-icon class="w-5 h-5" />
            </button>
          </div>

          <!-- Buy Section -->
          <trade-amount-card
            v-model:amount="toAmount"
            v-model:selected-token="toTokenSelected!"
            v-model:error="toAmountError"
            side="buy"
            :external-loading="isLoadingQuote"
            :tokens="toTokenSantized"
            :show-balance="isWalletConnected"
            :network-name="selectedFromChain?.name"
            :is-pristine="isPristine"
            :disabled-tokens="disabledTokenAddresses"
            sort-context="trade"
            class="mt-3"
          />
        </div>

        <!-- Market Closed Banner - Centered Overlay -->
        <div
          v-if="
            !isLoading &&
            marketStatus &&
            !isTradingSessionOpen &&
            isCurrentNetworkSupported
          "
          class="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
        >
          <div
            class="w-full max-w-[380px] px-3 py-5 bg-white border border-primary rounded-16 shadow-button shadow-button-elevated pointer-events-auto"
          >
            <div class="flex items-center gap-2 justify-center mb-2">
              <exclamation-circle-icon class="w-5 h-5 text-primary" />
              <p class="text-primary font-medium text-s-16">
                {{ $t('trade.market_closed') }}
              </p>
            </div>
            <p class="text-info text-s-14 text-center mb-4">
              {{ marketStatus.reason?.message }}
            </p>
            <div class="text-center">
              <p
                v-if="countdownText"
                class="font-medium text-s-16 mb-1 tabular-nums"
              >
                {{ $t('trade.opens_in', { countdown: countdownText }) }}
              </p>
              <p class="text-grey-50 text-s-11 mt-1">
                {{ formatNextOpen(marketStatus.nextOpen) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Network Not Supported Banner - Centered Overlay -->
        <div
          v-if="!isLoading && !isCurrentNetworkSupported"
          class="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
        >
          <div
            class="w-full max-w-[380px] px-3 py-5 bg-white border border-warning rounded-16 shadow-button shadow-button-elevated pointer-events-auto"
          >
            <div class="flex items-center gap-2 justify-center mb-2">
              <exclamation-circle-icon class="w-5 h-5 text-warning" />
              <p class="text-warning font-medium text-s-16">
                {{ $t('trade.network_not_supported') }}
              </p>
            </div>
            <p class="text-info text-s-14 text-center mb-4">
              {{
                $t('trade.trading_not_available_on', {
                  network:
                    selectedChain?.nameLong ||
                    selectedChain?.name ||
                    $t('common.network'),
                })
              }}
            </p>
            <div class="flex flex-col items-center justify-center">
              <div class="">
                <button
                  v-for="chain in supportedChainsList.reverse()"
                  :key="chain.name"
                  class="flex items-center gap-2 px-4 py-2 bg-primary-10 hover:bg-primary-20 font-medium text-s-14 rounded-full transition-colors shadow-button shadow-button-elevated mb-3 w-full"
                  @click="switchToNetwork(chain)"
                >
                  <app-token-logo
                    v-if="chain.icon"
                    :url="chain.icon"
                    :sumbol="chain.nameLong"
                    width="w-5"
                    height="h-5"
                  />
                  <span>{{ chain.nameLong || chain.name }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Trading Restricted Banner - Centered Overlay -->
        <div
          v-if="
            !isLoading &&
            isTradingRestrictedInRegion &&
            isCurrentNetworkSupported
          "
          class="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
        >
          <div
            class="w-full max-w-[380px] px-3 py-5 bg-white border border-warning rounded-16 shadow-button shadow-button-elevated pointer-events-auto"
          >
            <div class="flex items-center gap-2 justify-center mb-2">
              <exclamation-circle-icon class="w-5 h-5 text-warning" />
              <p class="text-warning font-medium text-s-16">
                {{ $t('trade.trading_not_available') }}
              </p>
            </div>
            <p class="text-info text-s-14 text-center mb-4">
              {{ $t('trade.trading_restricted') }}
            </p>
            <div class="flex justify-center">
              <a
                :href="tradingRestrictedHelpUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-s-14 font-medium hover:underline"
              >
                {{ $t('trade.learn_more') }}
                <arrow-long-right-icon class="w-4 h-4 inline-block" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Display -->
      <div
        v-if="!isLoading && displayGeneralError"
        :class="blurClass"
        class="w-full max-w-[340px] p-4 bg-error-10 border border-error rounded-12 mb-2 max-h-[120px] overflow-y-auto"
      >
        <p class="text-error text-s-14 text-center break-words">
          {{ displayGeneralError }}
        </p>
      </div>

      <!-- Asset Not Tradeable Warning (only show when a session is open) -->
      <div
        v-if="
          !isLoading &&
          isTradingSessionOpen &&
          !isSelectedAssetTradeable &&
          nonTradeableAssetMessage
        "
        class="w-full max-w-[340px] p-4 bg-warning-10 border border-warning rounded-12 mb-2"
      >
        <p class="text-warning text-s-14 text-center">
          <app-token-symbol
            :symbol="toTokenSelected?.symbol || 'UNKNOWN'"
            :address="
              toTokenSelected && selectedFromChain
                ? {
                    address: toTokenSelected.address,
                    network: selectedFromChain.name,
                  }
                : undefined
            "
            :has-gradient="false"
            class="inline-flex !text-s-14"
          />
          {{
            $t('trade.asset_not_tradable', { reason: nonTradeableAssetMessage })
          }}
        </p>
      </div>

      <div
        :class="['w-full max-w-[340px] transition-all duration-300', blurClass]"
      >
        <app-base-button
          v-if="!isWalletConnected || isWatchOnly"
          class="w-full"
          :disabled="!supportedNetwork"
          @click="connectWalletForTrade"
        >
          {{ $t('connect_wallet') }}
        </app-base-button>
        <div v-else>
          <transition name="fade" mode="out-in">
            <app-no-chain-balance
              v-if="!hasChainBalance"
              source="trade"
              class="mb-5 -mt-1"
            />
            <button
              v-else-if="isTradeDisabled && !isApproving"
              type="button"
              disabled
              class="w-full h-12 flex items-center justify-center rounded-24 bg-bgBase text-neutral-500 text-s-16 font-semibold leading-[22px] tracking-[-0.32px]"
            >
              {{ ctaDisabledLabel }}
            </button>
            <app-base-button
              v-else
              class="w-full"
              :disabled="isApproving"
              @click="needsApproval ? handleApprove() : openTradeModal()"
            >
              <span
                v-if="isApproving"
                class="flex items-center justify-center gap-2"
              >
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                    fill="none"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {{ $t('trade.approving') }}
              </span>
              <span v-else>{{
                needsApproval ? $t('common.approve') : $t('trade.trade_button')
              }}</span>
            </app-base-button>
          </transition>
        </div>
      </div>
    </div>

    <div v-if="showHelpLink" class="mt-auto flex justify-center px-5 pb-5">
      <a
        href="https://help.myetherwallet.com/en/article/what-is-gas"
        target="_blank"
        rel="noopener noreferrer"
        class="flex h-10 items-center px-3 rounded-24 text-primary text-s-14 font-semibold tracking-[-0.28px] hoverNoBG"
      >
        {{ $t('trade.need_help') }}
      </a>
    </div>

    <!-- Trade Quote Modal -->
    <trade-quote-modal
      v-model:is-open="quoteModalOpen"
      :quote="currentQuote"
      :from-token="fromTokenSelected"
      :to-token="toTokenSelected"
      :from-amount="fromAmount"
      :loading="txProceeding"
      :chain="selectedFromChain"
      :is-cashout="isCashOutTradableAsset"
      @confirm="confirmTrade"
      @cancel="quoteModalOpen = false"
    />

    <!-- Trade Initiated Modal -->
    <trade-initiated-modal
      v-model:is-open="tradeInitiatedOpen"
      :order-hash="orderHash"
      :from-chain="selectedFromChain"
      :from-token="fromTokenSelected"
      :to-token="toTokenSelected"
      :from-amount="fromAmount"
      :to-amount="toAmount"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { ArrowsUpDownIcon } from '@heroicons/vue/20/solid'
import { parseUnits, formatUnits } from 'viem'

// Components
import AppBaseButton from '@/components/AppBaseButton.vue'
import TradeAmountCard from './components/TradeAmountCard.vue'
import TradeMarketStatusPill from './components/TradeMarketStatusPill.vue'
import TradeQuoteModal from './components/TradeQuoteModal.vue'
import TradeInitiatedModal from './components/TradeInitiatedModal.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import AppNoChainBalance from '@/components/AppNoChainBalance.vue'

// Stores
import { useWalletStore, MAIN_TOKEN_CONTRACT } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useAccessStore } from '@/stores/accessStore'
import { useGlobalStore } from '@/stores/globalStore'
import { usePairStore } from '@/stores/pairStore'
import { analytics, ConnectWalletEvent } from '@/analytics'

// Composables
import { useTrade } from './useTrade'
import { useSwap, type NewTokenInfo } from '@/composables/useSwap'
import {
  useMarketStatus,
  useTradeTokens,
  useTradeValidation,
  useTradeQuote,
  useTradeExecution,
} from './composables'

// Types
import type { Chain } from '@/mew_api/types'
import configs from '@/configs'

//icons
import {
  ExclamationCircleIcon,
  ArrowLongRightIcon,
} from '@heroicons/vue/24/solid'

const { t } = useI18n()

const showHelpLink = import.meta.env.DEV

// --- Stores ---
const pairStore = usePairStore()
const { tradeFromSymbol, tradeToSymbol } = storeToRefs(pairStore)
const { setTradeFromSymbol, setTradeToSymbol } = pairStore
const walletMenu = useWalletMenuStore()
const walletStore = useWalletStore()
const chainsStore = useChainsStore()
const accessStore = useAccessStore()
const globalStore = useGlobalStore()

// --- Refs from Stores ---
const {
  isWalletConnected,
  walletAddress,
  wallet,
  isWatchOnly,
  allTokens,
  isLoadingBalances,
  hasChainBalance,
} = storeToRefs(walletStore)
const { selectedChain, chains } = storeToRefs(chainsStore)
const { isTradingRestrictedInRegion } = storeToRefs(globalStore)
const { selectedTradeTokenSymbol } = storeToRefs(walletMenu)

// --- Use Trade Composable ---
const {
  supportedChainNames,
  tradableAssets,
  additionalBuyAssets,
  hardcodedTokensInfo,
  isLoading,
  loadTradableAssets,
} = useTrade()

// --- Use Swap Composable for fromTokens ---
const { initSwapper, fromTokens: swapFromTokens, swapLoaded } = useSwap()

// --- Local State ---
// Initialize selectedFromChain immediately from the store to prevent defaulting to Ethereum
const selectedFromChain = ref<Chain | undefined>(chainsStore.selectedChain)
const fromTokenSelected = ref<NewTokenInfo | null>(null)
const fromTokenManuallySelected = ref(false)
const toTokenSelected = ref<NewTokenInfo | null>(null)
const fromAmount = ref<string>('')
const toAmount = ref<string>('')
const generalError = ref<string>('')
const toAmountError = ref<string>('')
const isPristine = ref(true) // Track if form is in pristine (untouched/cleared) state

// --- Market Status ---
const {
  marketStatus,
  currentSession,
  isTradingSessionOpen,
  tradingRestrictedHelpUrl,
  countdownText,
  fetchMarketStatus,
  formatNextOpen,
} = useMarketStatus({
  onMarketOpen: async () => {
    // Refresh tradable assets when market opens
    await loadTradableAssets()
  },
})

// --- Computed ---
const supportedNetwork = computed(() => {
  if (!selectedFromChain.value) return false
  return supportedChainNames.value.includes(
    selectedFromChain.value.name.toUpperCase(),
  )
})

// Check if current global network is supported for trading
const isCurrentNetworkSupported = computed(() => {
  if (!selectedChain.value) return false
  return supportedChainNames.value.includes(
    selectedChain.value.name.toUpperCase(),
  )
})

// Get list of supported chains for the unsupported network message
const supportedChainsList = computed(() => {
  return chains.value.filter(chain =>
    supportedChainNames.value.includes(chain.name.toUpperCase()),
  )
})

const fromTokens = computed(() => {
  const tokens = (swapFromTokens.value || []) as NewTokenInfo[]
  const sanitized = tokens.filter(token => {
    if (!token.address) return false
    if (isWalletConnected.value) {
      const matchingToken = allTokens.value.find(
        t => t.contract?.toLowerCase() === token.address?.toLowerCase(),
      )
      // Keep token if it has marketCap
      return (
        matchingToken &&
        ((matchingToken.market_cap && matchingToken.market_cap > 0) ||
          token.cgId === 'spacex-ondo-tokenized-stock')
      )
    } else {
      return token.price && token.price > 0
    }
  })
  return sanitized
})

const toTokenSantized = computed(() => {
  if (!toTokens.value || !fromTokenSelected.value) return []
  return toTokens.value
})

// Find the highest balance token from additionalBuyAssets that the user owns
const getHighestBalanceAdditionalAsset = (): NewTokenInfo | null => {
  if (
    !isWalletConnected.value ||
    !additionalBuyAssets.value ||
    !selectedFromChain.value
  ) {
    return null
  }

  const chainName = selectedFromChain.value.name.toUpperCase()
  let highestBalanceToken: NewTokenInfo | null = null
  let highestBalance = 0

  for (const asset of additionalBuyAssets.value) {
    // Find the address for this asset on the current chain
    const addressInfo = asset.addresses.find(
      addr => addr.chainName?.toUpperCase() === chainName,
    )
    if (!addressInfo?.address) continue

    const assetAddress = addressInfo.address.toLowerCase()

    // Check if user has this token in their wallet
    const walletToken = allTokens.value.find(
      t => t.contract?.toLowerCase() === assetAddress,
    )
    if (!walletToken) continue

    const balance = parseFloat(walletToken.balance || '0')
    if (balance > highestBalance) {
      highestBalance = balance
      // Find the matching token in fromTokens
      const matchingFromToken = fromTokens.value.find(
        t => t.address?.toLowerCase() === assetAddress,
      )
      if (matchingFromToken) {
        highestBalanceToken = matchingFromToken
      }
    }
  }

  return highestBalanceToken
}

// Get the default from token - prefer highest balance additional asset, then main token
const getDefaultFromToken = (): NewTokenInfo | null => {
  // First check for highest balance additional buy asset
  const highestBalanceAsset = getHighestBalanceAdditionalAsset()
  if (highestBalanceAsset) {
    return highestBalanceAsset
  }

  // Fall back to main token or first available
  return (
    fromTokens.value.find(t => t.address === MAIN_TOKEN_CONTRACT) ||
    fromTokens.value[0] ||
    null
  )
}

// Use wallet address or fallback to donation address for quotes
const userAddress = computed(
  () => walletAddress.value || configs.MEW_DONATION_ADDRESS,
)

const displayGeneralError = ref<string>('')

watch(generalError, newVal => {
  if (newVal) {
    displayGeneralError.value = ''
    if (fromAmountError.value) {
      return
    }
    if (generalError.value === 'pathfinder error') {
      displayGeneralError.value = ''
    } else if (
      generalError.value.toLowerCase().includes('internal server error')
    ) {
      displayGeneralError.value = t('trade.service_unavailable')
    } else {
      displayGeneralError.value = newVal
    }
  }
})

// --- Trade Tokens ---
const {
  isSelectedAssetTradeable,
  isCashOutTradableAsset,
  nonTradeableAssetMessage,
  disabledTokenAddresses,
  toTokens,
} = useTradeTokens({
  selectedFromChain,
  fromTokens,
  fromTokenSelected,
  toTokenSelected,
  tradableAssets,
  additionalBuyAssets,
  hardcodedTokensInfo,
  currentSession,
})

// --- Trade Quote ---
// Note: We need to create isLoadingQuote first before using it in validation
const isLoadingQuote = ref(false)

// --- Trade Validation ---
const {
  hasPreQuoteError,
  fromAmountError,
  isTradeDisabled,
  isSameTokenSelected,
} = useTradeValidation({
  fromTokenSelected,
  fromAmount,
  toAmount,
  isWalletConnected,
  // Trading is allowed whenever ANY session is open (conventional or off-hours);
  // per-asset session eligibility is enforced via isSelectedAssetTradeable.
  isMarketOpen: isTradingSessionOpen,
  isSelectedAssetTradeable,
  supportedNetwork,
  isLoadingQuote,
  generalError,
  toTokenSelected,
})

// --- Trade Quote ---
const { currentQuote, needsApproval, fetchQuote, resetQuote } = useTradeQuote({
  fromTokenSelected,
  toTokenSelected,
  fromAmount,
  toAmount,
  walletAddress: userAddress,
  wallet,
  selectedFromChain,
  isMarketOpen: isTradingSessionOpen,
  isSelectedAssetTradeable,
  hasPreQuoteError,
  generalError,
  isLoadingQuote,
})

const ctaDisabledLabel = computed(() => {
  if (fromAmount.value === '' || fromAmount.value === '0') {
    return t('trade.enter_amount')
  }
  return needsApproval.value ? t('common.approve') : t('trade.trade_button')
})

// --- Trade Execution ---
const {
  isApproving,
  txProceeding,
  quoteModalOpen,
  tradeInitiatedOpen,
  orderHash,
  handleApprove,
  openTradeModal,
  confirmTrade,
} = useTradeExecution({
  fromTokenSelected,
  toTokenSelected,
  fromAmount,
  walletAddress,
  wallet,
  selectedFromChain,
  currentQuote,
  needsApproval,
})

// --- Methods ---
const restoreToToken = () => {
  if (!toTokens.value.length) return
  const storedToSymbol = tradeToSymbol.value
  if (selectedTradeTokenSymbol.value) {
    const matchingToken = toTokens.value.find(
      (t: NewTokenInfo) =>
        t.symbol.toUpperCase() ===
        selectedTradeTokenSymbol.value!.toUpperCase(),
    )
    toTokenSelected.value = matchingToken ?? toTokens.value[0] ?? null
  } else if (storedToSymbol) {
    const restoredTo =
      toTokens.value.find(
        (t: NewTokenInfo) =>
          t.symbol.toUpperCase() === storedToSymbol.toUpperCase(),
      ) ?? null
    if (restoredTo) {
      toTokenSelected.value = restoredTo
    } else {
      const defaultTo = toTokens.value[0] ?? null
      toTokenSelected.value = defaultTo
      setTradeToSymbol(defaultTo?.symbol ?? null)
    }
  } else {
    toTokenSelected.value = toTokens.value[0] ?? null
  }
}

const clearValues = () => {
  isPristine.value = true // Reset to pristine state
  fromTokenManuallySelected.value = false
  fromAmount.value = ''
  toAmount.value = ''
  toAmountError.value = ''
  generalError.value = ''
  displayGeneralError.value = '' // Clear display error
  resetQuote()

  // Reset to default tokens - prefer highest balance additional asset
  if (fromTokens.value.length > 0) {
    fromTokenSelected.value = getDefaultFromToken()
  }
  if (toTokens.value.length > 0) {
    toTokenSelected.value = toTokens.value[0] || null
  }
}

const setFromChain = (chain: Chain) => {
  selectedFromChain.value = chain
  fromTokenManuallySelected.value = false
  // Update the global network - useSwap has a watcher that will reinitialize
  globalStore.setSelectedNetwork(chain.name)
  // Clear current selections - they'll be repopulated when swapLoaded becomes true
  fromTokenSelected.value = null
  toTokenSelected.value = null
  fromAmount.value = '0'
  toAmount.value = '0'
}

const switchToNetwork = (chain: Chain) => {
  setFromChain(chain)
}

const swapTokens = () => {
  const tempFrom = fromTokenSelected.value
  const tempTo = toTokenSelected.value

  fromTokenSelected.value = tempTo
  toTokenSelected.value = tempFrom
  fromAmount.value = '0'
  toAmount.value = '0'
}

const setPercentageAmount = (percentage: number) => {
  if (!fromTokenSelected.value || !isWalletConnected.value) return

  const tokenAddress = fromTokenSelected.value.address?.toLowerCase()
  if (!tokenAddress) return

  // Find the token balance from wallet
  const walletToken = allTokens.value.find(
    t => t.contract?.toLowerCase() === tokenAddress,
  )
  if (!walletToken) return

  const decimals = fromTokenSelected.value.decimals || 18
  const balanceWei = walletToken.balanceWei || '0'

  if (balanceWei === '0') return

  // Convert percentage to bigint calculation
  const balanceBigInt = BigInt(balanceWei)
  let amountBigInt = (balanceBigInt * BigInt(percentage)) / BigInt(100)

  // If selecting Max on main token, leave some for gas
  if (
    percentage === 100 &&
    tokenAddress === MAIN_TOKEN_CONTRACT.toLowerCase()
  ) {
    const gasBuffer = parseUnits('0.005', decimals) // Reserve ~0.005 ETH/BNB for gas
    amountBigInt =
      amountBigInt > gasBuffer ? amountBigInt - gasBuffer : BigInt(0)
  }

  // Format using viem's formatUnits
  fromAmount.value = formatUnits(amountBigInt, decimals)
}

const connectWalletForTrade = () => {
  analytics.trackConnectWalletEvent(ConnectWalletEvent.CLICKED, {
    source: 'Trade',
  })
  accessStore.openAccessDialog()
}

// --- Watchers ---

// Reset state when Trade Initiated Modal is closed
watch(
  () => tradeInitiatedOpen.value,
  isOpen => {
    if (!isOpen) {
      clearValues()
    }
  },
)

watch([fromAmount, fromTokenSelected, toTokenSelected], () => {
  if (isSameTokenSelected.value) {
    toAmount.value = '' // Reset same token error on any change
    return
  }
  displayGeneralError.value = ''
  fetchQuote()
})

watch(selectedChain, newChain => {
  if (
    newChain &&
    supportedChainNames.value.includes(newChain.name.toUpperCase())
  ) {
    selectedFromChain.value = newChain
    fromTokenSelected.value = null
    toTokenSelected.value = null
    fromAmount.value = ''
    toAmount.value = ''
  }
})

// Watch for swap loaded to set default tokens after chain change
watch(
  [() => swapLoaded.value, () => fromTokens.value],
  ([loaded]) => {
    if (loaded && !fromTokenSelected.value && fromTokens.value.length > 0) {
      fromTokenSelected.value = getDefaultFromToken()
    }
    if (loaded && !toTokenSelected.value) {
      restoreToToken()
    }
  },
)

// Watch for fromTokens to update selected token with fresh data (e.g., after wallet connection)
watch(
  () => isLoadingBalances.value,
  newVal => {
    if (
      !isWalletConnected.value ||
      newVal ||
      !fromTokenSelected.value ||
      fromTokens.value.length === 0
    )
      return

    // Find the same token in the updated list and refresh the selection with new data
    const currentAddress = fromTokenSelected.value.address?.toLowerCase()
    const updatedToken = fromTokens.value.find(
      t => t.address?.toLowerCase() === currentAddress,
    )
    if (updatedToken) {
      // Update with fresh balance data
      fromTokenSelected.value = updatedToken
    }
  },
)

// Watch for wallet tokens and additionalBuyAssets to update default from token when balances load
watch([additionalBuyAssets, () => isWalletConnected.value], () => {
  // Check if we should update the from token selection
  if (!fromTokens.value.length || !isWalletConnected.value) return

  // Never override a token the user explicitly picked
  if (fromTokenManuallySelected.value) return

  const currentAddress = fromTokenSelected.value?.address?.toLowerCase()
  const isMainToken =
    !currentAddress || currentAddress === MAIN_TOKEN_CONTRACT.toLowerCase()

  // Only auto-update if currently using main token (not manually selected another token)
  if (isMainToken) {
    const highestBalanceAsset = getHighestBalanceAdditionalAsset()
    if (highestBalanceAsset) {
      fromTokenSelected.value = highestBalanceAsset
    }
  }
})

// Watch for selected trade token symbol being set externally (e.g. navigating from portfolio)
watch(selectedTradeTokenSymbol, symbol => {
  if (symbol && toTokens.value.length > 0) {
    restoreToToken()
  }
})

// Sync trade pair to pairStore; detect manual user selection
watch(fromTokenSelected, token => {
  setTradeFromSymbol(token?.symbol ?? null)
  // If the token changed and it wasn't a programmatic reset (null), treat as manual
  if (token !== null) {
    fromTokenManuallySelected.value = true
  }
})

watch(toTokenSelected, token => {
  setTradeToSymbol(token?.symbol ?? null)
})

// Mark form as not pristine when user starts typing
watch(
  () => fromAmount.value,
  (newVal, oldVal) => {
    if (newVal !== '' && oldVal === '') {
      isPristine.value = false
    }
  },
)

// --- Lifecycle ---
onBeforeMount(async () => {
  // Initialize swap to get fromTokens and fetch market status
  await Promise.all([initSwapper(), loadTradableAssets()])

  // Fetch market status
  await fetchMarketStatus()

  // Only set tokens if the network is supported
  if (isCurrentNetworkSupported.value) {
    // Restore from token: check pairStore first, then fall back to default
    if (fromTokens.value.length > 0) {
      const storedFromSymbol = tradeFromSymbol.value
      if (storedFromSymbol) {
        const restoredFrom =
          fromTokens.value.find(
            (t: NewTokenInfo) =>
              t.symbol.toUpperCase() === storedFromSymbol.toUpperCase(),
          ) ?? null
        if (restoredFrom) {
          fromTokenSelected.value = restoredFrom
        } else {
          const defaultFrom = getDefaultFromToken()
          fromTokenSelected.value = defaultFrom
          setTradeFromSymbol(defaultFrom?.symbol ?? null)
        }
      } else {
        fromTokenSelected.value = getDefaultFromToken()
      }
    }

    // Restore to token: selectedTradeTokenSymbol takes priority, then pairStore, then first
    restoreToToken()
  }
})

const blurClass = computed(() => {
  // Blur only when NO session is tradable (conventional closed AND off-hours
  // closed). Off-hours open keeps the UI interactive with per-asset gating.
  return !isTradingSessionOpen.value ||
    !isCurrentNetworkSupported.value ||
    isTradingRestrictedInRegion.value
    ? 'blur-sm pointer-events-none opacity-60'
    : ''
})
</script>
