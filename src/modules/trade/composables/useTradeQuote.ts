import {
  getCurrentScope,
  onScopeDispose,
  ref,
  type Ref,
  type ComputedRef,
} from 'vue'
import { useI18n } from 'vue-i18n'
import { useDebounceFn } from '@vueuse/core'
import { parseUnits, formatUnits } from 'viem'
import { SENTRY_MODULE_TAGS } from '@/sentry/constants'
import {
  analytics,
  TradeEvent,
  TradeEventError,
  type TradePayloadShared,
} from '@/analytics'
import { isTransientRpcError } from '@/modules/trade/common/transientRpcError'
import {
  isBelowMinimumError,
  isExpectedClientError,
  isPairUnavailableError,
  isTransientNetworkError,
} from '@/modules/trade/common/expectedTradeError'
import { reportModuleError } from '@/utils/reportModuleError'
import type { WalletInterface } from '@/providers/common/walletInterface'
import type { TradeForm } from './useTradeForm'

import type { QuoteOutputType } from '@/modules/trade/providers/oneinch_fusion/oneInchTypes'

export interface QuoteData {
  startAmount: bigint
  endAmount?: bigint
  avgAmount?: bigint
}

interface UseTradeQuoteOptions {
  form: TradeForm
  walletAddress: Ref<string | null | undefined>
  wallet: Ref<WalletInterface | null>
  isMarketOpen: ComputedRef<boolean>
  isSelectedAssetTradeable: ComputedRef<boolean>
  /**
   * Regional eligibility resolved AND allowed — see the store.
   *
   * Guarded here as well as in the UI, and expressed as "allowed" rather than
   * "not restricted" because the underlying flag starts `false`: gating on that
   * would quote for a restricted user during the window before the async geo
   * check resolves, which is exactly the window this guard exists for.
   */
  isTradingAllowedInRegion: Ref<boolean>
  hasPreQuoteError: ComputedRef<boolean>
  isReviewModalOpen: Ref<boolean>
  hasStaleMarketStatus: () => boolean
}

export function useTradeQuote(options: UseTradeQuoteOptions) {
  const {
    form,
    walletAddress,
    wallet,
    isMarketOpen,
    isSelectedAssetTradeable,
    isTradingAllowedInRegion,
    hasPreQuoteError,
    isReviewModalOpen,
    hasStaleMarketStatus,
  } = options
  const {
    fromTokenSelected,
    toTokenSelected,
    fromAmount,
    toAmount,
    selectedFromChain,
    generalError,
    isLoadingQuote,
    isPairUnavailable,
    isBelowMinimum,
  } = form

  const { t } = useI18n()

  const currentQuote = ref<QuoteOutputType | null>(null)
  const quoteExpiresAt = ref<number | null>(null)
  const needsApproval = ref(false)

  const getToAmountUSD = (): number => {
    const endAmount = currentQuote.value?.endAmount
    if (!endAmount) return 0
    const toDecimals = toTokenSelected.value?.decimals || 18
    const toHuman = parseFloat(formatUnits(endAmount, toDecimals))
    return toHuman * (toTokenSelected.value?.price || 0)
  }

  const getAnalyticsPayload = (): TradePayloadShared => ({
    network: selectedFromChain.value?.name || 'N/A',
    fromToken: fromTokenSelected.value?.symbol || 'N/A',
    fromAmount: fromAmount.value,
    fromAmountUSD: (
      parseFloat(fromAmount.value || '0') *
      (fromTokenSelected.value?.price || 0)
    ).toString(),
    toToken: toTokenSelected.value?.symbol || 'N/A',
    toAmount: currentQuote.value?.endAmount?.toString() || '',
    toAmountUSD: getToAmountUSD().toString(),
    tradePair: `${fromTokenSelected.value?.symbol || 'N/A'}-${toTokenSelected.value?.symbol || 'N/A'}`,
  })

  let quoteRunId = 0

  const runQuote = async (runId: number) => {
    // A run superseded (or cancelled) while waiting in the debounce queue must
    // not touch any state — not even the synchronous flag resets below.
    if (runId !== quoteRunId) return
    const isStale = () => runId !== quoteRunId

    isPairUnavailable.value = false
    isBelowMinimum.value = false
    generalError.value = ''
    needsApproval.value = false

    //Dont'fetch quote if from amount is empty, this prevents fetching quotes when user deletes the input
    if (fromAmount.value === '') {
      toAmount.value = ''
      return
    }
    // Don't fetch quotes when market is closed
    if (!isMarketOpen.value) {
      toAmount.value = '0'
      return
    }

    // Only quote once the region is known to allow trading. Silent, like the
    // gates above: the panel already renders the restriction notice, and this
    // path has no user gesture behind it to answer anyway. The caller re-runs
    // this when eligibility resolves, so a quote requested during the check is
    // not lost — it just arrives a beat later.
    if (!isTradingAllowedInRegion.value) {
      toAmount.value = '0'
      return
    }

    // Don't fetch quotes when selected asset is not tradeable
    if (!isSelectedAssetTradeable.value) {
      toAmount.value = '0'
      return
    }

    if (
      !fromTokenSelected.value ||
      !toTokenSelected.value ||
      !fromAmount.value ||
      fromAmount.value === '0' ||
      !walletAddress.value ||
      !wallet.value ||
      hasPreQuoteError.value
    ) {
      toAmount.value = '0'
      return
    }

    // Snapshot every input for this run. The awaits below can outlive a token
    // or amount change, and mixing pre-await inputs with post-await reads is
    // how a stale quote gets formatted with the wrong token's decimals.
    const fromToken = fromTokenSelected.value
    const toToken = toTokenSelected.value
    const amount = fromAmount.value
    const address = walletAddress.value

    try {
      const { default: OneInchFusion } =
        await import('../providers/oneinch_fusion/oneInchFusion')
      if (isStale()) return

      const chainId = parseInt(selectedFromChain.value?.chainID || '1')
      const fusion = new OneInchFusion(wallet.value, chainId)

      const decimals = fromToken.decimals || 18
      const amountInBaseUnits = parseUnits(amount, decimals).toString()

      const quote = await fusion.getQuote({
        fromTokenAddress: fromToken.address,
        toTokenAddress: toToken.address,
        amount: amountInBaseUnits,
        fromAddress: address,
        fromTokenDecimals: fromToken.decimals || 18,
        toTokenDecimals: toToken.decimals || 18,
      })
      if (isStale()) return

      // No quote returned from the provider
      if (!quote || (!quote.avgAmount && !quote.startAmount)) {
        generalError.value = t('trade.error.no-quotes-returned')
        toAmount.value = '0'
        analytics.trackTradeEventError(
          isReviewModalOpen.value
            ? TradeEventError.OFFER_ERROR
            : TradeEventError.PRELIMINARY_ERROR,
          {
            ...getAnalyticsPayload(),
            errorMsg: 'No quotes returned',
          },
        )
        return
      }

      currentQuote.value = quote
      quoteExpiresAt.value = quote.auctionDurationSeconds
        ? Date.now() + quote.auctionDurationSeconds * 1000
        : null
      // Raw decimal string (no grouping/abbreviation) — consumers format for
      // display and can safely do arithmetic on it.
      const toDecimals = toToken.decimals || 18
      toAmount.value = formatUnits(
        quote.avgAmount || quote.startAmount,
        toDecimals,
      )

      if (!isReviewModalOpen.value) {
        analytics.trackTradeEvent(TradeEvent.PRELIMINARY_SHOWN, {
          ...getAnalyticsPayload(),
        })
      }

      // Check if approval is required
      const approvalRequired = await fusion.isApprovalRequired(
        address,
        fromToken.address,
        BigInt(amountInBaseUnits),
      )
      if (isStale()) return
      needsApproval.value = approvalRequired
    } catch (e) {
      // A stale failure belongs to a pair or amount the user already left;
      // writing its flags would poison the fresh quote's state.
      if (isStale()) return
      const rawMessage =
        e instanceof Error ? e.message : typeof e === 'string' ? e : undefined
      isPairUnavailable.value =
        isPairUnavailableError(e) && !hasStaleMarketStatus()
      isBelowMinimum.value = isBelowMinimumError(e)
      generalError.value = rawMessage || t('trade.error.failed-to-fetch-quote')
      toAmount.value = '0'
      analytics.trackTradeEventError(
        isReviewModalOpen.value
          ? TradeEventError.OFFER_ERROR
          : TradeEventError.PRELIMINARY_ERROR,
        {
          ...getAnalyticsPayload(),
          errorMsg: rawMessage || 'Failed to fetch quote',
        },
      )
      // All three are surfaced to the user above and are pure Sentry noise:
      // transient RPC/WebSocket drops (e.g. the allowance read over
      // wss://nodes.mewapi.io), expected client errors (1inch 4xx, flagged by
      // OneInchFusion.getQuote), and transient axios "Network Error"s, where the
      // 1inch request never completed.
      reportModuleError({
        tag: SENTRY_MODULE_TAGS.TRADE,
        title: 'TRADE: Error fetching quote',
        error: e,
        expected:
          isTransientRpcError(e) ||
          isExpectedClientError(e) ||
          isTransientNetworkError(e),
        extra: { errorMessage: generalError.value },
      })
    }
  }

  const debouncedQuote = useDebounceFn(async (runId: number) => {
    try {
      await runQuote(runId)
    } finally {
      if (runId === quoteRunId) isLoadingQuote.value = false
    }
  }, 500)

  const fetchQuote = () => {
    quoteRunId += 1
    const amount = fromAmount.value
    isLoadingQuote.value = amount !== '' && amount !== '0'
    return debouncedQuote(quoteRunId)
  }

  /**
   * Invalidates any pending or in-flight quote run without starting a new one.
   * The superseded run bails out before touching state, firing analytics, or
   * issuing the network request (when still queued in the debounce).
   */
  const cancelQuote = () => {
    quoteRunId += 1
    isLoadingQuote.value = false
  }

  // The debounce timer survives component teardown; cancelling on scope dispose
  // stops the trailing run from firing a request and analytics after unmount.
  if (getCurrentScope()) {
    onScopeDispose(cancelQuote)
  }

  const resetQuote = () => {
    currentQuote.value = null
    quoteExpiresAt.value = null
    needsApproval.value = false
    isPairUnavailable.value = false
    isBelowMinimum.value = false
    generalError.value = ''
  }

  return {
    currentQuote,
    quoteExpiresAt,
    needsApproval,
    fetchQuote,
    cancelQuote,
    resetQuote,
  }
}
