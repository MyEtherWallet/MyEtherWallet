// src/modules/global-search/composables/useGlobalSearch.ts
import { ref, computed, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useRecentlyViewedTokensStore } from '@/stores/recentlyViewedTokensStore'
import { STOCK_INFO_ROUTE_NAMES } from '@/router/routeNames'
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
const updateDebouncedQuery = useDebounceFn((q: string) => {
  debouncedQuery.value = q
}, DEBOUNCE_MS)

watch(query, q => updateDebouncedQuery(q))

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
