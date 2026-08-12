import { ref, computed, watch, type Ref, type ComputedRef } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import { usePerpsContracts, usePerpsMarkets } from '@/modules/perps/composables/usePerpsMarkets'
import { getLogoUrl } from '@/modules/perps/utils/market'
import type { Contract, TradingPair } from '@/modules/perps/sdk/types'
import type {
  GetWebTokensTableResponse,
  GetWebTokensTableResponseToken,
  GetWebStocksTableResponse,
  GetWebStocksTableResponseItem,
} from '@/mew_api/types'

export type AssetPickerTab = 'all' | 'stocks' | 'crypto' | 'perps'

export interface AssetPickerItem {
  /** Unique across markets: `${type}-${watchlistId}`. */
  key: string
  symbol: string
  name: string
  logoUrl?: string
  type: 'crypto' | 'stock' | 'perp'
  /** Value handed to the store: coinId | stock symbol | baseCurrency. */
  watchlistId: string
}

const PER_PAGE = 50

// --- Pure mappers (exported for tests) -------------------------------------

export const mapCryptoItem = (
  t: GetWebTokensTableResponseToken,
): AssetPickerItem => {
  // Ondo tokenized stocks live in the crypto table but belong to the stock
  // watchlist bucket (mirrors ModuleExploreCrypto.getWatchlistId).
  if (t.ondo) {
    return {
      key: `stock-${t.ondo.primaryMarket.symbol}`,
      symbol: t.symbol,
      name: t.ondo.stockAlias ?? t.name,
      logoUrl: t.logoUrl ?? undefined,
      type: 'stock',
      watchlistId: t.ondo.primaryMarket.symbol,
    }
  }
  return {
    key: `crypto-${t.coinId}`,
    symbol: t.symbol,
    name: t.name,
    logoUrl: t.logoUrl ?? undefined,
    type: 'crypto',
    watchlistId: t.coinId,
  }
}

export const mapStockItem = (
  s: GetWebStocksTableResponseItem,
): AssetPickerItem => ({
  key: `stock-${s.primaryMarket.symbol}`,
  symbol: s.primaryMarket.symbol,
  name: s.underlyingMarket.name,
  logoUrl: s.iconPngUrl || s.iconSvgUrl || undefined,
  type: 'stock',
  watchlistId: s.primaryMarket.symbol,
})

export const mapPerpItem = (
  c: Contract,
  pair?: TradingPair,
): AssetPickerItem => ({
  key: `perp-${c.baseCurrency}`,
  symbol: c.baseCurrency,
  name: pair?.longName ?? pair?.displayName ?? c.baseCurrency,
  logoUrl: getLogoUrl(c.baseCurrency),
  type: 'perp',
  watchlistId: c.baseCurrency,
})

export const matchesQuery = (item: AssetPickerItem, q: string): boolean => {
  if (!q) return true
  const s = q.toLowerCase()
  return (
    item.symbol.toLowerCase().includes(s) || item.name.toLowerCase().includes(s)
  )
}

/** Keep the first occurrence of each key (stocks/crypto before perps). */
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
 * Backs the "Add to watchlist" modal (MEW-2130). Given the active tab + search
 * query, returns a unified, searchable asset list. Crypto/stocks come from the
 * paginated table endpoints (server search); perps are filtered in memory from
 * the live contracts singleton.
 */
export function useAssetPicker(
  tab: Ref<AssetPickerTab>,
  query: Ref<string>,
  enabled: Ref<boolean>,
): { items: ComputedRef<AssetPickerItem[]>; isLoading: Ref<boolean> } {
  const { useMEWFetch } = useFetchMewApi()

  const serverItems = ref<AssetPickerItem[]>([])
  const isLoading = ref(false)
  let loadToken = 0

  const fetchCrypto = async (q: string): Promise<AssetPickerItem[]> => {
    const url = `/v1/web/tokens-table?page=1&perPage=${PER_PAGE}&sort=MARKET_CAP_DESC&search=${encodeURIComponent(q)}`
    const { data } = await useMEWFetch(url).get().json<GetWebTokensTableResponse>()
    return (data.value?.items ?? []).map(mapCryptoItem)
  }

  const fetchStocks = async (q: string): Promise<AssetPickerItem[]> => {
    const url = `/v1/web/pages/stocks/table?page=1&perPage=${PER_PAGE}&sort=MARKET_CAP_DESC&search=${encodeURIComponent(q)}`
    const { data } = await useMEWFetch(url).get().json<GetWebStocksTableResponse>()
    return (data.value?.items ?? []).map(mapStockItem)
  }

  const loadServer = async () => {
    if (!enabled.value) return
    if (tab.value === 'perps') {
      serverItems.value = []
      return
    }
    const token = ++loadToken
    isLoading.value = true
    try {
      let next: AssetPickerItem[] = []
      if (tab.value === 'crypto') next = await fetchCrypto(query.value)
      else if (tab.value === 'stocks') next = await fetchStocks(query.value)
      else {
        const [c, s] = await Promise.all([
          fetchCrypto(query.value),
          fetchStocks(query.value),
        ])
        next = [...s, ...c]
      }
      if (token === loadToken) serverItems.value = next
    } catch {
      if (token === loadToken) serverItems.value = []
    } finally {
      if (token === loadToken) isLoading.value = false
    }
  }
  const debouncedLoad = useDebounceFn(loadServer, 300)

  // Perps: lazily attach the live contracts singleton only when a perps/all tab
  // is used, then filter reactively.
  let perpsContracts: Ref<Contract[]> | null = null
  let perpsMarkets: Ref<TradingPair[]> | null = null
  const perpsHolder = ref(0) // bump to make `items` recompute after lazy wire
  const ensurePerps = () => {
    if (perpsContracts) return
    perpsContracts = usePerpsContracts().contracts
    perpsMarkets = usePerpsMarkets().markets
    perpsHolder.value++
  }

  const perpsItems = computed<AssetPickerItem[]>(() => {
    void perpsHolder.value
    if (!enabled.value) return []
    if (tab.value !== 'perps' && tab.value !== 'all') return []
    if (!perpsContracts || !perpsMarkets) return []
    const marketMap = new Map(perpsMarkets.value.map(p => [p.market, p]))
    return perpsContracts.value
      .filter(c => !c.disabled)
      .map(c => mapPerpItem(c, marketMap.get(c.market)))
      .filter(item => matchesQuery(item, query.value))
  })

  const items = computed<AssetPickerItem[]>(() => {
    if (tab.value === 'perps') return perpsItems.value
    if (tab.value === 'all')
      return dedupeItems([...serverItems.value, ...perpsItems.value])
    return serverItems.value
  })

  // Tab switch loads immediately; query typing is debounced. Nothing runs
  // until the modal is opened (`enabled`), avoiding a fetch while it's closed.
  watch(tab, t => {
    if (!enabled.value) return
    if (t === 'perps' || t === 'all') ensurePerps()
    loadServer()
  })
  watch(query, () => {
    if (enabled.value) debouncedLoad()
  })
  watch(
    enabled,
    on => {
      if (!on) return
      if (tab.value === 'perps' || tab.value === 'all') ensurePerps()
      loadServer()
    },
    { immediate: true },
  )

  return { items, isLoading }
}
