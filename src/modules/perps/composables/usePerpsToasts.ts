import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
import { formatPrice, formatUsd } from '@/modules/perps/utils/formatters'

type Side = 'long' | 'short' | 'buy' | 'sell' | (string & {})
type OrderCategory = 'market' | 'limit' | 'stopMarket' | 'takeProfitMarket' | (string & {})

function humanSide(side: Side): string {
  const s = (side || '').toLowerCase()
  if (s === 'buy' || s === 'long') return 'Long'
  if (s === 'sell' || s === 'short') return 'Short'
  return side
}

function humanCategory(category: OrderCategory): string {
  switch ((category || '').toLowerCase()) {
    case 'market':
      return 'Market'
    case 'limit':
      return 'Limit'
    case 'stopmarket':
      return 'Stop Market'
    case 'takeprofitmarket':
      return 'Take Profit Market'
    default:
      return category
  }
}

function orderLine(args: {
  side: Side
  size: string | number
  category: OrderCategory
  market: string
  price?: string | number
}): string {
  const base = `${humanSide(args.side)} ${args.size} ${humanCategory(args.category)}: ${args.market}`
  const isMarket = (args.category || '').toLowerCase() === 'market'
  if (isMarket || args.price == null || args.price === '') return base
  return `${base} at ${formatPrice(args.price)}`
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
  const toastStore = useToastStore()

  // --- Deposits & Withdrawals ---
  const toastDepositComplete = (size?: string | number, coin = 'USDC') => {
    toastStore.addToastMessage({
      type: ToastType.Success,
      text: 'Deposit Complete',
      textSecondary:
        size != null ? `${size} ${coin} added to your Trading Account` : undefined,
    })
  }

  const toastWithdrawalComplete = () => {
    toastStore.addToastMessage({
      type: ToastType.Success,
      text: 'Withdrawal Complete',
    })
  }

  const toastDepositInitiated = () => {
    toastStore.addToastMessage({
      type: ToastType.Success,
      text: 'Deposit Initiated',
    })
  }

  const toastFailedToCreditAccount = () => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: 'Failed to Credit Account',
    })
  }

  const toastDepositCanceled = () => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: 'Deposit Canceled',
    })
  }

  const toastFailedToInitiateDeposit = () => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: 'Failed to Initiate Deposit',
    })
  }

  const toastFailedToSwitchNetwork = () => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: 'Failed to Switch Network',
    })
  }

  // --- Liquidation ---
  const toastLiquidationInitiated = () => {
    toastStore.addToastMessage({
      type: ToastType.Warning,
      text: 'Liquidation Initiated',
      textSecondary:
        'Your account is temporarily locked and your open positions are being sold',
      isInfinite: true,
    })
  }

  // --- Stop Loss & Take Profit ---
  const slTpLine = (args: SlTpArgs) =>
    `${humanSide(args.direction).toUpperCase()} ${args.netQuantity} PERPS: ${args.base}${args.quote} at ${formatUsd(args.triggerPrice as string | number)}`

  const toastStopLossAdded = (args: SlTpArgs) => {
    toastStore.addToastMessage({
      type: ToastType.Success,
      text: 'Stop Loss Added',
      textSecondary: slTpLine(args),
    })
  }

  const toastTakeProfitAdded = (args: SlTpArgs) => {
    toastStore.addToastMessage({
      type: ToastType.Success,
      text: 'Take Profit Added',
      textSecondary: slTpLine(args),
    })
  }

  const toastStopLossModified = (args: SlTpArgs) => {
    toastStore.addToastMessage({
      type: ToastType.Success,
      text: 'Stop Loss Modified',
      textSecondary: slTpLine(args),
    })
  }

  const toastTakeProfitModified = (args: SlTpArgs) => {
    toastStore.addToastMessage({
      type: ToastType.Success,
      text: 'Take Profit Modified',
      textSecondary: slTpLine(args),
    })
  }

  const toastStopLossInvalid = () => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: 'Stop Loss Invalid',
    })
  }

  const toastTakeProfitInvalid = () => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: 'Take Profit Invalid',
    })
  }

  // Spec classifies SL/TP Removed as `failure` type.
  // Kept as ToastType.Error here for spec fidelity; revisit with design
  // if Red UI on a user-initiated remove is wrong.
  const toastStopLossRemoved = (args: SlTpArgs) => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: 'Stop Loss Removed',
      textSecondary: slTpLine(args),
    })
  }

  const toastTakeProfitRemoved = (args: SlTpArgs) => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: 'Take Profit Removed',
      textSecondary: slTpLine(args),
    })
  }

  const toastFailedToRemoveSlTp = () => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: 'Failed to Remove Stop Loss / Take Profit',
    })
  }

  const toastFailedToRemoveOrder = () => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: 'Failed to Remove Order',
    })
  }

  // --- Orders & Trading (non-TWAP) ---
  // Spec classifies Order Canceled as `failure` type (red).
  // Kept as ToastType.Error for spec fidelity — same precedent as SL/TP Removed.
  const toastOrderCanceled = (args: OrderArgs) => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: 'Order Canceled',
      textSecondary: orderLine(args),
    })
  }

  const toastOrderPlaced = (args: OrderArgs) => {
    toastStore.addToastMessage({
      type: ToastType.Success,
      text: 'Order Placed',
      textSecondary: orderLine(args),
    })
  }

  const fillLine = (args: FillArgs) => {
    const human = humanSide(args.side)
    const verb =
      human === 'Long' ? 'Bought' : human === 'Short' ? 'Sold' : human
    return `${verb} ${args.filledSize}/${args.size} ${humanCategory(args.category)}: ${args.market} at ${formatPrice(args.fillPrice)}`
  }

  const toastOrderFilled = (args: FillArgs) => {
    toastStore.addToastMessage({
      type: ToastType.Success,
      text: 'Order Filled',
      textSecondary: fillLine(args),
    })
  }

  const toastOrderPartiallyFilled = (args: FillArgs) => {
    toastStore.addToastMessage({
      type: ToastType.Success,
      text: 'Order Partially Filled',
      textSecondary: fillLine(args),
    })
  }

  const toastCancelFailedInvalidOrderId = () => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: 'Cancel Failed',
      textSecondary: 'Invalid order ID',
    })
  }

  const toastCancelFailed = () => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: 'Cancel Failed',
      textSecondary: 'Failed to cancel order',
    })
  }

  const toastCancelFailedGeneric = () => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: 'Cancel Failed',
      textSecondary: 'An error occurred while cancelling the order',
    })
  }

  const toastFailedToCloseAllPositions = () => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: 'Failed to Close All Positions',
    })
  }

  const toastFailedToCancelOrders = () => {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: 'Failed to Cancel Orders',
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
  }
}
