import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

const CATEGORIES = [
  { id: 'STOCK:Equities', type: 'STOCK', label: 'Equities', marketCap: 1, volume24h: 1, assetCount: 392 }, // prettier-ignore
  { id: 'CRYPTO:stablecoins', type: 'CRYPTO', label: 'stablecoins', marketCap: 1, volume24h: 1, assetCount: 343 }, // prettier-ignore
]
const calls: string[] = []
vi.mock('@/composables/useFetchMewApi', () => ({
  useFetchMewApi: () => ({
    useMEWFetch: (url: string) => {
      calls.push(String(url))
      return {
        get: () => ({ json: () => Promise.resolve({ data: ref(CATEGORIES) }) }),
      }
    },
  }),
}))

const { useWatchlistCategories, marketsToTypes } = await import(
  '@/modules/home/composables/useWatchlistCategories'
)

describe('useWatchlistCategories (MEW-2130)', () => {
  beforeEach(() => {
    calls.length = 0
  })

  it('maps step-1 markets to API types', () => {
    expect(marketsToTypes(['crypto'])).toEqual(['CRYPTO'])
    expect(marketsToTypes(['stocks'])).toEqual(['STOCK'])
    expect(marketsToTypes(['crypto', 'stocks'])).toEqual(['STOCK', 'CRYPTO'])
    expect(marketsToTypes([])).toEqual(['STOCK', 'CRYPTO'])
  })

  it('fetches the categories endpoint for the given types', async () => {
    const { categories, fetchCategories } = useWatchlistCategories()
    const result = await fetchCategories(['STOCK', 'CRYPTO'])
    expect(calls[0]).toBe(
      '/v1/web/watchlist/categories?types=STOCK,CRYPTO',
    )
    expect(categories.value).toEqual(CATEGORIES)
    expect(result).toEqual(CATEGORIES)
  })

  it('flips isLoading true while fetching then false when done', async () => {
    const { isLoading, fetchCategories } = useWatchlistCategories()
    const pending = fetchCategories(['STOCK'])
    expect(isLoading.value).toBe(true)
    await pending
    expect(isLoading.value).toBe(false)
  })
})
