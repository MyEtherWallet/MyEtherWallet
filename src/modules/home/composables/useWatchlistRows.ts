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
  marketCapDisplay: string
  volumeDisplay: string
  sparkline: number[]
  route: RouteLocationRaw
  /** Symbol handed to the trade side-panel. */
  tradeSymbol: string
  /** How to remove this row from the watchlist. */
  removeType: WatchlistRowType
  removeId: string
  /** True while the row exists in the store but its market data is still loading
   * (optimistic row) — the table renders a skeleton for it. */
  loading?: boolean
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
  marketCapDisplay: fmt.compact(t.marketCap),
  volumeDisplay: fmt.compact(t.totalVolume),
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
  marketCapDisplay: fmt.compact(s.underlyingMarket.marketCap),
  volumeDisplay: fmt.compact(s.underlyingMarket.volume24h),
  sparkline: s.primaryMarket.sparkline24h ?? [],
  route: {
    name: STOCK_INFO_ROUTE_NAMES.home,
    params: { symbol: s.primaryMarket.symbol },
  },
  tradeSymbol: s.primaryMarket.symbol,
  removeType: 'stock',
  removeId: s.primaryMarket.symbol,
})

/**
 * Optimistic placeholder for a watchlisted id whose market data hasn't loaded
 * yet. Its `key` matches the eventual loaded row so Vue reuses the DOM node
 * (the skeleton hydrates in place, no flicker). Only the id-derived fields and
 * the remove action are known; the rest render as skeletons.
 */
export const placeholderRow = (
  type: WatchlistRowType,
  id: string,
): WatchlistRow => ({
  key: `${type === 'crypto' ? 'token' : type}-${id}`,
  logoUrl: undefined,
  symbol: type === 'crypto' ? '' : id,
  name: '',
  isStock: type === 'stock',
  priceDisplay: '',
  change: 0,
  marketCapDisplay: '',
  volumeDisplay: '',
  sparkline: [],
  route:
    type === 'stock'
      ? { name: STOCK_INFO_ROUTE_NAMES.home, params: { symbol: id } }
      : type === 'perp'
        ? { name: PERP_INFO_ROUTE_NAME, params: { market: id } }
        : { name: TOKEN_INFO_ROUTE_NAMES.home, params: { tokenId: id } },
  tradeSymbol: id,
  removeType: type,
  removeId: id,
  loading: true,
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
  // Perps have no market cap; volume is the USD volume.
  marketCapDisplay: '',
  volumeDisplay: fmt.compact(c.usdVolume),
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
  const { watchListedTokens, watchListedStocks, watchListedPerps, watchlistOrder } =
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
    // Store membership (localStorage) is the source of truth: emit one row per
    // watchlisted id right away so a just-added item shows instantly, using the
    // fetched market data when it's there and a loading placeholder until then.
    // Removing a row (star) drops it immediately since it leaves the store list.
    const tokenById = new Map(
      (tokensWatchlistData.value ?? []).map(t => [t.coinId, t]),
    )
    const stockBySymbol = new Map(
      (stocksWatchlistData.value ?? []).map(s => [s.primaryMarket.symbol, s]),
    )
    const perpByBase = new Map(
      perpsContracts.value.filter(c => !c.disabled).map(c => [c.baseCurrency, c]),
    )

    const stockRows = watchListedStocks.value.map(sym => {
      const s = stockBySymbol.get(sym)
      return s ? mapStockRow(s, fmt) : placeholderRow('stock', sym)
    })
    const tokenRows = watchListedTokens.value.map(id => {
      const t = tokenById.get(id)
      return t ? mapTokenRow(t, fmt) : placeholderRow('crypto', id)
    })
    const perpRows = watchListedPerps.value.map(base => {
      const c = perpByBase.get(base)
      return c ? mapPerpRow(c, fmt) : placeholderRow('perp', base)
    })

    // Apply the manual drag order (row keys); ids not yet ordered (just added)
    // sort to the top so they're visible above the "Show more" fold. Array sort
    // is stable, so unordered items keep their bucket order (stocks, tokens,
    // perps) and the default (empty order) matches the pre-drag layout.
    const orderIndex = new Map(watchlistOrder.value.map((k, i) => [k, i]))
    const rank = (r: WatchlistRow) =>
      orderIndex.has(r.key) ? (orderIndex.get(r.key) as number) : -1
    return [...stockRows, ...tokenRows, ...perpRows].sort(
      (a, b) => rank(a) - rank(b),
    )
  })

  const refresh = () => fetchAllWatchlist()

  return { rows, isLoading: isPendingAllWatchlist, refresh }
}
