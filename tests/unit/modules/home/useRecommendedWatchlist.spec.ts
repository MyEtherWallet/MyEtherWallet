import { describe, it, expect, vi } from 'vitest'

// The composable pulls in useFetchMewApi (Sentry + env). Stub it so the spec
// exercises the mock-fallback path without a real network layer.
vi.mock('@/composables/useFetchMewApi', () => ({
  useFetchMewApi: () => ({ useMEWFetch: vi.fn() }),
}))

const { useRecommendedWatchlist } = await import(
  '@/modules/home/composables/useRecommendedWatchlist'
)
const { MOCK_RECOMMENDED_ASSETS } = await import(
  '@/modules/home/components/watchlistOnboarding'
)

describe('useRecommendedWatchlist (MEW-2130)', () => {
  it('starts empty and not loading', () => {
    const { assets, isLoading } = useRecommendedWatchlist()
    expect(assets.value).toEqual([])
    expect(isLoading.value).toBe(false)
  })

  it('populates assets from the mock while the endpoint is not ready', async () => {
    const { assets, isLoading, fetchRecommendations } =
      useRecommendedWatchlist()
    await fetchRecommendations(['crypto'], ['ai'])
    expect(assets.value).toEqual(MOCK_RECOMMENDED_ASSETS)
    expect(isLoading.value).toBe(false)
  })

  it('flips isLoading true while fetching then false when done', async () => {
    const { isLoading, fetchRecommendations } = useRecommendedWatchlist()
    const pending = fetchRecommendations(['crypto'], ['ai'])
    expect(isLoading.value).toBe(true)
    await pending
    expect(isLoading.value).toBe(false)
  })

  it('every mock asset carries a type and a watchlistId', () => {
    for (const a of MOCK_RECOMMENDED_ASSETS) {
      expect(['crypto', 'stock', 'perp']).toContain(a.type)
      expect(a.watchlistId.length).toBeGreaterThan(0)
    }
  })
})
