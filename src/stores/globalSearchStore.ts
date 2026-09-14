import { ref, reactive, computed, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { refDebounced } from '@vueuse/core'
import { useAppLayoutStore } from '@/stores/appLayoutStore'
import { useRecentlyViewedTokensStore } from '@/stores/recentlyViewedTokensStore'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import { getAPIPath } from '@/utils/constructAPIPath'
import type {
  GetWebStocksTableResponse,
  GetWebTokensTableResponse,
} from '@/mew_api/types'
import { analytics, GlobalSearchEvent } from '@/analytics'
import type {
  SearchResultItem,
  SectionKey,
} from '@/modules/global_search/types'

const DEBOUNCE_MS = 350
const PER_PAGE = 20

/**
 * State behind the global search popover: the query, both result lists, and the
 * fetches that fill them.
 *
 * Everything here was module-level state in `useGlobalSearch`, including the two
 * `useFetchMewApi()` instances — which meant that fetch machinery was
 * constructed at import time, for every page load, whether or not anyone opened
 * search. In store setup it is built on first use instead.
 *
 * Navigation stays in `useGlobalSearch()`, which needs a caller's `useRouter()`.
 */
export const useGlobalSearchStore = defineStore('globalSearch', () => {
  const isOpen = ref(false)
  const query = ref('')

  const stocks = ref<SearchResultItem[]>([])
  const crypto = ref<SearchResultItem[]>([])
  const isLoadingStocks = ref(false)
  const isLoadingCrypto = ref(false)

  const expanded = reactive<Record<SectionKey, boolean>>({
    stocks: false,
    crypto: false,
  })

  const { isOverflowHidden } = storeToRefs(useAppLayoutStore())
  const recentlyViewedStore = useRecentlyViewedTokensStore()
  const { recentlyViewedTokens } = storeToRefs(recentlyViewedStore)

  const recentlyViewedTop6 = computed<SearchResultItem[]>(() =>
    recentlyViewedTokens.value.slice(0, 6).map(t => ({
      id: t.id,
      symbol: t.symbol,
      name: t.name,
      icon: t.icon,
      priceUsd: null,
      change24hPct: null,
      isStock: !!t.isStock,
    })),
  )

  // Tied to query's lifecycle; settles to query's current value after the delay.
  const debouncedQuery = refDebounced(query, DEBOUNCE_MS)

  const stocksUrl = computed(() => {
    const base = getAPIPath('/v1/web/pages/stocks/table')
    const params = new URLSearchParams({
      page: '1',
      perPage: String(PER_PAGE),
      sort: 'MARKET_CAP_DESC',
    })
    if (debouncedQuery.value) params.set('search', debouncedQuery.value)
    return `${base}?${params.toString()}`
  })

  const cryptoUrl = computed(() => {
    const base = getAPIPath('/v1/web/tokens-table')
    const params = new URLSearchParams({
      page: '1',
      perPage: String(PER_PAGE),
      sort: 'MARKET_CAP_DESC',
    })
    if (debouncedQuery.value) params.set('search', debouncedQuery.value)
    return `${base}?${params.toString()}`
  })

  const { useMEWFetch: useStocksFetch } = useFetchMewApi(0, true)
  const { useMEWFetch: useCryptoFetch } = useFetchMewApi(0, true)

  // No `immediate: true` — fetches only fire when the popover is opened.
  const {
    data: rawStocks,
    isFetching: isFetchingStocks,
    execute: executeStocksFetch,
  } = useStocksFetch(stocksUrl, { refetch: true, immediate: false })
    .get()
    .json<GetWebStocksTableResponse>()

  const {
    data: rawCrypto,
    isFetching: isFetchingCrypto,
    execute: executeCryptoFetch,
  } = useCryptoFetch(cryptoUrl, { refetch: true, immediate: false })
    .get()
    .json<GetWebTokensTableResponse>()

  watch(isFetchingStocks, v => {
    isLoadingStocks.value = v
  })
  watch(isFetchingCrypto, v => {
    isLoadingCrypto.value = v
  })

  watch(rawStocks, data => {
    const list = data?.items ?? []
    stocks.value = list.map(s => {
      const price = parseFloat(s.primaryMarket.price)
      const change = parseFloat(s.primaryMarket.priceChangePercentage24h)
      return {
        id: s.primaryMarket.symbol,
        symbol: s.primaryMarket.symbol,
        name: s.underlyingMarket.name,
        icon: s.iconPngUrl ?? s.iconSvgUrl,
        priceUsd: Number.isFinite(price) ? price : null,
        change24hPct: Number.isFinite(change) ? change : null,
        isStock: true,
      }
    })
  })

  watch(rawCrypto, data => {
    const list = data?.items ?? []
    const filtered = list.filter(t => t.ondo == null)
    crypto.value = filtered.map(t => ({
      id: t.coinId,
      symbol: t.symbol,
      name: t.name,
      icon: t.logoUrl ?? undefined,
      priceUsd: t.price,
      change24hPct: t.priceChangePercentage24h,
      isStock: false,
    }))
  })

  // Bootstrap fetches on (re)open. Query-driven refetches are handled by
  // `refetch: true` on the underlying useFetch instances.
  watch(isOpen, open => {
    if (!open) return
    executeStocksFetch()
    executeCryptoFetch()
  })

  const open = () => {
    isOpen.value = true
    isOverflowHidden.value = true
    analytics.trackGlobalSearchEvent(GlobalSearchEvent.SHOWN)
  }

  const close = () => {
    isOpen.value = false
    isOverflowHidden.value = false
    query.value = ''
    expanded.stocks = false
    expanded.crypto = false
    stocks.value = []
    crypto.value = []
    isLoadingStocks.value = false
    isLoadingCrypto.value = false
  }

  const toggleExpand = (key: SectionKey) => {
    expanded[key] = !expanded[key]
  }

  const addRecentlyViewed = (item: SearchResultItem) => {
    recentlyViewedStore.addToken({
      id: item.id,
      symbol: item.symbol,
      name: item.name,
      icon: item.icon,
      isStock: item.isStock,
    })
  }

  return {
    isOpen,
    query,
    debouncedQuery,
    stocks,
    crypto,
    isLoadingStocks,
    isLoadingCrypto,
    expanded,
    recentlyViewedTop6,
    open,
    close,
    toggleExpand,
    addRecentlyViewed,
  }
})
