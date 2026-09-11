import { ref, type Ref } from 'vue'
import { useFetchMewApi } from '@/composables/useFetchMewApi'

export type WatchlistMarketType = 'STOCK' | 'CRYPTO'

/** A curated category for the watchlist onboarding (step 2). `id` is the value
 * the assets endpoint reads from `?categories=` (e.g. "STOCK:Equities"). */
export interface WatchlistCategory {
  id: string
  type: WatchlistMarketType
  label: string
  marketCap: number
  volume24h: number
  assetCount: number
}

const CATEGORIES_URL = '/v1/web/watchlist/categories'

/** Maps the step-1 market ids to the API's market types. */
export const marketsToTypes = (markets: string[]): WatchlistMarketType[] => {
  const types: WatchlistMarketType[] = []
  if (markets.length === 0 || markets.includes('stocks')) types.push('STOCK')
  if (markets.length === 0 || markets.includes('crypto')) types.push('CRYPTO')
  return types
}

/**
 * Curated categories for the watchlist onboarding step 2 (MEW-2130). Fetches the
 * categories offered for the given market types; the ids feed the step-3 assets
 * fetch.
 */
export function useWatchlistCategories(): {
  categories: Ref<WatchlistCategory[]>
  isLoading: Ref<boolean>
  fetchCategories: (types: WatchlistMarketType[]) => Promise<WatchlistCategory[]>
} {
  const { useMEWFetch } = useFetchMewApi()
  const categories = ref<WatchlistCategory[]>([])
  const isLoading = ref(false)

  const fetchCategories = async (types: WatchlistMarketType[]) => {
    isLoading.value = true
    try {
      const url = `${CATEGORIES_URL}?types=${types.join(',')}`
      const { data } = await useMEWFetch(url).get().json<WatchlistCategory[]>()
      categories.value = data.value ?? []
    } catch {
      categories.value = []
    } finally {
      isLoading.value = false
    }
    return categories.value
  }

  return { categories, isLoading, fetchCategories }
}
