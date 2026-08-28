import { ref, type Ref } from 'vue'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import {
  MOCK_RECOMMENDED_ASSETS,
  type RecommendedAsset,
} from '@/modules/home/components/watchlistOnboarding'

/**
 * Flip to `true` once the backend recommendations endpoint ships. While false,
 * the composable returns MOCK_RECOMMENDED_ASSETS without a network call. Even
 * when true, any request failure falls back to the mock so the wizard never
 * dead-ends.
 */
const ENDPOINT_READY = false
const RECOMMENDATIONS_ENDPOINT = '/v1/web/watchlist/recommendations'

// ponytail: fake latency so the "Finding assets…" loading state is visible until
// the real endpoint ships. Skipped under vitest so specs stay fast.
const MOCK_DELAY_MS = import.meta.env.MODE === 'test' ? 0 : 1800

/**
 * Recommended assets for the watchlist onboarding wizard (MEW-2130). POSTs the
 * user's selected markets + industries and returns a list to follow. Mockable
 * until the backend is live.
 */
export function useRecommendedWatchlist(): {
  assets: Ref<RecommendedAsset[]>
  isLoading: Ref<boolean>
  fetchRecommendations: (
    markets: string[],
    industries: string[],
  ) => Promise<void>
} {
  const { useMEWFetch } = useFetchMewApi()
  const assets = ref<RecommendedAsset[]>([])
  const isLoading = ref(false)

  const fetchRecommendations = async (
    markets: string[],
    industries: string[],
  ) => {
    isLoading.value = true
    try {
      if (!ENDPOINT_READY) {
        await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS))
        assets.value = MOCK_RECOMMENDED_ASSETS
        return
      }
      const { data, error, execute } = useMEWFetch(RECOMMENDATIONS_ENDPOINT, {
        immediate: false,
      })
        .post({ markets, industries })
        .json<RecommendedAsset[]>()
      await execute()
      if (error.value || !data.value) throw error.value ?? new Error('no data')
      assets.value = data.value
    } catch {
      assets.value = MOCK_RECOMMENDED_ASSETS
    } finally {
      isLoading.value = false
    }
  }

  return { assets, isLoading, fetchRecommendations }
}
