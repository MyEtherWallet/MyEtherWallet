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
          :status="pillStatus"
          :until-text="untilText"
          :next-open-text="nextOpenText"
          :day-label="dayLabel"
          :marker-pct="markerPct"
          :time-label="timeLabel"
          :session-ranges="sessionRanges"
          class="mb-3"
        />

        <!-- Network Not Supported -->
        <app-unavailable-card
          v-if="!isLoading && !isCurrentNetworkSupported"
          class="mb-3"
          :title="$t('trade.network_not_supported')"
          :description="
            $t('trade.trading_not_available_on', {
              network:
                selectedChain?.nameLong ||
                selectedChain?.name ||
                $t('common.network'),
            })
          "
        >
          <template #action>
            <div>
              <button
                v-for="chain in supportedChainsList"
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
                  no-shadow
                />
                <span>{{ chain.nameLong || chain.name }}</span>
              </button>
            </div>
          </template>
        </app-unavailable-card>

        <!-- Trading Restricted -->
        <app-unavailable-card
          v-if="
            !isLoading &&
            isTradingRestrictedInRegion &&
            isCurrentNetworkSupported
          "
          class="mb-3"
          :title="$t('trade.trading_not_available')"
          :description="$t('trade.trading_restricted')"
        >
          <template #icon>
            <div class="relative">
              <globe-asia-australia-icon
                class="w-12 h-12 text-black"
                aria-hidden="true"
              />
              <!--       Badge geometry is from the design: a 16px glyph, 4px of padding,
                and a 2px white ring. The ring is what separates the red disc
                from the dark globe behind it — drop it and the badge reads as a
                blob welded onto the globe's edge.
              -->

              <span
                class="absolute -top-2 -right-2 p-1 rounded-full bg-error border-2 border-white flex items-center justify-center"
              >
                <exclamation-circle-icon
                  class="w-4 h-4 text-white"
                  aria-hidden="true"
                />
              </span>
            </div>
          </template>
          <template #action>
            <app-learn-more-link
              :href="tradingRestrictedHelpUrl"
              :label="$t('trade.learn_more')"
            />
          </template>
        </app-unavailable-card>

        <div :class="['relative transition-all duration-300', blockedClass]">
          <!-- Sell Section -->
          <trade-amount-card
            v-if="supportedNetwork"
            v-model:amount="fromAmount"
            v-model:selected-token="fromTokenSelected!"
            v-model:error="fromAmountError"
            side="sell"
            :external-loading="isLoading || !swapLoaded"
            :fiat-loading="isLoadingQuote"
            :balance-error="isInsufficientBalanceError"
            :tokens="fromTokens"
            :show-balance="isWalletConnected"
            :network-name="selectedFromChain?.name"
            :is-pristine="isPristine"
            :disabled-tokens="disabledTokenAddresses"
            :max-disabled="fromTokenSelected?.address === MAIN_TOKEN_CONTRACT"
            sort-context="trade"
            @percent="setPercentageAmount"
            @select:token="onFromTokenSelected"
          />

          <!-- Swap Direction Indicator -->
          <div class="relative h-0 z-10 flex justify-center">
            <div
              aria-hidden="true"
              class="absolute top-[6px] -translate-y-1/2 bg-bgBase border-4 border-white rounded-12 p-2.5"
            >
              <arrow-down-icon class="w-5 h-5" />
            </div>
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
            @select:token="onToTokenSelected"
          />
        </div>
      </div>

      <!-- Error Display -->
      <div
        v-if="!isLoading && displayGeneralError"
        :class="blockedClass"
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
        :class="blockedClass"
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
        :class="[
          'w-full max-w-[340px] transition-all duration-300',
          blockedClass,
        ]"
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
              v-else-if="isTradeDisabled"
              type="button"
              disabled
              class="w-full h-12 flex items-center justify-center rounded-24 bg-bgBase text-neutral-500 text-s-16 font-semibold leading-[22px] tracking-[-0.32px]"
            >
              {{ ctaDisabledLabel }}
            </button>
            <app-base-button
              v-else
              class="w-full !font-semibold !py-[13px] text-s-16 leading-[22px] tracking-[-0.32px]"
              @click="startTradeFlow"
            >
              {{ $t('trade.review_trade') }}
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
    <trade-review-modal
      v-model:is-open="reviewModalOpen"
      :quote="currentQuote"
      :from-token="fromTokenSelected"
      :to-token="toTokenSelected"
      :from-amount="fromAmount"
      :loading="txProceeding"
      :chain="selectedFromChain"
      :is-cashout="isCashOutTradableAsset"
      :expires-at="quoteExpiresAt"
      @confirm="confirmTrade"
      @cancel="reviewModalOpen = false"
      @expired="refreshExpiredQuote"
    />

    <!-- Trade Progress Modal -->
    <trade-progress-modal
      v-model:is-open="progressModalOpen"
      :order-hash="orderHash"
      :from-chain="selectedFromChain"
      :from-token="fromTokenSelected"
      :to-token="toTokenSelected"
    />

    <!-- Waiting Approval Modal -->
    <trade-waiting-approval-modal v-model:is-open="waitingApprovalOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, onBeforeUnmount, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { ArrowDownIcon } from '@heroicons/vue/24/solid'
import { GlobeAsiaAustraliaIcon } from '@heroicons/vue/24/solid'
// 16px variant: the badge glyph is drawn at 16px in the design, and the 24px
// icon's strokes render muddy when scaled down that far.
import { ExclamationCircleIcon } from '@heroicons/vue/16/solid'
import { parseUnits, formatUnits } from 'viem'

// Components
import AppBaseButton from '@/components/AppBaseButton.vue'
import TradeAmountCard from './components/TradeAmountCard.vue'
import TradeMarketStatusPill from './components/TradeMarketStatusPill.vue'
import TradeReviewModal from './components/TradeReviewModal.vue'
import TradeProgressModal from './components/TradeProgressModal.vue'
import TradeWaitingApprovalModal from './components/TradeWaitingApprovalModal.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import AppNoChainBalance from '@/components/AppNoChainBalance.vue'
import AppUnavailableCard from '@/components/AppUnavailableCard.vue'
import AppLearnMoreLink from '@/components/AppLearnMoreLink.vue'

// Stores
import { useWalletStore, MAIN_TOKEN_CONTRACT } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useToastStore } from '@/stores/toastStore'
import { useTradeOrdersStore } from '@/stores/tradeOrdersStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useAccessStore } from '@/stores/accessStore'
import { useGlobalStore } from '@/stores/globalStore'
import { usePairStore } from '@/stores/pairStore'
import { analytics, ConnectWalletEvent } from '@/analytics'

// Composables
import { useBlockedContent } from '@/composables/useBlockedContent'
import { useTrade } from './useTrade'
import { useSwap, type NewTokenInfo } from '@/composables/useSwap'
import {
  useMarketStatus,
  useMarketStatusDisplay,
  useTradeTokens,
  useTradeValidation,
  useTradeQuote,
  useTradeExecution,
} from './composables'

// Types
import type { Chain } from '@/mew_api/types'
import { ToastType } from '@/types/notification'
import configs from '@/configs'

const { t } = useI18n()

const showHelpLink = import.meta.env.DEV

// --- Stores ---
const pairStore = usePairStore()
const { tradeFromSymbol, tradeToSymbol } = storeToRefs(pairStore)
const { setTradeFromSymbol, setTradeToSymbol } = pairStore
const walletMenu = useWalletMenuStore()
const walletStore = useWalletStore()
const chainsStore = useChainsStore()
const toastStore = useToastStore()
const tradeOrdersStore = useTradeOrdersStore()
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
const { isTradingRestrictedInRegion, isTradingAllowedInRegion } =
  storeToRefs(globalStore)
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
  currentSession,
  isTradingSessionOpen,
  tradingRestrictedHelpUrl,
  fetchMarketStatus,
} = useMarketStatus({
  onMarketOpen: async () => {
    // Refresh tradable assets when market opens
    await loadTradableAssets()
  },
})

const {
  pillStatus,
  untilText,
  nextOpenText,
  dayLabel,
  markerPct,
  timeLabel,
  sessionRanges,
} = useMarketStatusDisplay()

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
  return chains.value
    .filter(chain =>
      supportedChainNames.value.includes(chain.name.toUpperCase()),
    )
    .reverse()
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
  isInsufficientBalanceError,
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
// `useTradeExecution` (below) is what actually knows whether the review modal
// is open, but it needs `currentQuote` from this composable first — so this
// starts false and a watch further down keeps it in sync once tradeFlowStep
// exists, rather than reordering the two calls.
const isReviewModalOpenForQuote = ref(false)
const { currentQuote, quoteExpiresAt, needsApproval, fetchQuote, resetQuote } =
  useTradeQuote({
  fromTokenSelected,
  toTokenSelected,
  fromAmount,
  toAmount,
  walletAddress: userAddress,
  wallet,
  selectedFromChain,
  isMarketOpen: isTradingSessionOpen,
  isSelectedAssetTradeable,
  isTradingAllowedInRegion,
  hasPreQuoteError,
  generalError,
  isLoadingQuote,
  isReviewModalOpen: isReviewModalOpenForQuote,
})

const ctaDisabledLabel = computed(() => {
  if (!isTradingSessionOpen.value) {
    return t('trade.market_status.paused')
  }
  const parsedAmount = Number(fromAmount.value)
  if (fromAmount.value.trim() === '' || !parsedAmount) {
    return t('trade.enter_amount')
  }
  return t('trade.review_trade')
})

// --- Trade Execution ---
const {
  tradeFlowStep,
  isApproving,
  txProceeding,
  orderHash,
  startTradeFlow,
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
  isTradingRestrictedInRegion,
  isTradingAllowedInRegion,
})

const waitingApprovalOpen = computed({
  get: () => tradeFlowStep.value === 'approving',
  set: value => {
    if (!value) tradeFlowStep.value = 'idle'
  },
})
const reviewModalOpen = computed({
  get: () => tradeFlowStep.value === 'review',
  set: value => {
    if (!value) tradeFlowStep.value = 'idle'
  },
})
watch(reviewModalOpen, isOpen => {
  isReviewModalOpenForQuote.value = isOpen
})
const progressModalOpen = computed({
  get: () => tradeFlowStep.value === 'processing',
  set: value => {
    if (!value) tradeFlowStep.value = 'idle'
  },
})

const refreshExpiredQuote = () => {
  if (txProceeding.value || isApproving.value) return
  fetchQuote()
}

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

// MEW-1981: toast whenever the user switches a trade token via the picker.
// Listen to `@select:token`, which the token-select child emits ONLY on an
// explicit user pick — not on the programmatic defaulting it does on network
// change (nor on setFromChain/resetForm ref assignments). That avoids a false
// "Now trading…" toast on network switches. Use the emitted token for the side
// that changed, read the other side from state; skip until both are set.
const notifyTokensSwitched = (
  from?: NewTokenInfo | null,
  to?: NewTokenInfo | null,
) => {
  if (!from || !to) return
  toastStore.addToastMessage({
    text: t('trade.toast.tokens-switched', {
      from: from.symbol,
      to: to.symbol,
    }),
    type: ToastType.Success,
  })
}
const onFromTokenSelected = (token: NewTokenInfo) => {
  notifyTokensSwitched(token, toTokenSelected.value)
}
const onToTokenSelected = (token: NewTokenInfo) => {
  notifyTokensSwitched(fromTokenSelected.value, token)
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

// The toast layer skips the completed toast for the order whose progress
// modal is on screen — the modal itself announces the fill.
watch(
  [tradeFlowStep, orderHash],
  ([step, hash]) => {
    tradeOrdersStore.activeModalOrderHash =
      step === 'processing' ? hash || null : null
  },
  { immediate: true },
)

// Navigating away unmounts the modal, so the suppression must not outlive it.
onBeforeUnmount(() => {
  tradeOrdersStore.activeModalOrderHash = null
})

// Reset the form only when the user leaves the progress modal for good —
// a submit error also closes it but returns to review, keeping the values.
watch(tradeFlowStep, (step, previousStep) => {
  if (previousStep === 'processing' && step === 'idle') {
    clearValues()
    const address = walletAddress.value
    const pendingOrder = address
      ? tradeOrdersStore
          .getOrdersByAddress(address)
          .find(o => o.hash === orderHash.value && o.status === 'pending')
      : undefined
    if (pendingOrder) {
      toastStore.addToastMessage({
        id: `trade-processing-${pendingOrder.hash}`,
        variant: 'dark',
        text: t('trade.toast.processing_trade'),
        textSecondary: t('trade.toast.processing_note'),
        isInfinite: true,
        tradeStatus: { kind: 'processing' },
      })
    }
  }
})

// `isTradingAllowedInRegion` is a dependency so a quote requested while the geo
// check was still in flight — which `fetchQuote` refuses and leaves at '0' — is
// retried once the check resolves, instead of stranding the user on a zero
// quote until they retype.
watch(
  [fromAmount, fromTokenSelected, toTokenSelected, isTradingAllowedInRegion],
  () => {
    if (isSameTokenSelected.value) {
      toAmount.value = '' // Reset same token error on any change
      return
    }
    displayGeneralError.value = ''
    fetchQuote()
  },
)

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

// Blur only when NO session is tradable (conventional closed AND off-hours
// closed). Off-hours open keeps the UI interactive with per-asset gating.
const { blockedClass } = useBlockedContent(
  () =>
    !isTradingSessionOpen.value ||
    !isCurrentNetworkSupported.value ||
    isTradingRestrictedInRegion.value,
)
</script>
