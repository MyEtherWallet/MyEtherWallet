import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

// Canned /watchlist/assets response; the fetch layer is stubbed.
const ASSETS = [
  { id: 'STOCK:AAPLon', type: 'STOCK', symbol: 'AAPLon', name: 'Apple Inc.', iconUrl: 'a.png' }, // prettier-ignore
  { id: 'CRYPTO:tether', type: 'CRYPTO', symbol: 'usdt', name: 'Tether', iconUrl: 't.png' }, // prettier-ignore
]
const calls: string[] = []
vi.mock('@/composables/useFetchMewApi', () => ({
  useFetchMewApi: () => ({
    useMEWFetch: (url: string) => {
      calls.push(String(url))
      return { get: () => ({ json: () => Promise.resolve({ data: ref(ASSETS) }) }) }
    },
  }),
}))

const { useRecommendedWatchlist } = await import(
  '@/modules/home/composables/useRecommendedWatchlist'
)

describe('useRecommendedWatchlist (MEW-2130)', () => {
  beforeEach(() => {
    calls.length = 0
  })

  it('starts empty and not loading', () => {
    const { assets, isLoading } = useRecommendedWatchlist()
    expect(assets.value).toEqual([])
    expect(isLoading.value).toBe(false)
  })

  it('no categories → no fetch, empty assets', async () => {
    const { assets, fetchRecommendations } = useRecommendedWatchlist()
    await fetchRecommendations([])
    expect(assets.value).toEqual([])
    expect(calls.length).toBe(0)
  })

  it('fetches the assets endpoint and maps id → type + watchlistId', async () => {
    const { assets, fetchRecommendations } = useRecommendedWatchlist()
    await fetchRecommendations(['STOCK:Equities', 'CRYPTO:stablecoins'])
    expect(calls[0]).toContain('/v1/web/watchlist/assets?categories=')
    expect(calls[0]).toContain(
      encodeURIComponent('STOCK:Equities,CRYPTO:stablecoins'),
    )
    expect(assets.value).toEqual([
      { id: 'STOCK:AAPLon', symbol: 'AAPLon', name: 'Apple Inc.', logoUrl: 'a.png', type: 'stock', watchlistId: 'AAPLon' }, // prettier-ignore
      { id: 'CRYPTO:tether', symbol: 'usdt', name: 'Tether', logoUrl: 't.png', type: 'crypto', watchlistId: 'tether' }, // prettier-ignore
    ])
  })

  it('flips isLoading true while fetching then false when done', async () => {
    const { isLoading, fetchRecommendations } = useRecommendedWatchlist()
    const pending = fetchRecommendations(['STOCK:Equities'])
    expect(isLoading.value).toBe(true)
    await pending
    expect(isLoading.value).toBe(false)
  })
})
