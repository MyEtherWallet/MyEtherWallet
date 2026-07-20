/**
 * Common market-related helpers for the perps module.
 */
import type { Contract } from '../sdk/types'

export function getLogoUrl(base: string): string {
  return `https://cdn.ondoperps.xyz/symbol-icons/${encodeURIComponent(base)}.svg`
}

export function getBase(market: string): string {
  return market?.split('-')?.[0] ?? market ?? ''
}

export function midPrice(contract: Contract): number {
  const bid = parseFloat(contract.bid ?? '')
  const ask = parseFloat(contract.ask ?? '')
  if (!isNaN(bid) && !isNaN(ask)) return (bid + ask) / 2
  if (contract.indexPrice) return parseFloat(contract.indexPrice)
  return 0
}

export function hasTag(contract: Contract, tag: string): boolean {
  return (
    contract.tags?.some(t => t.toLowerCase() === tag.toLowerCase()) ?? false
  )
}

export function getCategory(contract: Contract): string {
  if (hasTag(contract, 'commodity')) return 'Commodities'
  if (hasTag(contract, 'index')) return 'Indices'
  return 'Equities'
}

// Resolves the price the order will actually fill at, used for sizing the
// base quantity on the trade form. Mirrors how the matching engine treats a
// crossed limit:
//   LONG  (buy):  limit ≥ mark → fills at mark; limit < mark → rests at limit.
//                 Effective price = min(limit, mark).
//   SHORT (sell): limit ≤ mark → fills at mark; limit > mark → rests at limit.
//                 Effective price = max(limit, mark).
// Falls back to currentPrice if not in limit mode or the limit field is
// empty/invalid, and to the limit alone if mark hasn't loaded yet, so the
// displayed size stays defined.
export function resolveEffectivePrice(opts: {
  orderType: 'market' | 'limit'
  orderSide: 'buy' | 'sell'
  limitPrice: string
  currentPrice: number
}): number {
  if (opts.orderType === 'limit') {
    const lp = parseFloat(opts.limitPrice)
    if (!isNaN(lp) && lp > 0) {
      if (opts.currentPrice > 0) {
        return opts.orderSide === 'buy'
          ? Math.min(lp, opts.currentPrice)
          : Math.max(lp, opts.currentPrice)
      }
      return lp
    }
  }
  return opts.currentPrice
}
