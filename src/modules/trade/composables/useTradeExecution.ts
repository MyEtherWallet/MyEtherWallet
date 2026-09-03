import { storeToRefs } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { parseUnits, formatUnits } from 'viem'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import { isExpectedClientError } from '@/modules/trade/common/expectedTradeError'
import { useToastStore } from '@/stores/toastStore'
import { useTradeOrdersStore } from '@/stores/tradeOrdersStore'
import { ToastType } from '@/types/notification'
import { SENTRY_MODULE_TAGS } from '@/sentry/constants'
import {
  analytics,
  TradeEvent,
  TradeEventError,
  TradeEventStatus,
  type TradePayloadShared,
} from '@/analytics'
import Configs from '@/configs'
import { useRewardsStore } from '@/stores/rewardsStore'
import { useHoldingsStore } from '@/stores/holdingsStore'
import {
  isInsufficientFundsError,
  isUserRejectionError,
} from '@/utils/walletUtils'
import { reportModuleError } from '@/utils/reportModuleError'
import BigNumber from 'bignumber.js'
import type { WalletInterface } from '@/providers/common/walletInterface'
import type { TradeForm } from './useTradeForm'

const isDevMode = Configs.IS_DEV_MODE

export type TradeFlowStep =
  | 'idle'
  | 'approvalIntro'
  | 'approving'
  | 'review'
  | 'processing'

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) return error.message
  if (typeof error === 'string') return error
  if (error && typeof error === 'object') {
    if ('message' in error && typeof error.message === 'string')
      return error.message
    if ('details' in error && typeof error.details === 'string')
      return error.details
  }
  return fallback
}

interface QuoteData {
  startAmount: bigint
  endAmount?: bigint
  avgAmount?: bigint
}

interface UseTradeExecutionOptions {
  form: TradeForm
  walletAddress: Ref<string | null | undefined>
  wallet: Ref<WalletInterface | null>
  currentQuote: Ref<QuoteData | null>
  needsApproval: Ref<boolean>
  /**
   * Regional block. Guarded in each action as well as in the UI because the
   * store's flag starts `false` and is only corrected once the async geo check
   * resolves — until then the panel is live for a restricted user, and the
   * blocked styling that would stop the clicks is not applied yet.
   *
   * Only for gates with no on-chain consequence; anything that signs or submits
   * uses `isTradingAllowedInRegion`, since this flag reads "allowed" during that
   * same unresolved window.
   */
  isTradingRestrictedInRegion: Ref<boolean>
  /**
   * Regional eligibility resolved AND allowed — see the store. This is what
   * gates approvals and order submission, so an unresolved check blocks rather
   * than passes.
   */
  isTradingAllowedInRegion: Ref<boolean>
}

export function useTradeExecution(options: UseTradeExecutionOptions) {
  const {
    form,
    walletAddress,
    wallet,
    currentQuote,
    needsApproval,
    isTradingRestrictedInRegion,
    isTradingAllowedInRegion,
  } = options
  const { fromTokenSelected, toTokenSelected, fromAmount, selectedFromChain } =
    form

  const { t } = useI18n()
  const toastStore = useToastStore()
  const tradeOrdersStore = useTradeOrdersStore()
  const rewardsStore = useRewardsStore()
  const holdingsStore = useHoldingsStore()

  const { minSpendTrade } = storeToRefs(rewardsStore)

  const tradeFlowStep = ref<TradeFlowStep>('idle')
  // Reads the step through a call boundary so TS does not narrow it across
  // awaits — the modals mutate it concurrently while these functions run.
  const stepIs = (step: TradeFlowStep) => tradeFlowStep.value === step
  const isApproving = computed(() => tradeFlowStep.value === 'approving')
  const txProceeding = ref(false)
  const orderHash = ref<string>('')

  // USD value of the to-side quote (endAmount is in base units)
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

  // Hold-campaign context attached to trade status events
  const getRewardFields = () => {
    const reward = holdingsStore.activeReward
    const meta = reward
      ? holdingsStore.info?.metas?.find(m => m.id === reward.id)
      : undefined
    const decimals = meta?.crypto?.decimals?.[0] ?? 18
    return {
      holdCampaignStatus: holdingsStore.status,
      qualifyingTradeAmount: reward?.qualifying_amount
        ? new BigNumber(reward.qualifying_amount)
            .shiftedBy(-decimals)
            .toString()
        : undefined,
      qualifyingTradeToken: meta?.symbol,
      qualifiedSince: reward?.qualification_timestamp,
    }
  }
  let approvalInFlight = false

  const approveFromToken = async (): Promise<boolean> => {
    // Resolved-and-allowed, not merely "not known to be restricted": this sends
    // an on-chain approval, so an unresolved geo check must block it.
    if (!isTradingAllowedInRegion.value) return false
    if (!fromTokenSelected.value || !walletAddress.value || !wallet.value) {
      return false
    }
    // A second click while the first approval still awaits the wallet only
    // reattaches the waiting modal — the in-flight call owns the continuation.
    if (approvalInFlight) {
      tradeFlowStep.value = 'approving'
      return false
    }
    const analyticsPayload = getAnalyticsPayload()
    analytics.trackTradeEvent(TradeEvent.CLICK_APPROVE, analyticsPayload)

    approvalInFlight = true
    tradeFlowStep.value = 'approving'

    try {
      const { default: OneInchFusion } =
        await import('../providers/oneinch_fusion/oneInchFusion')

      const chainId = parseInt(selectedFromChain.value?.chainID || '1')
      const fusion = new OneInchFusion(wallet.value, chainId)

      await fusion.setApproval(
        walletAddress.value,
        fromTokenSelected.value.address,
      )

      needsApproval.value = false
      return true
    } catch (e) {
      tradeFlowStep.value = 'idle'
      // Before the rejection check: wallets that tag this as code 4001 would
      // otherwise be reported as the user declining.
      if (isInsufficientFundsError(e)) {
        toastStore.addToastMessage({
          text: t('common.not_enough_balance_to_cover_fee', {
            symbol: selectedFromChain.value?.currencyName,
          }),
          type: ToastType.Error,
        })
        analytics.trackTradeEventError(TradeEventError.APPROVAL_ERROR, {
          ...getAnalyticsPayload(),
          errorMsg: 'insufficient_funds_for_gas',
        })
        return false
      }
      if (isUserRejectionError(e)) {
        toastStore.addToastMessage({
          text: t('common.error.user_canceled_request'),
          type: ToastType.Info,
        })
        analytics.trackTradeEventError(TradeEventError.APPROVAL_ERROR, {
          ...getAnalyticsPayload(),
          errorMsg: 'declined_by_user',
        })
        return false
      }

      const errorMessage = getErrorMessage(
        e,
        t('trade.error.approval-failed'),
      ).toLowerCase()

      analytics.trackTradeEventError(TradeEventError.APPROVAL_ERROR, {
        ...getAnalyticsPayload(),
        errorMsg: errorMessage,
      })
      reportModuleError({
        tag: SENTRY_MODULE_TAGS.TRADE,
        title: 'TRADE: Error approving token',
        error: e instanceof Error ? e : new Error(errorMessage),
        extra: { errorMessage },
      })

      toastStore.addToastMessage({
        text: t('trade.error.approval-failed'),
        textSecondary: errorMessage,
        type: ToastType.Error,
      })
      return false
    } finally {
      approvalInFlight = false
    }
  }

  const startTradeFlow = async () => {
    if (tradeFlowStep.value !== 'idle') return
    if (isTradingRestrictedInRegion.value) return
    if (!currentQuote.value) {
      toastStore.addToastMessage({
        text: t('trade.toast.quote-loading'),
      })
      return
    }
    analytics.trackTradeEvent(TradeEvent.CLICK_TRADE, getAnalyticsPayload())

    if (needsApproval.value) {
      tradeFlowStep.value = 'approvalIntro'
      return
    }

    tradeFlowStep.value = 'review'
    analytics.trackTradeEvent(TradeEvent.OFFER_SHOWN, getAnalyticsPayload())
  }

  const confirmApproval = async () => {
    if (tradeFlowStep.value !== 'approvalIntro') return
    const approved = await approveFromToken()
    const dismissedWhileApproving = !isApproving.value
    if (!approved || dismissedWhileApproving) return

    tradeFlowStep.value = 'review'
    analytics.trackTradeEvent(TradeEvent.OFFER_SHOWN, getAnalyticsPayload())
  }

  const confirmTrade = async () => {
    // Last line of defence before an order is signed and submitted. Requires the
    // geo check to have resolved as allowed — an unresolved check is not consent.
    // Also closes the modal: if the check resolved against the user while it was
    // already open, leaving it up would give them a Confirm button that silently
    // does nothing.
    if (!isTradingAllowedInRegion.value) {
      tradeFlowStep.value = 'idle'
      return
    }
    if (!fromTokenSelected.value || !toTokenSelected.value || !wallet.value) {
      return
    }

    txProceeding.value = true
    const analyticsPayload = getAnalyticsPayload()
    analytics.trackTradeEvent(TradeEvent.OFFER_PROCEED, analyticsPayload)
    // Cleared before the step change: the progress modal resolves its state by
    // hash, and a stale hash from a previous order would flash that order's
    // final state while the new one is being signed.
    orderHash.value = ''
    tradeFlowStep.value = 'processing'

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

      // Rechecked here because the guard above ran before an await (the dynamic
      // import), and the geo check can land against the user in that gap. This is
      // the last point at which nothing has been signed yet.
      if (!isTradingAllowedInRegion.value) {
        tradeFlowStep.value = 'idle'
        return
      }

      const result = await fusion.submitOrder({
        fromTokenAddress: fromTokenSelected.value.address,
        toTokenAddress: toTokenSelected.value.address,
        amount: amountInBaseUnits,
        fromAddress: walletAddress.value!,
        fromTokenDecimals: fromTokenSelected.value.decimals || 18,
        toTokenDecimals: toTokenSelected.value.decimals || 18,
      })

      orderHash.value = result.hash

      let canEarnReward: undefined | boolean = undefined
      const fromUsdValue =
        parseFloat(fromAmount.value) * (fromTokenSelected.value?.price || 0)
      const minSpendBN = BigNumber(minSpendTrade.value)
      const minimumSpend = minSpendBN.isNaN() ? BigNumber(0) : minSpendBN
      if (BigNumber(fromUsdValue).gt(minimumSpend)) {
        const canEarn =
          await rewardsStore.checkAvailabilityAfterTransaction('trade')
        canEarnReward = canEarn ? true : undefined
      }
      analytics.trackTradeEventStatus(TradeEventStatus.INITIATED, {
        ...analyticsPayload,
        canEarnReward,
        orderHash: result.hash,
        ...getRewardFields(),
      })

      // Add order to store
      const toDecimals = toTokenSelected.value.decimals || 18
      const expectedToAmount = formatFloatingPointValue(
        formatUnits(
          currentQuote.value?.avgAmount ||
            currentQuote.value?.startAmount ||
            0n,
          toDecimals,
        ),
      ).value

      tradeOrdersStore.addOrder({
        hash: result.hash,
        status: 'pending',
        fromAmount: fromAmount.value,
        fromSymbol: fromTokenSelected.value.symbol,
        fromDecimals: fromTokenSelected.value.decimals || 18,
        fromTokenIcon: fromTokenSelected.value.logoURI,
        expectedToAmount,
        toSymbol: toTokenSelected.value.symbol,
        toDecimals: toTokenSelected.value.decimals || 18,
        toTokenIcon: toTokenSelected.value.logoURI,
        createdAt: Math.floor(Date.now() / 1000),
        duration: 180,
        fills: [],
        usdValue: fromTokenSelected.value.price
          ? (
              parseFloat(fromAmount.value) * fromTokenSelected.value.price
            ).toFixed(2)
          : undefined,
        toUsdValue: toTokenSelected.value.price
          ? (
              parseFloat(expectedToAmount) * toTokenSelected.value.price
            ).toFixed(2)
          : undefined,
        chainId,
        fromAddress: walletAddress.value!,
        seen: false,
        chainName: selectedFromChain.value?.name || 'ETHEREUM',
        fromTokenAddress: fromTokenSelected.value.address,
        toTokenAddress: toTokenSelected.value.address,
      })

      // The user closed the progress modal while the wallet was still signing:
      // the close handler ran before the hash existed, so the background toast
      // it would have shown is fired here instead.
      if (stepIs('idle')) {
        toastStore.addToastMessage({
          id: `trade-processing-${result.hash}`,
          variant: 'dark',
          text: t('trade.toast.processing_trade'),
          textSecondary: t('trade.toast.processing_note'),
          isInfinite: true,
          tradeStatus: { kind: 'processing' },
        })
      }
    } catch (e) {
      // Reopen the review modal only if the user is still in the flow — an
      // early close of the progress modal must not resurrect it over a form
      // that clearValues already reset.
      if (stepIs('processing')) {
        tradeFlowStep.value = 'review'
      }
      if (isUserRejectionError(e)) {
        analytics.trackTradeEventError(TradeEventError.SIGN_ERROR, {
          ...analyticsPayload,
          errorMsg: 'declined_by_user',
        })
        toastStore.addToastMessage({
          text: t('common.error.user_canceled_request'),
          type: ToastType.Info,
        })
        return
      }

      const errorMessage = getErrorMessage(
        e,
        t('trade.error.submit-failed'),
      ).toLowerCase()

      reportModuleError({
        tag: SENTRY_MODULE_TAGS.TRADE,
        title: 'TRADE: Error submitting trade order',
        error: e instanceof Error ? e : new Error(errorMessage),
        expected: isExpectedClientError(e),
        extra: { errorMessage },
      })
      if (!isDevMode) {
        analytics.trackTradeEventError(TradeEventError.SIGN_ERROR, {
          ...analyticsPayload,
          errorMsg: errorMessage,
        })
      }

      toastStore.addToastMessage({
        text: t('trade.error.submit-failed'),
        textSecondary: errorMessage,
        type: ToastType.Error,
      })
    } finally {
      txProceeding.value = false
    }
  }

  return {
    tradeFlowStep,
    isApproving,
    txProceeding,
    orderHash,
    startTradeFlow,
    confirmApproval,
    confirmTrade,
  }
}
