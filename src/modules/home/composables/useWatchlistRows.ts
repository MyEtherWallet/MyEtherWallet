import { computed, ref, type Ref, type ComputedRef } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useWatchlistStore } from '@/stores/watchlistTableStore'
import { useFetchWatchlist } from '@/composables/useFetchWatchlist'
import { useCurrency } from '@/composables/useCurrency'
import { usePerpsContracts } from '@/modules/perps/composables/usePerpsMarkets'
import { getLogoUrl } from '@/modules/perps/utils/market'
import type { Contract } from '@/modules/perps/sdk/types'
import type {
  GetWebTokensWatchlistResponseToken,
  GetWebStocksWatchlistResponseStock,
} from '@/mew_api/types'
import {
  TOKEN_INFO_ROUTE_NAMES,
  STOCK_INFO_ROUTE_NAMES,
  PERP_INFO_ROUTE_NAME,
} from '@/router/routeNames'

export type WatchlistRowType = 'crypto' | 'stock' | 'perp'

export interface WatchlistRow {
  key: string
  logoUrl?: string
  symbol: string
  name: string
  isStock: boolean
  priceDisplay: string
  /** 24h change as a signed number (drives colour + sparkline hue). */
  change: number
  marketValueDisplay: string
  sparkline: number[]
  route: RouteLocationRaw
  /** Symbol handed to the trade side-panel. */
  tradeSymbol: string
  /** How to remove this row from the watchlist. */
  removeType: WatchlistRowType
  removeId: string
}

/** Currency formatters injected into the pure mappers (keeps them testable). */
export interface RowFormatters {
  fiat: (v: string | number | null | undefined) => string
  compact: (v: string | number | null | undefined) => string
}

export const mapTokenRow = (
  t: GetWebTokensWatchlistResponseToken,
  fmt: RowFormatters,
): WatchlistRow => ({
  key: `token-${t.coinId}`,
  logoUrl: t.logoUrl ?? undefined,
  symbol: t.symbol,
  name: t.name,
  isStock: false,
  priceDisplay: fmt.fiat(t.price),
  change: t.priceChangePercentage24h ?? 0,
  marketValueDisplay: fmt.compact(t.marketCap),
  sparkline: t.sparklineIn7d ?? [],
  route: { name: TOKEN_INFO_ROUTE_NAMES.home, params: { tokenId: t.coinId } },
  tradeSymbol: t.symbol,
  removeType: 'crypto',
  removeId: t.coinId,
})

export const mapStockRow = (
  s: GetWebStocksWatchlistResponseStock,
  fmt: RowFormatters,
): WatchlistRow => ({
  key: `stock-${s.primaryMarket.symbol}`,
  logoUrl: s.iconPngUrl || s.iconSvgUrl,
  symbol: s.primaryMarket.symbol,
  name: s.underlyingMarket.name,
  isStock: true,
  priceDisplay: fmt.fiat(s.primaryMarket.price),
  change: parseFloat(s.primaryMarket.priceChangePercentage24h) || 0,
  marketValueDisplay: fmt.compact(s.underlyingMarket.marketCap),
  sparkline: s.primaryMarket.sparkline24h ?? [],
  route: {
    name: STOCK_INFO_ROUTE_NAMES.home,
    params: { symbol: s.primaryMarket.symbol },
  },
  tradeSymbol: s.primaryMarket.symbol,
  removeType: 'stock',
  removeId: s.primaryMarket.symbol,
})

export const mapPerpRow = (
  c: Contract,
  fmt: RowFormatters,
): WatchlistRow => ({
  key: `perp-${c.baseCurrency}`,
  logoUrl: getLogoUrl(c.baseCurrency),
  symbol: c.baseCurrency,
  name: c.baseCurrency,
  isStock: false,
  priceDisplay: fmt.fiat(c.lastPrice),
  change: parseFloat(c.priceChangePercent ?? '0') || 0,
  // Perps have no market cap — show USD volume in that column.
  marketValueDisplay: fmt.compact(c.usdVolume),
  sparkline: (c.sparkline?.price ?? []).map(Number),
  route: { name: PERP_INFO_ROUTE_NAME, params: { market: c.market } },
  tradeSymbol: c.market,
  removeType: 'perp',
  removeId: c.baseCurrency,
})

/**
 * Unified watchlist rows for the home table (MEW-2130) — merges crypto tokens,
 * stocks and perps into one VM list. Perps data (and its WS lifecycle) is only
 * wired when the user actually has a perp watchlisted.
 */
export function useWatchlistRows(): {
  rows: ComputedRef<WatchlistRow[]>
  isLoading: Ref<boolean>
  refresh: () => void
} {
  const watchlistStore = useWatchlistStore()
  const { watchListedTokens, watchListedStocks, watchListedPerps } =
    storeToRefs(watchlistStore)
  const { formatFiat, formatFiatCompact } = useCurrency()

  const fmt: RowFormatters = {
    fiat: v => formatFiat(v).display,
    compact: v => formatFiatCompact(v).display,
  }

  const filterChain = ref(null)
  const {
    tokensWatchlistData,
    stocksWatchlistData,
    fetchAllWatchlist,
    isPendingAllWatchlist,
  } = useFetchWatchlist(filterChain)

  // Perps contracts singleton. Must be acquired during setup (usePerpsContracts
  // → inject() via the WS lifecycle); on non-perps routes it only fetches the
  // contracts snapshot and never opens a socket. The rows computed filters it
  // down to the watchlisted perps.
  const { contracts: perpsContracts } = usePerpsContracts()

  const rows = computed<WatchlistRow[]>(() => {
    // Filter fetched data by current store membership so removing a row (star)
    // drops it immediately even before the cached fetch data refreshes.
    const watchedTokens = new Set(watchListedTokens.value)
    const watchedStocks = new Set(watchListedStocks.value)
    const watchedPerps = new Set(watchListedPerps.value)
    const tokenRows = (tokensWatchlistData.value ?? [])
      .filter(t => watchedTokens.has(t.coinId))
      .map(t => mapTokenRow(t, fmt))
    const stockRows = (stocksWatchlistData.value ?? [])
      .filter(s => watchedStocks.has(s.primaryMarket.symbol))
      .map(s => mapStockRow(s, fmt))
    const perpRows = perpsContracts.value
      .filter(c => !c.disabled && watchedPerps.has(c.baseCurrency))
      .map(c => mapPerpRow(c, fmt))
    return [...stockRows, ...tokenRows, ...perpRows]
  })

  const refresh = () => fetchAllWatchlist()

  return { rows, isLoading: isPendingAllWatchlist, refresh }
}
