import { useI18n } from 'vue-i18n'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
import { formatPrice, formatUsd } from '@/modules/perps/utils/formatters'
import { truncateAddress } from '@/utils/filters'

type Side = 'long' | 'short' | 'buy' | 'sell' | (string & {})
type OrderCategory = 'market' | 'limit' | 'stopMarket' | 'takeProfitMarket' | (string & {})
type Translate = ReturnType<typeof useI18n>['t']

function humanSide(side: Side, t: Translate): string {
  const s = (side || '').toLowerCase()
  if (s === 'buy' || s === 'long') return t('perps.trade.long')
  if (s === 'sell' || s === 'short') return t('perps.trade.short')
  return side
}

function humanCategory(category: OrderCategory, t: Translate): string {
  switch ((category || '').toLowerCase()) {
    case 'market':
      return t('perps.trade.market')
    case 'limit':
      return t('perps.trade.limit')
    case 'stopmarket':
      return t('perps.toast.category-stop-market')
    case 'takeprofitmarket':
      return t('perps.toast.category-take-profit-market')
    default:
      return category
  }
}

export type SlTpArgs = {
  direction: Side
  netQuantity: string | number
  base: string
  quote: string
  triggerPrice: string | number
}

export type OrderArgs = {
  side: Side
  size: string | number
  category: OrderCategory
  market: string
  price?: string | number
}

export type FillArgs = {
  side: Side
  filledSize: string | number
  size: string | number
  category: OrderCategory
  market: string
  fillPrice: string | number
}

export function usePerpsToasts() {
  const { t } = useI18n()
  const toastStore = useToastStore()

  const orderLine = (args: OrderArgs): string => {
    const side = humanSide(args.side, t)
    const category = humanCategory(args.category, t)
    const isMarket = (args.category || '').toLowerCase() === 'market'
    if (isMarket || args.price == null || args.price === '') {
      return t('perps.toast.order-line', {
        side,
        size: args.size,
        category,
        market: args.market,
      })
    }
    return t('perps.toast.order-line-with-price', {
      side,
      size: args.size,
      category,
      market: args.market,
      price: formatPrice(args.price),
    })
  }

  const slTpLine = (args: SlTpArgs): string =>
    t('perps.toast.sl-tp-line', {
      side: humanSide(args.direction, t).toUpperCase(),
      netQuantity: args.netQuantity,
      base: args.base,
      quote: args.quote,
      price: formatUsd(args.triggerPrice as string | number),
    })

  const fillLine = (args: FillArgs): string => {
    // Determine the verb from the raw (untranslated) side so this doesn't
    // depend on humanSide's already-localized output matching an English
    // literal in non-English locales.
    const s = (args.side || '').toLowerCase()
    const isLong = s === 'buy' || s === 'long'
    const isShort = s === 'sell' || s === 'short'
    const verb = isLong
      ? t('perps.toast.verb-bought')
      : isShort
        ? t('perps.toast.verb-sold')
        : humanSide(args.side, t)
    return t('perps.toast.fill-line', {
      verb,
      filledSize: args.filledSize,
      size: args.size,
      category: humanCategory(args.category, t),
      market: args.market,
      price: formatPrice(args.fillPrice),
    })
  }

  // --- Deposits & Withdrawals ---
  const toastDepositComplete = (size?: string | number, coin = 'USDC') => {
    toastStore.addToastMessage({
      type: ToastType.Success,
      text: t('perps.toast.deposit-complete-title'),
      textSecondary:
        size != null ? t('perps.toast.deposit-complete-detail', { size, coin }) : undefined,
    })
  }

  const toastWithdrawalComplete = () => {
    toastStore.addToastMessage({
      type: ToastType.Success,
      text: t('perps.toast.withdrawal-complete-title'),
    })
  }

  const toastDepositInitiated = () => {
    toastStore.addToastMessage({
      type: ToastType.Success,
      text: t('perps.toast.deposit-initiated-title'),
    })
  }

  const toastFailedToCreditAccount = () => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: t('perps.toast.failed-to-credit-account-title'),
    })
  }

  const toastDepositCanceled = () => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: t('perps.toast.deposit-canceled-title'),
    })
  }

  const toastFailedToInitiateDeposit = () => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: t('perps.toast.failed-to-initiate-deposit-title'),
    })
  }

  const toastFailedToSwitchNetwork = () => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: t('perps.toast.failed-to-switch-network-title'),
    })
  }

  const toastWithdrawalAddressAdded = (address: string) => {
    toastStore.addToastMessage({
      type: ToastType.Success,
      text: t('perps.toast.withdrawal-address-added-title'),
      textSecondary: t('perps.toast.withdrawal-address-added-detail', {
        address: truncateAddress(address),
      }),
    })
  }

  // --- Liquidation ---
  const toastLiquidationInitiated = () => {
    toastStore.addToastMessage({
      type: ToastType.Warning,
      text: t('perps.toast.liquidation-initiated'),
      textSecondary: t('perps.toast.liquidation-initiated-detail'),
      isInfinite: true,
    })
  }

  // --- Stop Loss & Take Profit ---
  const toastStopLossAdded = (args: SlTpArgs) => {
    toastStore.addToastMessage({
      type: ToastType.Success,
      text: t('perps.toast.stop-loss-added-title'),
      textSecondary: slTpLine(args),
    })
  }

  const toastTakeProfitAdded = (args: SlTpArgs) => {
    toastStore.addToastMessage({
      type: ToastType.Success,
      text: t('perps.toast.take-profit-added-title'),
      textSecondary: slTpLine(args),
    })
  }

  const toastStopLossModified = (args: SlTpArgs) => {
    toastStore.addToastMessage({
      type: ToastType.Success,
      text: t('perps.toast.stop-loss-modified-title'),
      textSecondary: slTpLine(args),
    })
  }

  const toastTakeProfitModified = (args: SlTpArgs) => {
    toastStore.addToastMessage({
      type: ToastType.Success,
      text: t('perps.toast.take-profit-modified-title'),
      textSecondary: slTpLine(args),
    })
  }

  const toastStopLossInvalid = () => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: t('perps.toast.stop-loss-invalid'),
    })
  }

  const toastTakeProfitInvalid = () => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: t('perps.toast.take-profit-invalid'),
    })
  }

  // Spec classifies SL/TP Removed as `failure` type.
  // Kept as ToastType.Error here for spec fidelity; revisit with design
  // if Red UI on a user-initiated remove is wrong.
  const toastStopLossRemoved = (args: SlTpArgs) => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: t('perps.toast.stop-loss-removed-title'),
      textSecondary: slTpLine(args),
    })
  }

  const toastTakeProfitRemoved = (args: SlTpArgs) => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: t('perps.toast.take-profit-removed-title'),
      textSecondary: slTpLine(args),
    })
  }

  const toastFailedToRemoveSlTp = () => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: t('perps.toast.failed-to-remove-sl-tp-title'),
    })
  }

  const toastFailedToRemoveOrder = () => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: t('perps.toast.failed-to-remove-order-title'),
    })
  }

  // --- Orders & Trading (non-TWAP) ---
  // Spec classifies Order Canceled as `failure` type (red).
  // Kept as ToastType.Error for spec fidelity — same precedent as SL/TP Removed.
  const toastOrderCanceled = (args: OrderArgs) => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: t('perps.toast.order-canceled'),
      textSecondary: orderLine(args),
    })
  }

  const toastOrderPlaced = (args: OrderArgs) => {
    toastStore.addToastMessage({
      type: ToastType.Success,
      text: t('perps.toast.order-placed'),
      textSecondary: orderLine(args),
    })
  }

  const toastOrderFilled = (args: FillArgs) => {
    toastStore.addToastMessage({
      type: ToastType.Success,
      text: t('perps.toast.order-filled-title'),
      textSecondary: fillLine(args),
    })
  }

  const toastOrderPartiallyFilled = (args: FillArgs) => {
    toastStore.addToastMessage({
      type: ToastType.Success,
      text: t('perps.toast.order-partially-filled-title'),
      textSecondary: fillLine(args),
    })
  }

  const toastCancelFailedInvalidOrderId = () => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: t('perps.toast.cancel-failed-title'),
      textSecondary: t('perps.toast.cancel-failed-invalid-id'),
    })
  }

  const toastCancelFailed = () => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: t('perps.toast.cancel-failed-title'),
      textSecondary: t('perps.toast.cancel-failed'),
    })
  }

  const toastCancelFailedGeneric = () => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: t('perps.toast.cancel-failed-title'),
      textSecondary: t('perps.toast.cancel-failed-generic'),
    })
  }

  const toastFailedToCloseAllPositions = () => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: t('perps.toast.failed-to-close-all-positions-title'),
    })
  }

  const toastFailedToCancelOrders = () => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: t('perps.toast.failed-to-cancel-orders-title'),
    })
  }

  // --- Leverage ---
  const toastLeverageUpdated = (leverage: number, market: string) => {
    toastStore.addToastMessage({
      type: ToastType.Success,
      text: t('perps.toast.leverage-updated-title'),
      textSecondary: t('perps.toast.leverage-updated-detail', { market, leverage }),
    })
  }

  const toastFailedToSetLeverage = () => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: t('perps.toast.failed-to-set-leverage-title'),
    })
  }

  return {
    // Deposits & Withdrawals
    toastDepositComplete,
    toastWithdrawalComplete,
    toastDepositInitiated,
    toastFailedToCreditAccount,
    toastDepositCanceled,
    toastFailedToInitiateDeposit,
    toastFailedToSwitchNetwork,
    toastWithdrawalAddressAdded,
    // Liquidation
    toastLiquidationInitiated,
    // Stop Loss & Take Profit
    toastStopLossAdded,
    toastTakeProfitAdded,
    toastStopLossModified,
    toastTakeProfitModified,
    toastStopLossInvalid,
    toastTakeProfitInvalid,
    toastStopLossRemoved,
    toastTakeProfitRemoved,
    toastFailedToRemoveSlTp,
    toastFailedToRemoveOrder,
    // Orders & Trading
    toastOrderCanceled,
    toastOrderPlaced,
    toastOrderFilled,
    toastOrderPartiallyFilled,
    toastCancelFailedInvalidOrderId,
    toastCancelFailed,
    toastCancelFailedGeneric,
    toastFailedToCloseAllPositions,
    toastFailedToCancelOrders,
    // Leverage
    toastLeverageUpdated,
    toastFailedToSetLeverage,
  }
}
