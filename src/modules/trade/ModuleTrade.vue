<template>
  <div>
    <div
      :class="[
        'static w-full flex flex-col items-center justify-items-stretch gap-3',
      ]"
    >
      <div class="w-full max-w-[500px] relative">
        <div class="flex items-end justify-between mb-2 px-4">
          <div>
            <p class="font-bold text-s-28">Trade</p>
            <p class="text-info text-s-12 ml-1">
              Buy/Sell Ondo Tokenized stock
            </p>
          </div>
          <app-btn-text
            v-if="
              isMarketOpen &&
              isCurrentNetworkSupported &&
              !isTradingRestrictedInRegion
            "
            class="text-primary text-s-14 pb-1"
            @click="clearValues"
            >Clear all</app-btn-text
          >
        </div>
        <div
          :class="[
            'relative transition-all duration-300',
            !isMarketOpen ||
            !isCurrentNetworkSupported ||
            isTradingRestrictedInRegion
              ? 'blur-sm pointer-events-none opacity-60'
              : '',
          ]"
        >
          <div class="bg-mewBg rounded-20 p-4 mx-auto mb-2">
            <select-chain-for-app
              :can-store="false"
              :passed-chains="fromChains"
              :preselected-chain="selectedFromChain"
              @update:selected-chain="setFromChain"
            />
          </div>
          <!-- From Section -->
          <div
            v-if="supportedNetwork"
            class="bg-mewBg rounded-20 px-4 pb-4 pt-2 mx-auto"
          >
            <p class="text-s-12 mb-1 font-bold ml-3">You are selling</p>

            <div>
              <app-swap-enter-amount
                v-model:amount="fromAmount"
                v-model:selected-token="fromTokenSelected!"
                v-model:error="fromAmountError"
                :external-loading="isLoading || !swapLoaded"
                :tokens="fromTokens"
                :show-balance="isWalletConnected"
                class="mt-2"
              >
                <!-- Percentage Buttons -->

                <template #header>
                  <div
                    v-if="isWalletConnected && fromTokenSelected"
                    class="flex justify-end gap-2 -mt-2 mr-1 mb-4"
                  >
                    <button
                      v-for="pct in [25, 50, 75, 100]"
                      :key="pct"
                      class="px-[10px] py-1 text-s-11 leading-p-120 font-semibold bg-white hoverBGWhite rounded-full transition-all duration-150 shadow-button shadow-button-elevated"
                      @click="setPercentageAmount(pct)"
                    >
                      {{ pct === 100 ? 'Max' : `${pct}%` }}
                    </button>
                  </div></template
                ></app-swap-enter-amount
              >
            </div>
          </div>

          <!-- Arrow Button -->
          <div class="relative h-0 z-10 flex justify-center items-center">
            <button
              label="Swap From/To stocks"
              :class="[
                'absolute right-[50%] top-1/2 bg-white rounded-xl h-10 w-10 flex justify-center items-center translate-x-1/2 -translate-y-1/4 shadow-button shadow-button-elevated transition-colors hoverBGWhite',
              ]"
              @click="swapTokens"
            >
              <arrows-up-down-icon class="w-5 h-5 text-primary" />
            </button>
          </div>

          <!-- To Section -->
          <div class="bg-mewBg rounded-20 px-4 pb-4 pt-2 mx-auto mt-2">
            <p class="text-s-12 mb-1 font-bold ml-3">You are buying</p>
            <app-swap-enter-amount
              v-model:amount="toAmount"
              v-model:selected-token="toTokenSelected!"
              v-model:error="toAmountError"
              :external-loading="isLoadingQuote"
              :show-balance="false"
              :tokens="toTokens"
              :readonly="true"
              :is-estimate="true"
              :is-from-view="false"
              class="mt-2"
            />
          </div>
        </div>

        <!-- Market Closed Banner - Centered Overlay -->
        <div
          v-if="
            !isLoading &&
            marketStatus &&
            !isMarketOpen &&
            isCurrentNetworkSupported
          "
          class="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
        >
          <div
            class="w-full max-w-[340px] p-4 bg-warning-10 border border-warning rounded-12 shadow-lg pointer-events-auto"
          >
            <div class="flex items-center gap-2 justify-center mb-1">
              <div class="w-2 h-2 bg-warning rounded-full"></div>
              <p class="text-warning font-bold text-s-14">Market Closed</p>
            </div>
            <p class="text-grey-70 text-s-12 text-center">
              {{ marketStatus.reason?.message }}
            </p>
            <div class="mt-2 text-center">
              <p
                v-if="countdownText"
                class="text-primary font-bold text-s-16 tabular-nums"
              >
                Opens in {{ countdownText }}
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
            class="w-full max-w-[380px] p-5 bg-white border border-grey-20 rounded-16 shadow-lg pointer-events-auto"
          >
            <div class="flex items-center gap-2 justify-center mb-2">
              <div class="w-2 h-2 bg-error rounded-full"></div>
              <p class="text-error font-bold text-s-16">
                Network Not Supported
              </p>
            </div>
            <p class="text-grey-70 text-s-13 text-center mb-4">
              Trading is not available on
              {{ selectedChain?.nameLong || selectedChain?.name }}. Please
              switch to a supported network.
            </p>
            <div class="flex flex-wrap gap-2 justify-center">
              <button
                v-for="chain in supportedChainsList.reverse()"
                :key="chain.name"
                class="flex items-center gap-2 px-4 py-2 bg-primary-10 hover:bg-primary-20 text-primary font-medium text-s-14 rounded-12 transition-colors"
                @click="switchToNetwork(chain)"
              >
                <img
                  v-if="chain.icon"
                  :src="chain.icon"
                  :alt="chain.name"
                  class="w-5 h-5 rounded-full"
                />
                <span>{{ chain.nameLong || chain.name }}</span>
              </button>
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
            class="w-full max-w-[380px] p-5 bg-white border border-grey-20 rounded-16 shadow-lg pointer-events-auto"
          >
            <div class="flex items-center gap-2 justify-center mb-2">
              <div class="w-2 h-2 bg-error rounded-full"></div>
              <p class="text-error font-bold text-s-16">
                Trading Not Available
              </p>
            </div>
            <p class="text-grey-70 text-s-13 text-center mb-4">
              Trading is not available in your jurisdiction.
            </p>
            <div class="flex justify-center">
              <a
                :href="tradingRestrictedHelpUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary font-medium text-s-14 hover:underline"
              >
                Learn more about geographic restrictions
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Display -->
      <div
        v-if="!isLoading && generalError"
        class="w-full max-w-[340px] p-4 bg-error-10 border border-error rounded-12 mb-2 max-h-[120px] overflow-y-auto"
      >
        <p class="text-error text-s-14 text-center break-words">
          {{ generalError }}
        </p>
      </div>

      <!-- Asset Not Tradeable Warning (only show when market is open) -->
      <div
        v-if="
          !isLoading &&
          isMarketOpen &&
          !isSelectedAssetTradeable &&
          nonTradeableAssetMessage
        "
        class="w-full max-w-[340px] p-4 bg-warning-10 border border-warning rounded-12 mb-2"
      >
        <p class="text-warning text-s-14 text-center">
          {{ toTokenSelected?.symbol }} not currently tradable due to
          {{ nonTradeableAssetMessage }}
        </p>
      </div>

      <div
        :class="[
          'w-full max-w-[340px] transition-all duration-300',
          !isMarketOpen ||
          !isCurrentNetworkSupported ||
          isTradingRestrictedInRegion
            ? 'blur-sm pointer-events-none opacity-60'
            : '',
        ]"
      >
        <app-base-button
          v-if="isWalletConnected && !isWatchOnly"
          class="w-full"
          :disabled="isTradeDisabled || isApproving"
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
            Approving...
          </span>
          <span v-else>{{ needsApproval ? 'Approve' : 'Trade' }}</span>
        </app-base-button>
        <app-base-button
          v-else
          class="w-full"
          :disabled="!supportedNetwork"
          @click="connectWalletForTrade"
        >
          Connect wallet
        </app-base-button>
      </div>
      <app-need-help
        title="Need help trading?"
        help-link="https://help.myetherwallet.com/en/article/what-is-gas"
        class="mx-auto"
      />
    </div>

    <!-- Trade Quote Modal -->
    <trade-quote-modal
      v-model:is-open="quoteModalOpen"
      :quote="currentQuote"
      :from-token="fromTokenSelected"
      :to-token="toTokenSelected"
      :from-amount="fromAmount"
      :loading="txProceeding"
      @confirm="confirmTrade"
      @cancel="quoteModalOpen = false"
    />

    <!-- Trade Initiated Modal -->
    <trade-initiated-modal
      v-model:is-open="tradeInitiatedOpen"
      :order-hash="orderHash"
      :from-chain="selectedFromChain"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { ArrowsUpDownIcon } from '@heroicons/vue/24/solid'
import { parseUnits, formatUnits } from 'viem'

// Components
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppNeedHelp from '@/components/AppNeedHelp.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import SelectChainForApp from '@/components/select_chain/SelectChainForApp.vue'
import AppSwapEnterAmount from '@/components/AppSwapEnterAmount.vue'
import TradeQuoteModal from './components/TradeQuoteModal.vue'
import TradeInitiatedModal from './components/TradeInitiatedModal.vue'

// Stores
import { useWalletStore, MAIN_TOKEN_CONTRACT } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useAccessStore } from '@/stores/accessStore'
import { useGlobalStore } from '@/stores/globalStore'

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

// --- Stores ---
const walletMenu = useWalletMenuStore()
const walletStore = useWalletStore()
const chainsStore = useChainsStore()
const accessStore = useAccessStore()
const globalStore = useGlobalStore()

// --- Refs from Stores ---
const { isWalletConnected, walletAddress, wallet, isWatchOnly, allTokens } =
  storeToRefs(walletStore)
const { selectedChain, chains } = storeToRefs(chainsStore)
const { selectedTradeTokenSymbol } = storeToRefs(walletMenu)

// --- Use Trade Composable ---
const {
  supportedChainNames,
  tradableAssets,
  additionalBuyAssets,
  isLoading,
  loadTradableAssets,
} = useTrade()

// --- Use Swap Composable for fromTokens ---
const { initSwapper, fromTokens: swapFromTokens, swapLoaded } = useSwap()

// --- Local State ---
// Initialize selectedFromChain immediately from the store to prevent defaulting to Ethereum
const selectedFromChain = ref<Chain | undefined>(chainsStore.selectedChain)
const fromTokenSelected = ref<NewTokenInfo | null>(null)
const toTokenSelected = ref<NewTokenInfo | null>(null)
const fromAmount = ref<string>('0')
const toAmount = ref<string>('0')
const generalError = ref<string>('')
const toAmountError = ref<string>('')

// --- Market Status ---
const {
  marketStatus,
  isMarketOpen,
  isTradingRestrictedInRegion,
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

const fromChains = computed(() => {
  return chains.value.filter(chain =>
    supportedChainNames.value.includes(chain.name.toUpperCase()),
  )
})

const fromTokens = computed(() => {
  return (swapFromTokens.value || []) as NewTokenInfo[]
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

// --- Trade Tokens ---
const { isSelectedAssetTradeable, nonTradeableAssetMessage, toTokens } =
  useTradeTokens({
    selectedFromChain,
    fromTokens,
    fromTokenSelected,
    toTokenSelected,
    tradableAssets,
    additionalBuyAssets,
  })

// --- Trade Quote ---
// Note: We need to create isLoadingQuote first before using it in validation
const isLoadingQuote = ref(false)

// --- Trade Validation ---
const { hasPreQuoteError, fromAmountError, isTradeDisabled } =
  useTradeValidation({
    fromTokenSelected,
    fromAmount,
    toAmount,
    isWalletConnected,
    isMarketOpen,
    isSelectedAssetTradeable,
    supportedNetwork,
    isLoadingQuote,
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
  isMarketOpen,
  isSelectedAssetTradeable,
  hasPreQuoteError,
  generalError,
  isLoadingQuote,
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
const clearValues = () => {
  fromAmount.value = '0'
  toAmount.value = '0'
  toAmountError.value = ''
  generalError.value = ''
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
  walletMenu.setIsOpenSideMenu(false)
  accessStore.openAccessDialog()
}

// --- Watchers ---
watch([fromAmount, fromTokenSelected, toTokenSelected], () => {
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
    fromAmount.value = '0'
    toAmount.value = '0'
  }
})

// Watch for swap loaded to set default tokens after chain change
watch(swapLoaded, loaded => {
  if (loaded && !fromTokenSelected.value && fromTokens.value.length > 0) {
    fromTokenSelected.value = getDefaultFromToken()
  }
  if (loaded && !toTokenSelected.value && toTokens.value.length > 0) {
    toTokenSelected.value = toTokens.value[0] || null
  }
})

// Watch for wallet tokens and additionalBuyAssets to update default from token when balances load
watch(
  [allTokens, additionalBuyAssets, fromTokens, selectedFromChain],
  () => {
    // Check if we should update the from token selection
    if (!fromTokens.value.length || !isWalletConnected.value) return

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
  },
  { deep: true, immediate: true },
)

// Watch for selected trade token from store
watch(
  [selectedTradeTokenSymbol, toTokens],
  ([symbol, tokens]) => {
    if (symbol && tokens.length > 0) {
      const matchingToken = tokens.find(
        (t: NewTokenInfo) => t.symbol.toUpperCase() === symbol.toUpperCase(),
      )
      if (matchingToken) {
        toTokenSelected.value = matchingToken
      }
    }
  },
  { immediate: true },
)

// --- Lifecycle ---
onBeforeMount(async () => {
  // Initialize swap to get fromTokens and fetch market status
  await Promise.all([initSwapper(), loadTradableAssets()])

  // Fetch market status
  await fetchMarketStatus()

  // Only set tokens if the network is supported
  if (isCurrentNetworkSupported.value) {
    // Set initial from token - prefer highest balance additional asset
    if (fromTokens.value.length > 0) {
      fromTokenSelected.value = getDefaultFromToken()
    }

    // Set initial to token
    if (selectedTradeTokenSymbol.value && toTokens.value.length > 0) {
      const matchingToken = toTokens.value.find(
        (t: NewTokenInfo) =>
          t.symbol.toUpperCase() ===
          selectedTradeTokenSymbol.value!.toUpperCase(),
      )
      if (matchingToken) {
        toTokenSelected.value = matchingToken
      } else if (toTokens.value.length > 0) {
        toTokenSelected.value = toTokens.value[0] || null
      }
    } else if (toTokens.value.length > 0) {
      toTokenSelected.value = toTokens.value[0] || null
    }
  }
})
</script>
