import { ref, type Ref, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDebounceFn } from '@vueuse/core'
import { parseUnits, formatUnits } from 'viem'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import { SENTRY_MODULE_TAGS } from '@/sentry/constants'
import {
  analytics,
  TradeEventError,
  type TradePayloadShared,
} from '@/analytics'
import { isTransientRpcError } from '@/modules/trade/common/transientRpcError'
import { reportModuleError } from '@/utils/reportModuleError'
import type { WalletInterface } from '@/providers/common/walletInterface'
import type { TradeForm } from './useTradeForm'

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
  } = options
  const { fromTokenSelected, toTokenSelected, fromAmount, toAmount,
    selectedFromChain, generalError, isLoadingQuote } = form

  const { t } = useI18n()

  const currentQuote = ref<QuoteData | null>(null)
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

  const fetchQuote = useDebounceFn(async () => {
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

    isLoadingQuote.value = true
    generalError.value = ''

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
        analytics.trackTradeEventError(TradeEventError.PRELIMINARY_ERROR, {
          ...getAnalyticsPayload(),
          errorMsg: 'No quotes returned',
        })
        return
      }

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
      const rawMessage =
        e instanceof Error ? e.message : typeof e === 'string' ? e : undefined
      generalError.value = rawMessage || t('trade.error.failed-to-fetch-quote')
      toAmount.value = '0'
      analytics.trackTradeEventError(TradeEventError.PRELIMINARY_ERROR, {
        ...getAnalyticsPayload(),
        errorMsg: rawMessage || 'Failed to fetch quote',
      })
      // All three are surfaced to the user above and are pure Sentry noise:
      // transient RPC/WebSocket drops (e.g. the allowance read over
      // wss://nodes.mewapi.io), expected client errors (1inch 4xx, flagged by
      // OneInchFusion.getQuote), and transient axios "Network Error"s, where the
      // 1inch request never completed.
      const { expectedClientError, transientNetworkError } = e as {
        expectedClientError?: boolean
        transientNetworkError?: boolean
      }
      reportModuleError({
        tag: SENTRY_MODULE_TAGS.TRADE,
        title: 'TRADE: Error fetching quote',
        error: e,
        expected:
          isTransientRpcError(e) ||
          !!expectedClientError ||
          !!transientNetworkError,
        extra: { errorMessage: generalError.value },
      })
    } finally {
      isLoadingQuote.value = false
    }
  }, 500)

  const resetQuote = () => {
    currentQuote.value = null
    needsApproval.value = false
  }

  return {
    currentQuote,
    needsApproval,
    fetchQuote,
    resetQuote,
  }
}
