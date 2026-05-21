import { ref, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { parseUnits, formatUnits } from 'viem'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import { useToastStore } from '@/stores/toastStore'
import { useTradeOrdersStore } from '@/stores/tradeOrdersStore'
import { ToastType } from '@/types/notification'
import type { NewTokenInfo } from '@/composables/useSwap'
import type { Chain } from '@/mew_api/types'
import { captureException } from '@sentry/vue'
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
import { isUserRejectionError } from '@/utils/walletUtils'

const isDevMode = Configs.IS_DEV_MODE

interface QuoteData {
  startAmount: bigint
  endAmount?: bigint
  avgAmount?: bigint
}

interface UseTradeExecutionOptions {
  fromTokenSelected: Ref<NewTokenInfo | null>
  toTokenSelected: Ref<NewTokenInfo | null>
  fromAmount: Ref<string>
  walletAddress: Ref<string | null | undefined>
  wallet: Ref<any>
  selectedFromChain: Ref<Chain | undefined>
  currentQuote: Ref<QuoteData | null>
  needsApproval: Ref<boolean>
}

export function useTradeExecution(options: UseTradeExecutionOptions) {
  const {
    fromTokenSelected,
    toTokenSelected,
    fromAmount,
    walletAddress,
    wallet,
    selectedFromChain,
    currentQuote,
    needsApproval,
  } = options

  const { t } = useI18n()
  const toastStore = useToastStore()
  const tradeOrdersStore = useTradeOrdersStore()
  const rewardsStore = useRewardsStore()

  const isApproving = ref(false)
  const txProceeding = ref(false)
  const quoteModalOpen = ref(false)
  const tradeInitiatedOpen = ref(false)
  const orderHash = ref<string>('')

  const getAnalyticsPayload = (): TradePayloadShared => ({
    network: selectedFromChain.value?.name || 'N/A',
    fromToken: fromTokenSelected.value?.symbol || 'N/A',
    fromAmount: fromAmount.value,
    toToken: toTokenSelected.value?.symbol || 'N/A',
    toAmount: currentQuote.value?.endAmount?.toString() || '',
    tradePair: `${fromTokenSelected.value?.symbol || 'N/A'}-${toTokenSelected.value?.symbol || 'N/A'}`,
  })
  const handleApprove = async () => {
    if (!fromTokenSelected.value || !walletAddress.value || !wallet.value) {
      return
    }
    const analyticsPayload = getAnalyticsPayload()
    analytics.trackTradeEvent(TradeEvent.CLICK_APPROVE, analyticsPayload)

    isApproving.value = true

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

      toastStore.addToastMessage({
        text: t('trade.toast.approval-success'),
        textSecondary: t('trade.toast.approval-success-secondary', { symbol: fromTokenSelected.value.symbol }),
        type: ToastType.Success,
      })
    } catch (e) {
      if (isUserRejectionError(e)) {
        toastStore.addToastMessage({
          text: t('common.error.user_canceled_request'),
          type: ToastType.Info,
        })
        analytics.trackTradeEventError(TradeEventError.APPROVAL_ERROR, {
          ...getAnalyticsPayload(),
          errorMsg: 'declined_by_user',
        })
        return
      }

      const errorMessage = (e as any).message
        ? (e as any).message.toLowerCase()
        : (e as any).details
          ? (e as any).details
          : typeof e === 'string'
            ? e
            : t('trade.error.approval-failed')

      analytics.trackTradeEventError(TradeEventError.APPROVAL_ERROR, {
        ...getAnalyticsPayload(),
        errorMsg: errorMessage,
      })
      if (isDevMode) {
        console.error('Error approving token:', e)
      } else {
        captureException(e instanceof Error ? e : new Error(errorMessage), {
          ...SENTRY_MODULE_TAGS.TRADE,
          extra: {
            title: 'TRADE: Error approving token',
            errorMessage,
          },
        })
      }

      toastStore.addToastMessage({
        text: t('trade.error.approval-failed'),
        textSecondary: errorMessage,
        type: ToastType.Error,
      })
    } finally {
      isApproving.value = false
    }
  }

  const openTradeModal = () => {
    if (!currentQuote.value) {
      toastStore.addToastMessage({
        text: t('trade.toast.quote-loading'),
      })
      return
    }
    analytics.trackTradeEvent(TradeEvent.CLICK_TRADE, getAnalyticsPayload())
    quoteModalOpen.value = true
    analytics.trackTradeEvent(TradeEvent.OFFER_SHOWN, getAnalyticsPayload())
  }

  const confirmTrade = async () => {
    if (!fromTokenSelected.value || !toTokenSelected.value || !wallet.value) {
      return
    }

    txProceeding.value = true
    const analyticsPayload = getAnalyticsPayload()
    analytics.trackTradeEvent(TradeEvent.OFFER_PROCEED, analyticsPayload)

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
      let canEarnReward: undefined | boolean = undefined
      const fromUsdValue =
        parseFloat(fromAmount.value) * (fromTokenSelected.value?.price || 0)
      if (fromUsdValue > 50) {
        const canEarn = await rewardsStore.checkAvailabilityAfterTransaction()
        canEarnReward = canEarn ? true : undefined
      }
      analytics.trackTradeEventStatus(TradeEventStatus.INITIATED, {
        ...analyticsPayload,
        canEarnReward,
        orderHash: result.hash,
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
        chainId,
        fromAddress: walletAddress.value!,
        seen: false,
        chainName: selectedFromChain.value?.name || 'ETHEREUM',
        fromTokenAddress: fromTokenSelected.value.address,
        toTokenAddress: toTokenSelected.value.address,
      })
    } catch (e) {
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

      const errorMessage = (e as any).message
        ? (e as any).message.toLowerCase()
        : (e as any).details
          ? (e as any).details
          : typeof e === 'string'
            ? e
            : t('trade.error.submit-failed')

      if (isDevMode) {
        console.error('Error submitting trade order:', e)
      } else {
        captureException(e instanceof Error ? e : new Error(errorMessage), {
          ...SENTRY_MODULE_TAGS.TRADE,
          extra: {
            title: 'TRADE: Error submitting trade order',
            errorMessage,
          },
        })
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
    isApproving,
    txProceeding,
    quoteModalOpen,
    tradeInitiatedOpen,
    orderHash,
    handleApprove,
    openTradeModal,
    confirmTrade,
  }
}
