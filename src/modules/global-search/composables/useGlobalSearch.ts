// src/modules/global-search/composables/useGlobalSearch.ts
import { ref, computed, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useRecentlyViewedTokensStore } from '@/stores/recentlyViewedTokensStore'
import { STOCK_INFO_ROUTE_NAMES } from '@/router/routeNames'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import { getAPIPath } from '@/utils/constructAPIPath'
import Configs from '@/configs'
import type { GetWebStocksTableResponse, GetWebTokensTableResponse } from '@/mew_api/types'
import type { SearchResultItem, SectionKey } from '../types'

// Module-level singleton state
const isOpen = ref(false)
const query = ref('')
const debouncedQuery = ref('')

const stocks = ref<SearchResultItem[]>([])
const crypto = ref<SearchResultItem[]>([])
const isLoadingStocks = ref(false)
const isLoadingCrypto = ref(false)

const expanded = {
  stocks: ref(false),
  crypto: ref(false),
}

const DEBOUNCE_MS = 300
const PER_PAGE = 20

const updateDebouncedQuery = useDebounceFn((q: string) => {
  debouncedQuery.value = q
}, DEBOUNCE_MS)

watch(query, q => updateDebouncedQuery(q))

const stocksUrl = computed(() => {
  const url = new URL(`${Configs.MEW_API_URL}/v1/web/pages/stocks/table`)
  url.searchParams.set('page', '1')
  url.searchParams.set('perPage', String(PER_PAGE))
  url.searchParams.set('sort', 'MARKET_CAP_DESC')
  if (debouncedQuery.value) url.searchParams.set('search', debouncedQuery.value)
  return url.toString()
})

const cryptoUrl = computed(() => {
  const base = getAPIPath('/v1/web/tokens-table')
  const params = new URLSearchParams({
    filterChain: 'all',
    page: '1',
    perPage: String(PER_PAGE),
    sort: 'NAME_ASC',
  })
  if (debouncedQuery.value) params.set('search', debouncedQuery.value)
  return `${base}?${params.toString()}`
})

const { useMEWFetch: useStocksFetch } = useFetchMewApi(0, true)
const { useMEWFetch: useCryptoFetch } = useFetchMewApi(0, true)

const {
  data: rawStocks,
  isFetching: isFetchingStocks,
} = useStocksFetch(stocksUrl, { refetch: true, immediate: true })
  .get()
  .json<GetWebStocksTableResponse>()

const {
  data: rawCrypto,
  isFetching: isFetchingCrypto,
} = useCryptoFetch(cryptoUrl, { refetch: true, immediate: true })
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
  stocks.value = list.map(s => ({
    id: s.primaryMarket.symbol,
    symbol: s.primaryMarket.symbol,
    name: s.underlyingMarket.name,
    icon: s.iconPngUrl ?? s.iconSvgUrl,
    priceUsd: s.primaryMarket.price ? parseFloat(s.primaryMarket.price) || null : null,
    change24hPct: s.primaryMarket.priceChangePercentage24h
      ? parseFloat(s.primaryMarket.priceChangePercentage24h) || null
      : null,
    isStock: true,
  }))
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

export function useGlobalSearch() {
  const router = useRouter()
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

  const open = () => {
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
    query.value = ''
    debouncedQuery.value = ''
    expanded.stocks.value = false
    expanded.crypto.value = false
  }

  const toggleExpand = (key: SectionKey) => {
    expanded[key].value = !expanded[key].value
  }

  const selectAsset = (item: SearchResultItem) => {
    const routeName = item.isStock
      ? STOCK_INFO_ROUTE_NAMES.stocks
      : STOCK_INFO_ROUTE_NAMES.crypto
    router.push({ name: routeName, params: { symbol: item.symbol } })
    recentlyViewedStore.addToken({
      id: item.id,
      symbol: item.symbol,
      name: item.name,
      icon: item.icon,
      isStock: item.isStock,
    })
    close()
  }

  return {
    isOpen,
    query,
    debouncedQuery,
    stocks: computed(() => stocks.value),
    crypto: computed(() => crypto.value),
    isLoadingStocks,
    isLoadingCrypto,
    expanded,
    toggleExpand,
    recentlyViewedTop6,
    open,
    close,
    selectAsset,
  }
}
