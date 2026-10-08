import { ref, watch, type Ref } from 'vue'
import { getTokenDisplayName } from '@/utils/tokenDisplayName'
import { useDebounceFn } from '@vueuse/core'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import type {
  GetWebTokensTableResponse,
  GetWebTokensTableResponseToken,
  GetWebStocksTableResponse,
  GetWebStocksTableResponseItem,
} from '@/mew_api/types'

export type AssetPickerTab = 'stocks' | 'crypto'

export interface AssetPickerItem {
  /** Unique across markets: `${type}-${watchlistId}`. */
  key: string
  symbol: string
  name: string
  logoUrl?: string
  type: 'crypto' | 'stock'
  /** Value handed to the store: coinId | stock symbol. */
  watchlistId: string
  price?: number
  /** 24h change in percent. */
  change?: number
}

const PER_PAGE = 50

// Crypto "categories" that are really a sort on the 24h change (same as the
// /crypto filter), not an API `category=`.
const CRYPTO_SORT_CATEGORIES: Record<string, string> = {
  topGainers: 'PRICE_CHANGE_PERCENTAGE_24H_DESC',
  topLosers: 'PRICE_CHANGE_PERCENTAGE_24H_ASC',
}

// --- Pure mappers (exported for tests) -------------------------------------

export const mapCryptoItem = (
  t: GetWebTokensTableResponseToken,
): AssetPickerItem => {
  const price = t.price ?? undefined
  const change = t.priceChangePercentage24h ?? undefined
  // Ondo tokenized stocks live in the crypto table but belong to the stock
  // watchlist bucket (mirrors ModuleExploreCrypto.getWatchlistId).
  if (t.ondo) {
    return {
      key: `stock-${t.ondo.primaryMarket.symbol}`,
      symbol: t.symbol,
      name: getTokenDisplayName(t),
      logoUrl: t.logoUrl ?? undefined,
      type: 'stock',
      watchlistId: t.ondo.primaryMarket.symbol,
      price,
      change,
    }
  }
  return {
    key: `crypto-${t.coinId}`,
    symbol: t.symbol,
    name: t.name,
    logoUrl: t.logoUrl ?? undefined,
    type: 'crypto',
    watchlistId: t.coinId,
    price,
    change,
  }
}

export const mapStockItem = (
  s: GetWebStocksTableResponseItem,
): AssetPickerItem => ({
  key: `stock-${s.primaryMarket.symbol}`,
  symbol: s.primaryMarket.symbol,
  name: s.stockAlias || s.underlyingMarket?.name || '',
  logoUrl: s.iconPngUrl || s.iconSvgUrl || undefined,
  type: 'stock',
  watchlistId: s.primaryMarket.symbol,
  price: s.primaryMarket.price ? Number(s.primaryMarket.price) : undefined,
  change: s.primaryMarket.priceChangePercentage24h
    ? parseFloat(s.primaryMarket.priceChangePercentage24h)
    : undefined,
})

/** Keep the first occurrence of each key (stocks before crypto). */
export const dedupeItems = (items: AssetPickerItem[]): AssetPickerItem[] => {
  const seen = new Set<string>()
  const out: AssetPickerItem[] = []
  for (const item of items) {
    if (seen.has(item.key)) continue
    seen.add(item.key)
    out.push(item)
  }
  return out
}

// --- Composable ------------------------------------------------------------

/**
 * Backs the "Add to watchlist" modal. Lists the active tab's market filtered by
 * the picked category ('all' = no filter). A search query ignores both and
 * searches stocks + crypto together (the modal hides tabs and chips while
 * typing).
 */
export function useAssetPicker(
  tab: Ref<AssetPickerTab>,
  category: Ref<string>,
  query: Ref<string>,
): { items: Ref<AssetPickerItem[]>; isLoading: Ref<boolean> } {
  const { useMEWFetch } = useFetchMewApi()

  const items = ref<AssetPickerItem[]>([])
  const isLoading = ref(false)
  let loadToken = 0

  const fetchCrypto = async (
    search: string,
    cat: string,
  ): Promise<AssetPickerItem[]> => {
    const params = new URLSearchParams({
      page: '1',
      perPage: String(PER_PAGE),
      sort: CRYPTO_SORT_CATEGORIES[cat] ?? 'MARKET_CAP_DESC',
      search,
    })
    if (cat !== 'all' && !CRYPTO_SORT_CATEGORIES[cat])
      params.set('category', cat)
    const { data } = await useMEWFetch(`/v1/web/tokens-table?${params}`)
      .get()
      .json<GetWebTokensTableResponse>()
    return (data.value?.items ?? []).map(mapCryptoItem)
  }

  const fetchStocks = async (
    search: string,
    cat: string,
  ): Promise<AssetPickerItem[]> => {
    const params = new URLSearchParams({
      page: '1',
      perPage: String(PER_PAGE),
      sort: 'MARKET_CAP_DESC',
      search,
    })
    if (cat !== 'all') params.set('category', cat)
    const { data } = await useMEWFetch(`/v1/web/pages/stocks/table?${params}`)
      .get()
      .json<GetWebStocksTableResponse>()
    return (data.value?.items ?? []).map(mapStockItem)
  }

  const load = async () => {
    const token = ++loadToken
    isLoading.value = true
    try {
      const q = query.value.trim()
      let next: AssetPickerItem[]
      if (q) {
        const [s, c] = await Promise.all([
          fetchStocks(q, 'all'),
          fetchCrypto(q, 'all'),
        ])
        next = dedupeItems([...s, ...c])
      } else if (tab.value === 'stocks') {
        next = await fetchStocks('', category.value)
      } else {
        next = await fetchCrypto('', category.value)
      }
      if (token === loadToken) items.value = next
    } catch {
      if (token === loadToken) items.value = []
    } finally {
      if (token === loadToken) isLoading.value = false
    }
  }

  // Tab / category changes load immediately; query typing is debounced.
  watch([tab, category], load, { immediate: true })
  watch(query, useDebounceFn(load, 300))

  return { items, isLoading }
}
