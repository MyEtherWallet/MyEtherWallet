<template>
  <div>
    <div
      :class="[
        'static w-full flex flex-col items-center justify-items-stretch gap-3',
      ]"
    >
      <div class="w-full max-w-[500px]">
        <div class="flex items-end justify-between mb-2 px-4">
          <p class="font-bold text-s-28">Trade</p>
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
        :disabled="isTradeDisabled || isApproving"
        @click="needsApproval ? handleApprove() : tradeButton()"
      >
        <span v-if="isApproving" class="flex items-center justify-center gap-2">
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
      <div class="mx-auto w-full max-w-[340px]" v-else>
        <app-base-button
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
import { useDebounceFn } from '@vueuse/core'
import { ArrowsUpDownIcon } from '@heroicons/vue/24/solid'

// Components
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppNeedHelp from '@/components/AppNeedHelp.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import SelectChainForApp from '@/components/select_chain/SelectChainForApp.vue'
import AppSwapEnterAmount from '@/components/AppSwapEnterAmount.vue'
import TradeQuoteModal from './components/TradeQuoteModal.vue'
import TradeInitiatedModal from './components/TradeInitiatedModal.vue'

// Stores and Composables
import { useWalletStore, MAIN_TOKEN_CONTRACT } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useAccessStore } from '@/stores/accessStore'
import { useToastStore } from '@/stores/toastStore'
import { useTradeOrdersStore } from '@/stores/tradeOrdersStore'
import { useTrade } from './useTrade'
import { useSwap, type NewTokenInfo } from '@/composables/useSwap'

// Utils and Types
import { parseUnits, formatUnits } from 'viem'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import type { Chain } from '@/mew_api/types'
import { ToastType } from '@/types/notification'

// --- Stores ---
const walletMenu = useWalletMenuStore()
const walletStore = useWalletStore()
const chainsStore = useChainsStore()
const accessStore = useAccessStore()
const toastStore = useToastStore()

// --- Refs from Stores ---
const { isWalletConnected, walletAddress, wallet, isWatchOnly } =
  storeToRefs(walletStore)
const { selectedChain, chains } = storeToRefs(chainsStore)
const { selectedTradeTokenSymbol } = storeToRefs(walletMenu)

// --- Use Trade Composable ---
const { supportedChainNames, tradableAssets, isLoading, loadTradableAssets } =
  useTrade()

// --- Use Swap Composable for fromTokens ---
const { initSwapper, fromTokens: swapFromTokens, swapLoaded } = useSwap()

// --- Local State ---
const selectedFromChain = ref<Chain>()
const fromTokenSelected = ref<NewTokenInfo | null>(null)
const toTokenSelected = ref<NewTokenInfo | null>(null)

const fromAmount = ref<string>('0')
const toAmount = ref<string>('0')
const generalError = ref<string>('')
const fromAmountError = ref<string>('')
const toAmountError = ref<string>('')

const isLoadingQuote = ref(false)
const quoteModalOpen = ref(false)
const tradeInitiatedOpen = ref(false)
const txProceeding = ref(false)
const orderHash = ref<string>('')
const tradeOrdersStore = useTradeOrdersStore()

// Approval state
const needsApproval = ref(false)
const isApproving = ref(false)

const currentQuote = ref<{
  startAmount: bigint
  endAmount?: bigint
  avgAmount?: bigint
} | null>(null)

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

const toTokens = computed(() => {
  if (!tradableAssets.value || !selectedFromChain.value)
    return [] as NewTokenInfo[]
  const chainName = selectedFromChain.value.name.toUpperCase()

  // Create a lookup map from fromTokens by address (lowercase for comparison)
  const fromTokensMap = new Map<string, NewTokenInfo>()
  for (const token of fromTokens.value) {
    if (token.address) {
      fromTokensMap.set(token.address.toLowerCase(), token)
    }
  }

  return tradableAssets.value
    .filter(asset =>
      asset.addresses.some(addr => addr.chainName?.toUpperCase() === chainName),
    )
    .map(asset => {
      const addressInfo = asset.addresses.find(
        addr => addr.chainName?.toUpperCase() === chainName,
      )
      const tokenAddress = addressInfo?.address || ''

      // Check if this token exists in fromTokens to get enriched data
      const matchingFromToken = tokenAddress
        ? fromTokensMap.get(tokenAddress.toLowerCase())
        : undefined
      return {
        name: asset.stockAlias || asset.symbol,
        symbol: asset.symbol,
        decimals: addressInfo?.decimals || 18,
        address: tokenAddress,
        logoURI: asset.iconPngUrl || asset.iconSvgUrl || '',
        cgId: matchingFromToken?.cgId || '',
        type: 'erc20',
        rank: matchingFromToken?.rank || 0,
        balance: matchingFromToken?.balance || '0',
        price: matchingFromToken?.price || 0,
        networkInfo: {
          name: chainName.toLowerCase(),
          isAddress: tokenAddress,
        },
      }
    }) as unknown as NewTokenInfo[]
})

const isTradeDisabled = computed(
  () =>
    !supportedNetwork.value ||
    !(
      fromAmount.value !== '' &&
      fromAmount.value !== '0' &&
      fromAmountError.value === '' &&
      toAmount.value !== '0'
    ) ||
    isLoadingQuote.value,
)

// --- Methods ---
const clearValues = () => {
  fromAmount.value = '0'
  toAmount.value = '0'
  fromAmountError.value = ''
  toAmountError.value = ''
  generalError.value = ''
  currentQuote.value = null
  needsApproval.value = false

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

const fetchQuote = useDebounceFn(async () => {
  if (
    !fromTokenSelected.value ||
    !toTokenSelected.value ||
    !fromAmount.value ||
    fromAmount.value === '0' ||
    !walletAddress.value
  ) {
    toAmount.value = '0'
    return
  }

  isLoadingQuote.value = true
  generalError.value = ''

  try {
    // Import OneInchFusion dynamically to avoid circular dependencies
    const { default: OneInchFusion } =
      await import('./providers/oneinch_fusion/oneInchFusion')

    const chainId = parseInt(selectedFromChain.value?.chainID || '1')
    const fusion = new OneInchFusion(wallet.value as any, chainId)

    const decimals = fromTokenSelected.value.decimals || 18
    const amountInBaseUnits = parseUnits(fromAmount.value, decimals).toString()

    const quote = await fusion.getQuote({
      fromTokenAddress: fromTokenSelected.value.address,
      toTokenAddress: toTokenSelected.value.address,
      amount: amountInBaseUnits,
      fromAddress: walletAddress.value,
      fromTokenDecimals: fromTokenSelected.value.decimals || 18,
      toTokenDecimals: toTokenSelected.value.decimals || 18,
    })

    currentQuote.value = quote
    const toDecimals = toTokenSelected.value.decimals || 18
    toAmount.value = formatFloatingPointValue(
      formatUnits(quote.avgAmount || quote.startAmount, toDecimals),
    ).value

    // Check if approval is required
    const approvalRequired = await fusion.isApprovalRequired(
      walletAddress.value,
      fromTokenSelected.value.address,
      BigInt(amountInBaseUnits),
    )
    needsApproval.value = approvalRequired
  } catch (e) {
    generalError.value = (e as Error).message || 'Failed to fetch quote'
    toAmount.value = '0'
  } finally {
    isLoadingQuote.value = false
  }
}, 500)

const handleApprove = async () => {
  if (!fromTokenSelected.value || !walletAddress.value || !wallet.value) {
    return
  }

  isApproving.value = true

  try {
    const { default: OneInchFusion } =
      await import('./providers/oneinch_fusion/oneInchFusion')

    const chainId = parseInt(selectedFromChain.value?.chainID || '1')
    const fusion = new OneInchFusion(wallet.value as any, chainId)

    await fusion.setApproval(
      walletAddress.value,
      fromTokenSelected.value.address,
    )

    // Approval successful, update state
    needsApproval.value = false

    toastStore.addToastMessage({
      text: 'Approval successful! You can now trade.',
      type: ToastType.Success,
    })
  } catch (e) {
    toastStore.addToastMessage({
      text: (e as Error).message || 'Failed to approve token',
      type: ToastType.Error,
    })
  } finally {
    isApproving.value = false
  }
}

const tradeButton = () => {
  if (!currentQuote.value) {
    toastStore.addToastMessage({
      text: 'Please wait for quote to load',
      type: ToastType.Error,
    })
    return
  }
  quoteModalOpen.value = true
}

const confirmTrade = async () => {
  if (!fromTokenSelected.value || !toTokenSelected.value || !wallet.value) {
    return
  }

  txProceeding.value = true

  try {
    const { default: OneInchFusion } =
      await import('./providers/oneinch_fusion/oneInchFusion')

    const chainId = parseInt(selectedFromChain.value?.chainID || '1')
    const fusion = new OneInchFusion(wallet.value as any, chainId)

    const decimals = fromTokenSelected.value.decimals || 18
    const amountInBaseUnits = parseUnits(fromAmount.value, decimals).toString()

    const result = await fusion.submitOrder({
      fromTokenAddress: fromTokenSelected.value.address,
      toTokenAddress: toTokenSelected.value.address,
      amount: amountInBaseUnits,
      fromAddress: walletAddress.value!,
      fromTokenDecimals: fromTokenSelected.value.decimals || 18,
      toTokenDecimals: toTokenSelected.value.decimals || 18,
    })

    orderHash.value = result.hash
    quoteModalOpen.value = false
    tradeInitiatedOpen.value = true

    // Add order to store (will appear in notifications)
    const toDecimals = toTokenSelected.value.decimals || 18
    const expectedToAmount = formatFloatingPointValue(
      formatUnits(
        currentQuote.value?.avgAmount || currentQuote.value?.startAmount || 0n,
        toDecimals,
      ),
    ).value

    tradeOrdersStore.addOrder({
      hash: result.hash,
      status: 'pending',
      fromAmount: fromAmount.value,
      fromSymbol: fromTokenSelected.value.symbol,
      fromDecimals: fromTokenSelected.value.decimals || 18,
      expectedToAmount,
      toSymbol: toTokenSelected.value.symbol,
      toDecimals: toTokenSelected.value.decimals || 18,
      createdAt: Math.floor(Date.now() / 1000),
      duration: 180, // Default 3 minutes, will be updated from status
      fills: [],
      usdValue: fromTokenSelected.value.price
        ? (
            parseFloat(fromAmount.value) * fromTokenSelected.value.price
          ).toFixed(2)
        : undefined,
      chainId,
      fromAddress: walletAddress.value!,
      seen: false, // New order is unseen
    })

    toastStore.addToastMessage({
      text: 'Trade order submitted successfully!',
      type: ToastType.Success,
    })
  } catch (e) {
    toastStore.addToastMessage({
      text: (e as Error).message || 'Failed to submit trade order',
      type: ToastType.Error,
    })
  } finally {
    txProceeding.value = false
  }
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

// Watch for selected trade token from store (set from stocks view)
watch(
  [selectedTradeTokenSymbol, toTokens],
  ([symbol, tokens]) => {
    if (symbol && tokens.length > 0) {
      const matchingToken = tokens.find(
        t => t.symbol.toUpperCase() === symbol.toUpperCase(),
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
  // Initialize swap to get fromTokens
  await initSwapper()
  await loadTradableAssets()

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

  // Set initial to token - check if there's a selected token from store first
  if (selectedTradeTokenSymbol.value && toTokens.value.length > 0) {
    const matchingToken = toTokens.value.find(
      t =>
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
