// src/modules/global_search/composables/useGlobalSearch.ts
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useGlobalSearchStore } from '@/stores/globalSearchStore'
import {
  ROUTES_MAIN,
  STOCK_INFO_ROUTE_NAMES,
  TOKEN_INFO_ROUTE_NAMES,
} from '@/router/routeNames'
import { analytics, GlobalSearchEvent, GlobalSearchCategory } from '@/analytics'
import type { SearchResultItem } from '../types'

type RouteKey = keyof typeof STOCK_INFO_ROUTE_NAMES

const PARENT_ROUTE_KEY_MAP: Record<string, RouteKey> = {
  [ROUTES_MAIN.HOME.NAME]: 'home',
  [ROUTES_MAIN.CRYPTO.NAME]: 'crypto',
  [ROUTES_MAIN.STOCKS.NAME]: 'stocks',
  [ROUTES_MAIN.EARN.NAME]: 'earn',
  [ROUTES_MAIN.VERIFY_MESSAGE.NAME]: 'verify',
  [ROUTES_MAIN.SIGN_MESSAGE.NAME]: 'sign',
}

/**
 * The global search popover. State and fetching live in `globalSearchStore`;
 * what stays here is the part that needs a caller's setup context — the router,
 * and the navigation `selectAsset` performs with it.
 */
export function useGlobalSearch() {
  const router = useRouter()
  const store = useGlobalSearchStore()
  const {
    isOpen,
    query,
    debouncedQuery,
    stocks,
    crypto,
    isLoadingStocks,
    isLoadingCrypto,
    recentlyViewedTop6,
  } = storeToRefs(store)

  const parentKey = computed(() => {
    const parent = router.currentRoute.value.matched[0]?.name
    return typeof parent === 'string'
      ? PARENT_ROUTE_KEY_MAP[parent] ?? null
      : null
  })

  const selectAsset = (item: SearchResultItem, isRecent = false) => {
    analytics.trackGlobalSearchSelectTokenEvent(
      GlobalSearchEvent.SELECT_TOKEN,
      {
        symbol: item.symbol,
        name: item.name,
        category: item.isStock
          ? GlobalSearchCategory.STOCK
          : GlobalSearchCategory.CRYPTO,
        isRecent,
      },
    )
    const key = parentKey.value
    const target = item.isStock
      ? {
          name: key
            ? STOCK_INFO_ROUTE_NAMES[key]
            : STOCK_INFO_ROUTE_NAMES.stocks,
          params: { symbol: item.symbol },
        }
      : {
          name: key
            ? TOKEN_INFO_ROUTE_NAMES[key]
            : TOKEN_INFO_ROUTE_NAMES.crypto,
          params: { tokenId: item.id },
        }
    router.push(target)
    store.addRecentlyViewed(item)
    store.close()
  }

  return {
    isOpen,
    query,
    debouncedQuery,
    stocks,
    crypto,
    isLoadingStocks,
    isLoadingCrypto,
    // Plain reactive object, not a ref — read it as `expanded.stocks`, the same
    // as before.
    expanded: store.expanded,
    toggleExpand: store.toggleExpand,
    recentlyViewedTop6,
    open: store.open,
    close: store.close,
    selectAsset,
  }
}
