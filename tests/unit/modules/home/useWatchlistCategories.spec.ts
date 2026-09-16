import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

const CATEGORIES = [
  { id: 'STOCK:Equities', type: 'STOCK', label: 'Equities', marketCap: 1, volume24h: 1, assetCount: 392 }, // prettier-ignore
  { id: 'CRYPTO:stablecoins', type: 'CRYPTO', label: 'stablecoins', marketCap: 1, volume24h: 1, assetCount: 343 }, // prettier-ignore
]
const calls: string[] = []
// When set, json() enqueues its resolver here instead of resolving immediately,
// so a test can resolve overlapping requests out of order.
let pending: Array<(cats: unknown) => void> | null = null
vi.mock('@/composables/useFetchMewApi', () => ({
  useFetchMewApi: () => ({
    useMEWFetch: (url: string) => {
      calls.push(String(url))
      return {
        get: () => ({
          json: () =>
            pending
              ? new Promise(resolve => {
                  pending!.push(cats => resolve({ data: ref(cats) }))
                })
              : Promise.resolve({ data: ref(CATEGORIES) }),
        }),
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
    const inFlight = fetchCategories(['STOCK'])
    expect(isLoading.value).toBe(true)
    await inFlight
    expect(isLoading.value).toBe(false)
  })

  it('ignores a stale response that resolves after a newer request', async () => {
    pending = []
    const { categories, fetchCategories } = useWatchlistCategories()
    const stockReq = fetchCategories(['STOCK']) // older → pending[0]
    const cryptoReq = fetchCategories(['CRYPTO']) // newer → pending[1]
    const STOCK_CATS = [{ id: 'STOCK:Equities' }]
    const CRYPTO_CATS = [{ id: 'CRYPTO:stablecoins' }]
    // Resolve the newest first, then the stale one — the stale write must lose.
    pending[1](CRYPTO_CATS)
    pending[0](STOCK_CATS)
    await Promise.all([stockReq, cryptoReq])
    expect(categories.value).toEqual(CRYPTO_CATS)
    pending = null
  })
})
