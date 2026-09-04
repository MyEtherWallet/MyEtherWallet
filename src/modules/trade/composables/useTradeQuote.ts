import { ref, type Ref, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDebounceFn } from '@vueuse/core'
import { parseUnits, formatUnits } from 'viem'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import { SENTRY_MODULE_TAGS } from '@/sentry/constants'
import {
  analytics,
  TradeEvent,
  TradeEventError,
  type TradePayloadShared,
} from '@/analytics'
import { isTransientRpcError } from '@/modules/trade/common/transientRpcError'
import {
  isExpectedClientError,
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
  /**
   * Whether the review modal is currently open. `fetchQuote` doubles as the
   * refresh triggered by that modal's `expired` event, so a failure while it
   * is up is an offer-stage error, not the sidebar's preliminary one — same
   * distinction swap draws with `bestSwapLoadingOpen`.
   */
  isReviewModalOpen: Ref<boolean>
  /**
   * Whether the market status is reporting a session whose boundary has already
   * passed. A function because it depends on the clock: it has to be answered at
   * the moment a quote fails, not when a dependency last changed.
   */
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

  const runQuote = async () => {
    // Cleared ahead of the guards below, not just on the path that quotes: the
    // flag describes the last attempt, and every exit from here either makes a
    // new attempt or abandons the one it described. Leaving it set outlived the
    // pair it was about — the market closing mid-session stranded the notice on
    // screen next to a "Market paused" button.
    isPairUnavailable.value = false

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

    generalError.value = ''
    isPairUnavailable.value = false

    try {
      const { default: OneInchFusion } =
        await import('../providers/oneinch_fusion/oneInchFusion')

      const chainId = parseInt(selectedFromChain.value?.chainID || '1')
      const fusion = new OneInchFusion(wallet.value, chainId)

      const decimals = fromTokenSelected.value.decimals || 18
      const amountInBaseUnits = parseUnits(
        fromAmount.value,
        decimals,
      ).toString()

      const quote = await fusion.getQuote({
        fromTokenAddress: fromTokenSelected.value.address,
        toTokenAddress: toTokenSelected.value.address,
        amount: amountInBaseUnits,
        fromAddress: walletAddress.value,
        fromTokenDecimals: fromTokenSelected.value.decimals || 18,
        toTokenDecimals: toTokenSelected.value.decimals || 18,
      })

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
      const toDecimals = toTokenSelected.value.decimals || 18
      toAmount.value = formatFloatingPointValue(
        formatUnits(quote.avgAmount || quote.startAmount, toDecimals),
      ).value

      // Mirrors swap's PRELIMINARY_SHOWN: only for the sidebar's own quote,
      // not the silent refresh the review modal triggers on expiry.
      if (!isReviewModalOpen.value) {
        analytics.trackTradeEvent(TradeEvent.PRELIMINARY_SHOWN, {
          ...getAnalyticsPayload(),
        })
      }

      // Check if approval is required
      const approvalRequired = await fusion.isApprovalRequired(
        walletAddress.value,
        fromTokenSelected.value.address,
        BigInt(amountInBaseUnits),
      )
      needsApproval.value = approvalRequired
    } catch (e) {
      const rawMessage =
        e instanceof Error ? e.message : typeof e === 'string' ? e : undefined
      // Only blame the pair while the market state is settled. Between sessions
      // the upstream snapshot still reports the one that just ended, so we quote
      // into a closed market and every pair 4xxs — claiming the pair is
      // unavailable then is both wrong and indistinguishable from the real
      // thing. Left unclaimed it falls through to the transient error below,
      // and the next status refresh renders the paused state instead.
      isPairUnavailable.value =
        !!(e as { expectedClientError?: boolean }).expectedClientError &&
        !hasStaleMarketStatus()
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

  let quoteRunId = 0

  const debouncedQuote = useDebounceFn(async () => {
    const runId = quoteRunId
    try {
      await runQuote()
    } finally {
      if (runId === quoteRunId) isLoadingQuote.value = false
    }
  }, 500)

  const fetchQuote = () => {
    quoteRunId += 1
    const amount = fromAmount.value
    isLoadingQuote.value = amount !== '' && amount !== '0'
    return debouncedQuote()
  }

  const resetQuote = () => {
    currentQuote.value = null
    quoteExpiresAt.value = null
    needsApproval.value = false
    isPairUnavailable.value = false
  }

  return {
    currentQuote,
    quoteExpiresAt,
    needsApproval,
    fetchQuote,
    resetQuote,
  }
}
