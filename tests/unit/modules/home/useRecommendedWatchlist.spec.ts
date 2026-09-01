import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

// Keep the perps SDK out of the module graph (pulled transitively through
// useAssetPicker's mappers) and stub the fetch layer with canned table data.
vi.mock('@/modules/perps/composables/usePerpsMarkets', () => ({
  usePerpsContracts: () => ({ contracts: { value: [] } }),
  usePerpsMarkets: () => ({ markets: { value: [] } }),
}))
vi.mock('@/modules/perps/utils/market', () => ({
  getLogoUrl: (base: string) => `logo-${base}`,
}))

const CRYPTO = [
  { coinId: 'ethereum', symbol: 'ETH', name: 'Ethereum', logoUrl: 'eth.png', ondo: null }, // prettier-ignore
  { coinId: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', logoUrl: 'btc.png', ondo: null }, // prettier-ignore
]
const STOCKS = [
  { primaryMarket: { symbol: 'AAPL' }, underlyingMarket: { name: 'Apple' }, iconPngUrl: 'aapl.png', iconSvgUrl: '' }, // prettier-ignore
]
const calls: string[] = []
vi.mock('@/composables/useFetchMewApi', () => ({
  useFetchMewApi: () => ({
    useMEWFetch: (url: string) => {
      calls.push(String(url))
      return {
        get: () => ({
          json: () =>
            Promise.resolve({
              data: ref({
                items: String(url).includes('stocks') ? STOCKS : CRYPTO,
              }),
            }),
        }),
      }
    },
  }),
}))

const { useRecommendedWatchlist } = await import(
  '@/modules/home/composables/useRecommendedWatchlist'
)

const ids = (assets: { watchlistId: string }[]) =>
  assets.map(a => a.watchlistId)

describe('useRecommendedWatchlist (MEW-2130)', () => {
  beforeEach(() => {
    calls.length = 0
  })

  it('starts empty and not loading', () => {
    const { assets, isLoading } = useRecommendedWatchlist()
    expect(assets.value).toEqual([])
    expect(isLoading.value).toBe(false)
  })

  it('crypto only → fetches the tokens table, not stocks', async () => {
    const { assets, fetchRecommendations } = useRecommendedWatchlist()
    await fetchRecommendations(['crypto'], [])
    expect(ids(assets.value)).toEqual(['ethereum', 'bitcoin'])
    expect(calls.some(u => u.includes('stocks'))).toBe(false)
  })

  it('stocks only → fetches the stocks table, not tokens', async () => {
    const { assets, fetchRecommendations } = useRecommendedWatchlist()
    await fetchRecommendations(['stocks'], [])
    expect(ids(assets.value)).toEqual(['AAPL'])
    expect(calls.some(u => u.includes('tokens-table'))).toBe(false)
  })

  it('both selected → combines stocks then crypto', async () => {
    const { assets, fetchRecommendations } = useRecommendedWatchlist()
    await fetchRecommendations(['crypto', 'stocks'], [])
    expect(ids(assets.value)).toEqual(['AAPL', 'ethereum', 'bitcoin'])
  })

  it('no markets (skipped) → shows both, unfiltered', async () => {
    const { assets, fetchRecommendations } = useRecommendedWatchlist()
    await fetchRecommendations([], [])
    expect(ids(assets.value)).toEqual(['AAPL', 'ethereum', 'bitcoin'])
  })

  it('flips isLoading true while fetching then false when done', async () => {
    const { isLoading, fetchRecommendations } = useRecommendedWatchlist()
    const pending = fetchRecommendations(['crypto'], [])
    expect(isLoading.value).toBe(true)
    await pending
    expect(isLoading.value).toBe(false)
  })

  it('every returned asset carries a type and a watchlistId', async () => {
    const { assets, fetchRecommendations } = useRecommendedWatchlist()
    await fetchRecommendations([], [])
    for (const a of assets.value) {
      expect(['crypto', 'stock', 'perp']).toContain(a.type)
      expect(a.watchlistId.length).toBeGreaterThan(0)
    }
  })
})
