import { onBeforeMount, computed, ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
// Stores
import { useWalletStore, MAIN_TOKEN_CONTRACT } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useAccessStore } from '@/stores/accessStore'
import { useGlobalStore } from '@/stores/globalStore'
import { usePairStore } from '@/stores/pairStore'
import { useToastStore } from '@/stores/toastStore'
import { analytics, ConnectWalletEvent } from '@/analytics'

// Composables
import { useTrade } from './useTrade'
import { useSwapStore, type NewTokenInfo } from '@/stores/swapStore'
import { useMarketStatus } from './useMarketStatus'
import { useMarketStatusDisplay } from './useMarketStatusDisplay'
import { useTradeTokens } from './useTradeTokens'
import { useTradeValidation } from './useTradeValidation'
import { useTradeQuote } from './useTradeQuote'
import { useTradeExecution, type TradeFlowStep } from './useTradeExecution'
import { useTradeForm } from './useTradeForm'
import { useMaxAmount } from '@/composables/useMaxAmount'
import { useBlockedContent } from '@/composables/useBlockedContent'
import type { Chain } from '@/mew_api/types'
import { ToastType } from '@/types/notification'

export function useTradeModule() {
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
  const toastStore = useToastStore()

  // --- Refs from Stores ---
  const {
    isWalletConnected,
    walletAddress,
    userAddress,
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

  // --- Swap Store for fromTokens ---
  const swapStore = useSwapStore()
  const { fromTokens: swapFromTokens, swapLoaded } = storeToRefs(swapStore)
  const { initSwapper } = swapStore

  // --- Local State ---
  // Initialize selectedFromChain immediately from the store to prevent defaulting to Ethereum
  const form = useTradeForm(chainsStore.selectedChain)
  const {
    selectedFromChain,
    fromTokenSelected,
    fromTokenManuallySelected,
    toTokenSelected,
    fromAmount,
    toAmount,
    generalError,
    toAmountError,
    displayGeneralError,
    isLoadingQuote,
    isPristine,
    resetPristine,
    markDirty,
    isPairUnavailable,
  } = form

  // --- Market Status ---
  const {
    marketStatus,
    currentSession,
    isTradingSessionOpen,
    hasStaleMarketStatus,
    tradingRestrictedHelpUrl,
    countdownText,
    fetchMarketStatus,
    formatNextOpen,
  } = useMarketStatus()

  watch(isTradingSessionOpen, (isOpen, wasOpen) => {
    if (isOpen && wasOpen === false) void loadTradableAssets()
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
    form,
    fromTokens,
    tradableAssets,
    additionalBuyAssets,
    hardcodedTokensInfo,
    currentSession,
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

  // --- Trade Validation ---
  const {
    hasPreQuoteError,
    fromAmountError,
    isInsufficientBalanceError,
    isTradeDisabled,
    isSameTokenSelected,
  } = useTradeValidation({
    form,
    isWalletConnected,
    // Trading is allowed whenever ANY session is open (conventional or off-hours);
    // per-asset session eligibility is enforced via isSelectedAssetTradeable.
    isMarketOpen: isTradingSessionOpen,
    isSelectedAssetTradeable,
    supportedNetwork,
  })

  // --- Trade Quote ---
  const isReviewModalOpenForQuote = ref(false)

  const {
    currentQuote,
    quoteExpiresAt,
    needsApproval,
    fetchQuote,
    resetQuote,
  } = useTradeQuote({
    form,
    walletAddress: userAddress,
    wallet,
    isMarketOpen: isTradingSessionOpen,
    isSelectedAssetTradeable,
    isTradingAllowedInRegion,
    hasPreQuoteError,
    isReviewModalOpen: isReviewModalOpenForQuote,
    hasStaleMarketStatus,
  })

  // --- Trade Execution ---
  const {
    tradeFlowStep,
    isApproving,
    txProceeding,
    orderHash,
    startTradeFlow,
    confirmApproval,
    confirmTrade,
  } = useTradeExecution({
    form,
    walletAddress,
    wallet,
    currentQuote,
    needsApproval,
    isTradingRestrictedInRegion,
    isTradingAllowedInRegion,
  })

  // --- Trade Flow ---
  const stepModel = (step: TradeFlowStep) =>
    computed({
      get: () => tradeFlowStep.value === step,
      set: value => {
        if (!value) tradeFlowStep.value = 'idle'
      },
    })

  const approvalIntroOpen = stepModel('approvalIntro')
  const waitingApprovalOpen = stepModel('approving')
  const reviewModalOpen = stepModel('review')
  const progressModalOpen = stepModel('processing')

  watch(reviewModalOpen, isOpen => {
    isReviewModalOpenForQuote.value = isOpen
  })

  const refreshExpiredQuote = () => {
    if (txProceeding.value || isApproving.value) return
    fetchQuote()
  }

  const ctaDisabledLabel = computed(() => {
    if (!isTradingSessionOpen.value) {
      return t('trade.market_status.paused')
    }
    if (isPairUnavailable.value) {
      return t('trade.pair_unavailable.cta')
    }
    const parsedAmount = Number(fromAmount.value)
    if (fromAmount.value.trim() === '' || !parsedAmount) {
      return t('trade.enter_amount')
    }
    return t('trade.review_trade')
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
    resetPristine()
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
    // Update the global network - swapStore has a watcher that will reinitialize
    globalStore.setSelectedNetwork(chain.name)
    // Clear current selections - they'll be repopulated when swapLoaded becomes true
    fromTokenSelected.value = null
    toTokenSelected.value = null
    // Empty, not '0' — matching `clearValues` and the `selectedChain` watcher.
    // '0' renders a literal zero in the input and, because `useFormPristine`
    // only treats '' as empty, marks the form dirty on a mere network switch.
    fromAmount.value = ''
    toAmount.value = ''
  }

  const switchToNetwork = (chain: Chain) => {
    setFromChain(chain)
  }

  // const swapTokens = () => {
  //   const tempFrom = fromTokenSelected.value
  //   const tempTo = toTokenSelected.value

  //   fromTokenSelected.value = tempTo
  //   toTokenSelected.value = tempFrom
  //   fromAmount.value = '0'
  //   toAmount.value = '0'
  // }

  const selectedWalletToken = computed(() => {
    const address = fromTokenSelected.value?.address?.toLowerCase()
    return address
      ? allTokens.value.find(token => token.contract?.toLowerCase() === address)
      : undefined
  })

  const { setMaxAmount: setPercentageAmount } = useMaxAmount({
    getBalance: () => BigInt(selectedWalletToken.value?.balanceWei || '0'),
    getDecimals: () => fromTokenSelected.value?.decimals || 18,
    getEstimatedFee: () => 0n,
    isNativeToken: () =>
      fromTokenSelected.value?.address?.toLowerCase() ===
      MAIN_TOKEN_CONTRACT.toLowerCase(),
    isTokenSelected: () => !!fromTokenSelected.value && isWalletConnected.value,
    getAmount: () => fromAmount.value,
    onAmountChange: value => {
      fromAmount.value = String(value)
    },
    markFormDirty: markDirty,
    resetFormPristine: resetPristine,
    getTokenIdentifier: () => fromTokenSelected.value?.address,
    getDependencies: () => [selectedWalletToken.value?.balanceWei],
  })

  const connectWalletForTrade = () => {
    analytics.trackConnectWalletEvent(ConnectWalletEvent.CLICKED, {
      source: 'Trade',
    })
    accessStore.openAccessDialog()
  }

  // --- Watchers ---

  // Reset state when the progress modal is closed
  watch(
    () => progressModalOpen.value,
    isOpen => {
      if (!isOpen) {
        clearValues()
      }
    },
  )

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
    () => swapLoaded.value,
    loaded => {
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

  // Sync trade pair to pairStore. Deliberately does NOT set
  // `fromTokenManuallySelected`: this watcher cannot tell a user's pick from the
  // programmatic assignments made by onBeforeMount, the `swapLoaded` watcher, the
  // balance-refresh watcher and the `additionalBuyAssets` watcher. Marking those
  // as manual left the flag permanently true after first load, which
  // disabled highest-balance auto-selection for the rest of the session. The
  // flag is set in `onFromTokenSelected` instead — the only user-driven path.
  watch(fromTokenSelected, token => {
    setTradeFromSymbol(token?.symbol ?? null)
  })

  watch(toTokenSelected, token => {
    setTradeToSymbol(token?.symbol ?? null)
  })

  // --- Lifecycle ---
  onBeforeMount(async () => {
    // Let a pending chain change settle before initializing, exactly as
    // `useSwapModule.initialize` does. The store's chain watcher resets
    // `swapLoaded` on the pre-flush queue, so calling straight into
    // `initSwapper()` here can observe the previous chain's `swapLoaded === true`
    // and skip the reinitialization this mount needs.
    await nextTick()
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

  // Blocked only when NO session is tradable (conventional closed AND off-hours
  // closed). Off-hours open keeps the UI interactive with per-asset gating.
  const { blockedClass } = useBlockedContent(
    () =>
      !isTradingSessionOpen.value ||
      !isCurrentNetworkSupported.value ||
      isTradingRestrictedInRegion.value,
  )

  // MEW-1981: toast whenever the user switches a trade token via the picker.
  // Listen to `@select:token`, which the token-select child emits ONLY on an
  // explicit user pick — not on the programmatic defaulting it does on network
  // change (nor on setFromChain/clearValues ref assignments). That avoids a false
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
    // The child emits `select:token` only on an explicit user pick, so this is
    // the one place a selection can be attributed to the user.
    fromTokenManuallySelected.value = true
    notifyTokensSwitched(token, toTokenSelected.value)
  }
  const onToTokenSelected = (token: NewTokenInfo) => {
    notifyTokensSwitched(fromTokenSelected.value, token)
  }

  return {
    selectedChain,
    swapLoaded,
    isWalletConnected,
    isWatchOnly,
    hasChainBalance,
    isTradingRestrictedInRegion,
    selectedFromChain,
    fromTokenSelected,
    toTokenSelected,
    fromAmount,
    toAmount,
    toAmountError,
    isPristine,
    marketStatus,
    isTradingSessionOpen,
    tradingRestrictedHelpUrl,
    countdownText,
    formatNextOpen,
    supportedNetwork,
    isCurrentNetworkSupported,
    supportedChainsList,
    fromChains,
    fromTokens,
    toTokenSantized,
    displayGeneralError,
    isLoading,
    isLoadingQuote,
    isSelectedAssetTradeable,
    isCashOutTradableAsset,
    nonTradeableAssetMessage,
    disabledTokenAddresses,
    fromAmountError,
    isTradeDisabled,
    currentQuote,
    needsApproval,
    isApproving,
    txProceeding,
    approvalIntroOpen,
    waitingApprovalOpen,
    reviewModalOpen,
    progressModalOpen,
    quoteExpiresAt,
    refreshExpiredQuote,
    ctaDisabledLabel,
    showHelpLink,
    isInsufficientBalanceError,
    isPairUnavailable,
    pillStatus,
    untilText,
    nextOpenText,
    dayLabel,
    markerPct,
    timeLabel,
    sessionRanges,
    orderHash,
    startTradeFlow,
    confirmApproval,
    confirmTrade,
    clearValues,
    setFromChain,
    switchToNetwork,
    setPercentageAmount,
    connectWalletForTrade,
    blockedClass,
    onFromTokenSelected,
    onToTokenSelected,
  }
}
