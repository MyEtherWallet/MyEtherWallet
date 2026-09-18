import { computed, ref, type Ref, type ComputedRef } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useWatchlistStore } from '@/stores/watchlistTableStore'
import { useFetchWatchlist } from '@/composables/useFetchWatchlist'
import { useCurrency } from '@/composables/useCurrency'
import { getLogoUrl } from '@/modules/perps/utils/market'
import { useNewListingCta, type NewListingCtaKind } from './useNewListingCta'
import type { SwapChain, SwapNativeChain } from './useNewListingSwap'
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
  /** Crypto only: whether the trade action swaps (token is on the current chain)
   * or bridges (only on other chains). Matches the info drawer's panel so the
   * row's button advertises what actually opens. */
  cta?: NewListingCtaKind
  /** Crypto only: the coin's chains, carried so the action can prime the
   * swap/bridge panel (mapped to the minimal shape the swap helpers read). */
  chains?: SwapChain[]
  nativeChains?: SwapNativeChain[]
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
  route: {
    name: TOKEN_INFO_ROUTE_NAMES.homePage,
    params: { tokenId: t.coinId },
  },
  tradeSymbol: t.symbol,
  removeType: 'crypto',
  removeId: t.coinId,
  chains: (t.chains ?? []).map(c => ({
    chainName: c.chainName,
    contract: c.address,
    decimals: c.decimals,
  })),
  nativeChains: (t.nativeChains ?? []).map(c => ({
    chainName: c.chainName,
    decimals: c.decimals,
  })),
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
    name: STOCK_INFO_ROUTE_NAMES.homePage,
    params: { symbol: s.primaryMarket.symbol },
  },
  tradeSymbol: s.primaryMarket.symbol,
  removeType: 'stock',
  removeId: s.primaryMarket.symbol,
})

/**
 * Optimistic placeholder for a watchlisted id whose market data isn't in the
 * response. Its `key` matches the eventual loaded row so Vue reuses the DOM node
 * (the skeleton hydrates in place, no flicker). `loading` is true only while the
 * source is still fetching — once it settles without this id (delisted asset,
 * disabled perp, failed request) the row renders non-loading instead of a
 * skeleton that would never resolve. Only the id-derived fields and the remove
 * action are known; the rest render as skeletons while loading.
 */
export const placeholderRow = (
  type: WatchlistRowType,
  id: string,
  loading = true,
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
      ? { name: STOCK_INFO_ROUTE_NAMES.homePage, params: { symbol: id } }
      : type === 'perp'
        ? { name: PERP_INFO_ROUTE_NAME, params: { market: id } }
        : { name: TOKEN_INFO_ROUTE_NAMES.homePage, params: { tokenId: id } },
  tradeSymbol: id,
  removeType: type,
  removeId: id,
  loading,
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
 * Watchlist rows for the home table — merges crypto tokens and stocks into one
 * VM list (MEW-2130). Perps are intentionally excluded from the home watchlist
 * (MEW-2360); they live only in the perps module.
 */
export function useWatchlistRows(): {
  rows: ComputedRef<WatchlistRow[]>
  isLoading: Ref<boolean>
  refresh: () => void
} {
  const watchlistStore = useWatchlistStore()
  const { watchListedTokens, watchListedStocks, watchlistOrder } =
    storeToRefs(watchlistStore)
  const { formatFiat, formatFiatCompact } = useCurrency()
  const { resolve: resolveCta } = useNewListingCta()

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

    // A missing id is a loading skeleton only while its source is still
    // fetching; once settled (error, delisted asset, disabled perp) it renders
    // a non-loading row so it can't skeleton forever.
    const stockRows = watchListedStocks.value.map(sym => {
      const s = stockBySymbol.get(sym)
      return s
        ? mapStockRow(s, fmt)
        : placeholderRow('stock', sym, isPendingAllWatchlist.value)
    })
    const tokenRows = watchListedTokens.value.map(id => {
      const t = tokenById.get(id)
      if (!t) return placeholderRow('crypto', id, isPendingAllWatchlist.value)
      const row = mapTokenRow(t, fmt)
      // Same swap-vs-bridge call the info drawer makes, so the row's button
      // matches the panel that opens.
      row.cta = resolveCta({ chains: t.chains, nativeChains: t.nativeChains })
      return row
    })

    // Apply the manual drag order (row keys); ids not yet ordered (just added)
    // sort to the top so they're visible above the "Show more" fold. Array sort
    // is stable, so unordered items keep their bucket order (stocks then tokens)
    // and the default (empty order) matches the pre-drag layout.
    const orderIndex = new Map(watchlistOrder.value.map((k, i) => [k, i]))
    const rank = (r: WatchlistRow) =>
      orderIndex.has(r.key) ? (orderIndex.get(r.key) as number) : -1
    return [...stockRows, ...tokenRows].sort((a, b) => rank(a) - rank(b))
  })

  const refresh = () => fetchAllWatchlist()

  return { rows, isLoading: isPendingAllWatchlist, refresh }
}
