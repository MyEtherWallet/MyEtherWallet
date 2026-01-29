<template>
  <div>
    <div
      :class="[
        'static w-full flex flex-col items-center justify-items-stretch gap-3',
      ]"
    >
      <div class="w-full max-w-[500px] relative">
        <div class="flex items-end justify-between mb-2 px-4">
          <p class="font-bold text-s-28">Trade</p>
          <app-btn-text
            v-if="isMarketOpen"
            class="text-primary text-s-14 pb-1"
            @click="clearValues"
            >Clear all</app-btn-text
          >
        </div>
        <div
          :class="[
            'relative transition-all duration-300',
            !isMarketOpen ? 'blur-sm pointer-events-none opacity-60' : '',
          ]"
        >
          <!-- From Section -->
          <div class="bg-mewBg rounded-20 px-4 pb-4 pt-2 mx-auto">
            <p class="text-s-12 mb-1 font-bold ml-3">You are selling</p>
            <select-chain-for-app
              :filter-chain-type="true"
              :can-store="false"
              :passed-chains="fromChains"
              :preselected-chain="selectedFromChain"
              @update:selected-chain="setFromChain"
            />
            <div
              v-if="!isLoading && !supportedNetwork"
              class="min-h-[108px] mt-4 w-full rounded-16 bg-white py-4 box-border border-transparent border-2 transition-colors shadow-button shadow-button-elevated"
            >
              <p class="text-error text-center text-s-12">
                Network not supported for trading
              </p>
            </div>
            <app-swap-enter-amount
              v-else
              v-model:amount="fromAmount"
              v-model:selected-token="fromTokenSelected!"
              v-model:error="fromAmountError"
              :external-loading="isLoading || !swapLoaded"
              :tokens="fromTokens"
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
              class="mt-4"
            />
          </div>
        </div>

        <!-- Market Closed Banner - Centered Overlay -->
        <div
          v-if="!isLoading && marketStatus && !isMarketOpen"
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

      <!-- Asset Not Tradeable Warning -->
      <div
        v-if="
          !isLoading && !isSelectedAssetTradeable && nonTradeableAssetMessage
        "
        class="w-full max-w-[340px] p-4 bg-warning-10 border border-warning rounded-12 mb-2"
      >
        <p class="text-warning text-s-14 text-center">
          {{ nonTradeableAssetMessage }}
        </p>
      </div>

      <div
        :class="[
          'w-full max-w-[340px] transition-all duration-300',
          !isMarketOpen ? 'blur-sm pointer-events-none opacity-60' : '',
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

// --- Stores ---
const walletMenu = useWalletMenuStore()
const walletStore = useWalletStore()
const chainsStore = useChainsStore()
const accessStore = useAccessStore()

// --- Refs from Stores ---
const { isWalletConnected, walletAddress, wallet, isWatchOnly } =
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
const selectedFromChain = ref<Chain>()
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
  countdownText,
  fetchMarketStatus,
  formatNextOpen,
} = useMarketStatus()

// --- Computed ---
const supportedNetwork = computed(() => {
  if (!selectedFromChain.value) return false
  return supportedChainNames.value.includes(
    selectedFromChain.value.name.toUpperCase(),
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
  walletAddress,
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

  // Reset to default tokens
  if (fromTokens.value.length > 0) {
    fromTokenSelected.value =
      fromTokens.value.find(t => t.address === MAIN_TOKEN_CONTRACT) ||
      fromTokens.value[0] ||
      null
  }
  if (toTokens.value.length > 0) {
    toTokenSelected.value = toTokens.value[0] || null
  }
}

const setFromChain = (chain: Chain) => {
  selectedFromChain.value = chain
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
  }
})

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

  // Set initial chain
  if (
    selectedChain.value &&
    supportedChainNames.value.includes(selectedChain.value.name.toUpperCase())
  ) {
    selectedFromChain.value = selectedChain.value
  } else if (fromChains.value.length > 0) {
    selectedFromChain.value = fromChains.value[0]
  }

  // Set initial from token if connected
  if (isWalletConnected.value && fromTokens.value.length > 0) {
    fromTokenSelected.value =
      fromTokens.value.find(t => t.address === MAIN_TOKEN_CONTRACT) ||
      fromTokens.value[0] ||
      null
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
})
</script>
