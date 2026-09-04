import { ref, type Ref } from 'vue'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import {
  mapCryptoItem,
  mapStockItem,
  type AssetPickerItem,
} from '@/modules/home/composables/useAssetPicker'
import type { RecommendedAsset } from '@/modules/home/components/watchlistOnboarding'
import type {
  GetWebTokensTableResponse,
  GetWebStocksTableResponse,
} from '@/mew_api/types'

/**
 * Single seam for the watchlist onboarding recommendations (MEW-2130).
 *
 * There is no `/recommendations` endpoint yet, so this derives the list from the
 * existing market tables, based on the markets picked in step 1 and the curated
 * collection categories picked in step 2:
 *   - crypto categories filter the tokens table (`&category=`)
 *   - stock categories filter the stocks table (`&category=`)
 *   - a market picked with no category → that table unfiltered
 *   - nothing picked (skipped) → both tables unfiltered
 * Multiple categories of a type are fetched per-category and merged.
 *
 * When the recommendations endpoint ships, swap the body of
 * `fetchRecommendations` for that single call — the signature stays the same.
 */
export interface RecommendationCategory {
  market: 'crypto' | 'stocks'
  /** Value the table endpoints read from `?category=` (IndustrySector.filter). */
  filter: string
}

const PER_PAGE = 50
const TOKENS_TABLE = `/v1/web/tokens-table?page=1&perPage=${PER_PAGE}&sort=MARKET_CAP_DESC`
const STOCKS_TABLE = `/v1/web/pages/stocks/table?page=1&perPage=${PER_PAGE}&sort=MARKET_CAP_DESC`

const toRecommended = (i: AssetPickerItem): RecommendedAsset => ({
  id: i.key,
  symbol: i.symbol,
  name: i.name,
  logoUrl: i.logoUrl,
  type: i.type,
  watchlistId: i.watchlistId,
})

/** Keep the first occurrence of each id (stocks win over crypto-table dupes). */
const dedupe = (assets: RecommendedAsset[]): RecommendedAsset[] => {
  const seen = new Set<string>()
  const out: RecommendedAsset[] = []
  for (const a of assets) {
    if (seen.has(a.id)) continue
    seen.add(a.id)
    out.push(a)
  }
  return out
}

export function useRecommendedWatchlist(): {
  assets: Ref<RecommendedAsset[]>
  isLoading: Ref<boolean>
  fetchRecommendations: (
    markets: string[],
    categories: RecommendationCategory[],
  ) => Promise<void>
} {
  const { useMEWFetch } = useFetchMewApi()
  const assets = ref<RecommendedAsset[]>([])
  const isLoading = ref(false)

  const categoryParam = (filter?: string) =>
    filter ? `&category=${encodeURIComponent(filter)}` : ''

  const fetchCryptoPage = async (
    filter?: string,
  ): Promise<RecommendedAsset[]> => {
    const { data } = await useMEWFetch(`${TOKENS_TABLE}${categoryParam(filter)}`)
      .get()
      .json<GetWebTokensTableResponse>()
    return (data.value?.items ?? []).map(mapCryptoItem).map(toRecommended)
  }

  const fetchStocksPage = async (
    filter?: string,
  ): Promise<RecommendedAsset[]> => {
    const { data } = await useMEWFetch(`${STOCKS_TABLE}${categoryParam(filter)}`)
      .get()
      .json<GetWebStocksTableResponse>()
    return (data.value?.items ?? []).map(mapStockItem).map(toRecommended)
  }

  // No categories → one unfiltered page; otherwise one page per category, merged.
  const fetchByCategories = async (
    filters: string[],
    fetchPage: (filter?: string) => Promise<RecommendedAsset[]>,
  ): Promise<RecommendedAsset[]> => {
    if (!filters.length) return fetchPage()
    const pages = await Promise.all(filters.map(f => fetchPage(f)))
    return pages.flat()
  }

  const fetchRecommendations = async (
    markets: string[],
    categories: RecommendationCategory[],
  ) => {
    const wantCrypto = markets.length === 0 || markets.includes('crypto')
    const wantStocks = markets.length === 0 || markets.includes('stocks')
    const cryptoFilters = categories
      .filter(c => c.market === 'crypto')
      .map(c => c.filter)
    const stockFilters = categories
      .filter(c => c.market === 'stocks')
      .map(c => c.filter)

    isLoading.value = true
    try {
      const [crypto, stocks] = await Promise.all([
        wantCrypto
          ? fetchByCategories(cryptoFilters, fetchCryptoPage)
          : Promise.resolve<RecommendedAsset[]>([]),
        wantStocks
          ? fetchByCategories(stockFilters, fetchStocksPage)
          : Promise.resolve<RecommendedAsset[]>([]),
      ])
      assets.value = dedupe([...stocks, ...crypto])
    } catch {
      assets.value = []
    } finally {
      isLoading.value = false
    }
  }

  return { assets, isLoading, fetchRecommendations }
}
