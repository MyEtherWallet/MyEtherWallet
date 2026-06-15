// src/modules/global_search/composables/useGlobalSearch.ts
import { ref, reactive, computed, watch } from 'vue'
import { refDebounced } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useRecentlyViewedTokensStore } from '@/stores/recentlyViewedTokensStore'
import {
  ROUTES_MAIN,
  STOCK_INFO_ROUTE_NAMES,
  TOKEN_INFO_ROUTE_NAMES,
} from '@/router/routeNames'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import { getAPIPath } from '@/utils/constructAPIPath'
import Configs from '@/configs'
import type { GetWebStocksTableResponse, GetWebTokensTableResponse } from '@/mew_api/types'
import type { SearchResultItem, SectionKey } from '../types'

// Module-level singleton state
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

const DEBOUNCE_MS = 180
const PER_PAGE = 20

// Tied to query's lifecycle; settles to query's current value after the delay.
const debouncedQuery = refDebounced(query, DEBOUNCE_MS)

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
    expanded.stocks = false
    expanded.crypto = false
    // Clear cached results so a re-open starts from a clean slate.
    stocks.value = []
    crypto.value = []
    isLoadingStocks.value = false
    isLoadingCrypto.value = false
  }

  const toggleExpand = (key: SectionKey) => {
    expanded[key] = !expanded[key]
  }

  const selectAsset = (item: SearchResultItem) => {
    // Append the child drawer route to the current top-level parent so the
    // underlying page stays visible behind it, mirroring how table rows work.
    const parent = router.currentRoute.value.matched[0]?.name
    const parentKey =
      parent === ROUTES_MAIN.HOME.NAME
        ? 'home'
        : parent === ROUTES_MAIN.CRYPTO.NAME
          ? 'crypto'
          : parent === ROUTES_MAIN.STOCKS.NAME
            ? 'stocks'
            : parent === ROUTES_MAIN.EARN.NAME
              ? 'earn'
              : parent === ROUTES_MAIN.VERIFY_MESSAGE.NAME
                ? 'verify'
                : parent === ROUTES_MAIN.SIGN_MESSAGE.NAME
                  ? 'sign'
                  : null
    const target = item.isStock
      ? {
          name: parentKey
            ? STOCK_INFO_ROUTE_NAMES[parentKey]
            : STOCK_INFO_ROUTE_NAMES.stocks,
          params: { symbol: item.symbol },
        }
      : {
          name: parentKey
            ? TOKEN_INFO_ROUTE_NAMES[parentKey]
            : TOKEN_INFO_ROUTE_NAMES.crypto,
          params: { tokenId: item.id },
        }
    router.push(target)
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
    stocks,
    crypto,
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
