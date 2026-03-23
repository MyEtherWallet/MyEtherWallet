/**
 * Common market-related helpers for the perps module.
 */
import type { Contract } from '../sdk/types'

export function getLogoUrl(base: string): string {
  return `https://cdn.ondoperps.xyz/symbol-icons/${encodeURIComponent(base)}.svg`
}

export function getBase(market: string): string {
  return market.split('-')[0] ?? market
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
  if (hasTag(contract, 'etf')) return 'ETFs'
  return 'Equities'
}
