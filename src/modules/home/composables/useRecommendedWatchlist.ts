import { ref, type Ref } from 'vue'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import type { RecommendedAsset } from '@/modules/home/components/watchlistOnboarding'

/**
 * Recommended assets for the watchlist onboarding step 3 (MEW-2130). Fetches the
 * assets for the categories picked in step 2 (and the markets picked in step 1,
 * as the `types` param) from the backend `/watchlist/assets` endpoint; with no
 * categories/types (the skip path) it omits the params and the API returns the
 * full set. Either way the whole set is returned (no cap), so the step's search +
 * "show more" run client-side.
 *
 * The API asset id is `TYPE:watchlistId` ("STOCK:AAPLon" | "CRYPTO:tether"),
 * where the tail is exactly the id the watchlist store keys on (tokenized stock
 * symbol or coin id).
 */
interface RawWatchlistAsset {
  id: string
  type: 'STOCK' | 'CRYPTO'
  symbol: string
  name: string
  iconUrl?: string
}

const ASSETS_URL = '/v1/web/watchlist/assets'

const toRecommended = (a: RawWatchlistAsset): RecommendedAsset => ({
  id: a.id,
  symbol: a.symbol,
  name: a.name,
  logoUrl: a.iconUrl,
  type: a.type === 'STOCK' ? 'stock' : 'crypto',
  watchlistId: a.id.slice(a.id.indexOf(':') + 1),
})

export function useRecommendedWatchlist(): {
  assets: Ref<RecommendedAsset[]>
  isLoading: Ref<boolean>
  fetchRecommendations: (
    categoryIds?: string[],
    types?: string[],
  ) => Promise<void>
} {
  const { useMEWFetch } = useFetchMewApi()
  const assets = ref<RecommendedAsset[]>([])
  const isLoading = ref(false)
  // Guards against out-of-order responses (same rationale as useWatchlistCategories):
  // only the newest request writes assets/isLoading.
  let latestRequest = 0

  const fetchRecommendations = async (
    categoryIds: string[] = [],
    types: string[] = [],
  ) => {
    const requestId = ++latestRequest
    isLoading.value = true
    try {
      // `categories` narrows within a market; `types` (CRYPTO/STOCK from step 1)
      // scopes which markets to recommend. Send each only when present so the skip
      // path (no params) still returns the full set — never an empty `categories=`.
      const params = new URLSearchParams()
      if (categoryIds.length) params.set('categories', categoryIds.join(','))
      if (types.length) params.set('types', types.join(','))
      const query = params.toString()
      const url = query ? `${ASSETS_URL}?${query}` : ASSETS_URL
      const { data } = await useMEWFetch(url).get().json<RawWatchlistAsset[]>()
      if (requestId === latestRequest) assets.value = (data.value ?? []).map(toRecommended)
    } catch {
      if (requestId === latestRequest) assets.value = []
    } finally {
      if (requestId === latestRequest) isLoading.value = false
    }
  }

  return { assets, isLoading, fetchRecommendations }
}
