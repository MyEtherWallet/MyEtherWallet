import type { CellRightAccessory } from '@/components/cell/cellSizes'
import type { TokenSelectorItem } from './types'

/**
 * Right column of a token row (MEW-2554): the holding when there is one,
 * otherwise the price with its 24h change when the data carries it. Values come
 * in already formatted, since each flow formats fiat its own way.
 */
export const tokenRowAccessory = ({
  balanceFiat,
  balance,
  price,
  change,
}: {
  balanceFiat?: string
  balance?: string
  price?: string
  change?: number
}): CellRightAccessory | undefined => {
  if (balanceFiat)
    return { kind: 'balance', primary: balanceFiat, secondary: balance }
  if (!price) return undefined
  return change === undefined || Number.isNaN(change)
    ? { kind: 'balance', primary: price }
    : { kind: 'balance-performance', primary: price, change }
}

/** Figma 12526:110349 order; the native token takes the third card. */
const quickPickSymbols = (nativeSymbol: string) => [
  'USDC',
  'WBTC',
  nativeSymbol,
  'USDT',
]

/**
 * Up to four quick-pick cards: USDC, WBTC, the chain's native token and USDT,
 * whichever of them the list has (first enabled match per symbol).
 */
export const pickQuickPicks = <T>(
  items: TokenSelectorItem<T>[],
  nativeSymbol: string,
): TokenSelectorItem<T>[] => {
  const picks: TokenSelectorItem<T>[] = []
  for (const symbol of new Set(quickPickSymbols(nativeSymbol.toUpperCase()))) {
    const match = items.find(
      item => !item.disabled && item.symbol.toUpperCase() === symbol,
    )
    if (match) picks.push(match)
  }
  return picks
}

/**
 * "Recently viewed" rows: for each stored id in order, the first enabled item
 * `matches` accepts, without repeats, up to `limit`. Each flow stores its own
 * kind of id, hence the callback.
 */
export const pickRecentItems = <T>(
  items: TokenSelectorItem<T>[],
  recentIds: string[],
  matches: (item: TokenSelectorItem<T>, id: string) => boolean,
  limit = 6,
): TokenSelectorItem<T>[] => {
  const picks = new Map<string, TokenSelectorItem<T>>()
  for (const id of recentIds) {
    if (picks.size >= limit) break
    const match = items.find(item => !item.disabled && matches(item, id))
    if (match) picks.set(match.id, match)
  }
  return [...picks.values()]
}
