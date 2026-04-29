import { BigNumber } from 'bignumber.js'
/**
 * Common formatting utilities for the perps module.
 */
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
  return 'text-info'
}

export function marginRatioColor(val: string): string {
  const n = new BigNumber(val)
  const minthreshold = new BigNumber(0.9) // example threshold, adjust as needed
  const maxThreshold = new BigNumber(0.95) // example threshold, adjust as needed

  if (n.lt(minthreshold)) return 'text-black'
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
