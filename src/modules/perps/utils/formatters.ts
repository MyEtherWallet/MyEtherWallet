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
  const pct = n * 100
  return `${pct >= 0 ? '' : ''}${pct.toFixed(2)}%`
}

export function pnlColor(val: string): string {
  const n = parseFloat(val)
  if (n > 0) return 'text-success'
  if (n < 0) return 'text-error'
  return 'text-info'
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
