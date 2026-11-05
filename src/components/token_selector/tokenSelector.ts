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

/** Trade buy cards, Figma 12526:110434 order, as plain tickers. */
const STOCK_QUICK_PICKS = ['AAPL', 'NVDA', 'ADBE', 'META']

// First enabled item per symbol, in `symbols` order.
const pickBySymbols = <T>(
  items: TokenSelectorItem<T>[],
  symbols: string[],
  symbolOf: (item: TokenSelectorItem<T>) => string,
): TokenSelectorItem<T>[] => {
  const picks: TokenSelectorItem<T>[] = []
  for (const symbol of new Set(symbols)) {
    const match = items.find(
      item => !item.disabled && symbolOf(item) === symbol,
    )
    if (match) picks.push(match)
  }
  return picks
}

/**
 * Up to four quick-pick cards: USDC, WBTC, the chain's native token and USDT,
 * whichever of them the list has (first enabled match per symbol).
 */
export const pickQuickPicks = <T>(
  items: TokenSelectorItem<T>[],
  nativeSymbol: string,
): TokenSelectorItem<T>[] =>
  pickBySymbols(items, quickPickSymbols(nativeSymbol.toUpperCase()), item =>
    item.symbol.toUpperCase(),
  )

/**
 * Trade's stock cards: AAPL, NVDA, ADBE and META, matched on the ticker with or
 * without the Ondo "on" suffix (AAPLon), whichever of them the list has.
 */
export const pickStockQuickPicks = <T>(
  items: TokenSelectorItem<T>[],
): TokenSelectorItem<T>[] =>
  pickBySymbols(items, STOCK_QUICK_PICKS, item =>
    item.symbol.toUpperCase().replace(/ON$/, ''),
  )

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

/**
 * For an AppModal whose content starts with a searchbar: the header hands 6px
 * of its bottom padding (and min height) to the body, so the search's 6px focus
 * ring isn't clipped by the scrolling body while the title and the field stay
 * where Figma puts them (title at 29, field at 80).
 */
export const MODAL_HEADER_CLASS =
  '[&>header]:min-h-[74px] [&>header]:pb-2.5 sm:[&>header]:pb-[18px]'
