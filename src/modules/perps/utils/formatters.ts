import { BigNumber } from 'bignumber.js'
import type { ApiOrder } from '../sdk/types'
/**
 * Common formatting utilities for the perps module.
 */

// Market orders return an empty price from the API; derive it from
// filledCost / filledSize once the order has filled. Stop/take-profit
// orders carry their target in `triggerPrice` and leave `price` empty
// until they trigger.
export function getOrderPrice(order: ApiOrder): string {
  if (
    order.type === 'market' &&
    parseFloat(order.filledSize) > 0 &&
    order.filledCost &&
    !Number.isNaN(Number(order.filledCost)) &&
    !Number.isNaN(Number(order.filledSize))
  ) {
    return new BigNumber(order.filledCost)
      .dividedBy(order.filledSize)
      .toString()
  }
  if (
    (order.type === 'stopMarket' || order.type === 'takeProfitMarket') &&
    order.triggerPrice
  ) {
    return order.triggerPrice
  }
  return order.price
}
export function formatUsd(val: string | number): string {
  const n = typeof val === 'number' ? val : parseFloat(val)
  if (isNaN(n)) return '$0.00'
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// USDC-denominated values (e.g. fees) can be much smaller than $0.01 and would
// round to "$0.00" with the standard 2-decimal USD formatter. Show up to 6
// decimals (USDC's native precision) and suffix with "USDC".
export function formatUsdc(val: string | number): string {
  const n = typeof val === 'number' ? val : parseFloat(val)
  if (isNaN(n)) return '0.00 USDC'
  return `${n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  })} USDC`
}

export function formatPrice(val?: string | number): string {
  if (val === undefined || val === null) return '—'
  const n = typeof val === 'number' ? val : parseFloat(val)
  if (isNaN(n)) return '—'
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatPnl(val: string): string {
  const n = parseFloat(val)
  if (isNaN(n)) return '$0.00'
  const sign = n >= 0 ? '+' : ''
  return `${sign}${formatUsd(val)}`
}

export function formatPercent(val: number): string {
  return `${val >= 0 ? '+' : ''}${val.toFixed(2)}%`
}

export function formatPnlPercent(
  pnl: string | number | undefined,
  margin: string | number | undefined,
): string {
  const m = typeof margin === 'number' ? margin : parseFloat(margin ?? '')
  const p = typeof pnl === 'number' ? pnl : parseFloat(pnl ?? '')
  if (!m || isNaN(p)) return '0.00%'
  if (p === 0) return '0.00%'
  return formatPercent((p / m) * 100)
}

export function formatVolume(vol?: string): string {
  if (!vol) return '—'
  const num = parseFloat(vol)
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
  return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatDate(val: string): string {
  const d = new Date(val)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatRoe(val: string): string {
  const n = parseFloat(val)
  if (isNaN(n)) return '0.00%'
  return formatPercent(n * 100)
}

export function pnlColor(val: string): string {
  const n = parseFloat(val)
  if (n > 0) return 'text-success'
  if (n < 0) return 'text-error'
  return 'text-fg-subtle'
}

export function marginRatioColor(val: string): string {
  const n = new BigNumber(val)
  const minthreshold = new BigNumber(0.9) // example threshold, adjust as needed
  const maxThreshold = new BigNumber(0.95) // example threshold, adjust as needed

  if (n.lt(minthreshold)) return 'text-fg'
  if (n.lt(maxThreshold)) return 'text-warning'
  return 'text-error'
}

export function formatContractPrice(contract: {
  bid?: string
  ask?: string
  indexPrice?: string
}): string {
  const bid = parseFloat(contract.bid ?? '')
  const ask = parseFloat(contract.ask ?? '')
  if (!isNaN(bid) && !isNaN(ask)) return formatUsd((bid + ask) / 2)
  if (contract.indexPrice) return formatUsd(parseFloat(contract.indexPrice))
  return '—'
}

export function formatPriceChange(pct?: string): string {
  if (!pct) return '0.00%'
  const num = parseFloat(pct)
  return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`
}

// Count decimal places from a numeric string. Used to validate user input
// against per-market increments (quoteIncrement / baseIncrement) where the
// API rejects values with more precision than the increment allows.
export function decimalPlaces(value: string | number): number {
  const s = String(value)
  const dot = s.indexOf('.')
  return dot < 0 ? 0 : s.length - dot - 1
}

// Returns true when `value` is non-numeric or carries more decimal places
// than `maxDecimals` permits. Empty input is treated as not-yet-invalid so
// the error doesn't flash on a fresh field.
//
// Accepts string or number because Vue 3's v-model on `<input type="number">`
// auto-coerces to number (overriding string refs), while limit-price uses a
// `type="text"` input that stays a string.
export function hasInvalidPrecision(
  value: string | number,
  maxDecimals: number,
): boolean {
  if (value === '' || value === null || value === undefined) return false
  const s = String(value)
  if (!/^-?\d*\.?\d*$/.test(s)) return true
  if (Number.isNaN(Number(s))) return true
  return decimalPlaces(s) > maxDecimals
}

// Values are i18n keys (not raw English) so call sites resolve them via
// `$t(...)`. For an unmapped status the function returns the raw status
// string itself (not a key); `$t()` returns its argument verbatim when the
// key is missing, so the raw enum still renders unchanged at the call site.
export const orderStatusLabels: Record<string, string> = {
  open: 'perps.order-status.open',
  fullyfilled: 'perps.order-status.fully-filled',
  canceled: 'perps.order-status.canceled',
  pending: 'perps.order-status.pending',
  untriggered: 'perps.order-status.untriggered',
}
export const formatOrderStatus = (status: string): string => {
  return orderStatusLabels[status] ?? status
}

// See orderStatusLabels above re: i18n keys + raw-enum fallback.
export const orderTypeLabels: Record<string, string> = {
  limit: 'perps.order-type.limit',
  market: 'perps.order-type.market',
  stopMarket: 'perps.order-type.stop-loss',
  takeProfitMarket: 'perps.order-type.take-profit',
}

export const formatOrderType = (type: string): string => {
  return orderTypeLabels[type] ?? type
}

// Values are i18n keys (not raw English) so call sites resolve them via
// `$t(...)`. Maps the API's camelCase fill directions to kebab-case keys under
// `perps.fill.direction`. See orderStatusLabels above re: raw-enum fallback.
export const directionLabels: Record<string, string> = {
  openLong: 'perps.fill.direction.open-long',
  openShort: 'perps.fill.direction.open-short',
  closeLong: 'perps.fill.direction.close-long',
  closeShort: 'perps.fill.direction.close-short',
  flipLongToShort: 'perps.fill.direction.flip-long-to-short',
  flipShortToLong: 'perps.fill.direction.flip-short-to-long',
}

// Returns the i18n key for a fill direction. Unknown directions fall back to
// the raw value ($t renders it verbatim); undefined/empty returns '' so the
// call site renders nothing rather than a missing-key warning.
export const directionKey = (direction: string | undefined): string => {
  if (!direction) return ''
  return directionLabels[direction] ?? direction
}

// Withdrawal status is a WITHDRAWAL_* enum (see WalletWithdrawal in sdk/types).
// The label is localized via perps.positions.dw-status.* (PerpsPositionsTable's
// statusKey); this maps a status to its display color only.
export const withdrawalStatusColor = (status: string): string => {
  switch (status) {
    case 'WITHDRAWAL_SUCCESS':
      return 'text-success'
    case 'WITHDRAWAL_PENDING':
      return 'text-warning'
    case 'WITHDRAWAL_FAILURE':
      return 'text-error'
    default:
      // WITHDRAWAL_CANCELLED / WITHDRAWAL_UNKNOWN / anything unmapped
      return 'text-fg-subtle'
  }
}
