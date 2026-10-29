import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { useFetchWatchlist } from '@/composables/useFetchWatchlist'
import { useWatchlistStore } from '@/stores/watchlistTableStore'

// Real createFetch, stubbed network: the watchlist endpoint returns an array;
// anything else (e.g. the bare API root) answers like the API does for an
// unknown path — a JSON object, not a list.
const fetchMock = vi.fn((url: string) => {
  const body = url.includes('/pages/stocks/watchlist')
    ? [{ primaryMarket: { symbol: 'AAPL' } }]
    : { message: 'Not Found' }
  const status = Array.isArray(body) ? 200 : 404
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    }),
  )
})

describe('useFetchWatchlist', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    fetchMock.mockClear()
    vi.stubGlobal('fetch', fetchMock)
  })
  afterEach(() => vi.unstubAllGlobals())

  it('does not fetch when a bucket empties, so its data stays a list', async () => {
    const store = useWatchlistStore()
    store.watchListedStocks = ['AAPL']
    const { stocksWatchlistData, fetchAllWatchlist } = useFetchWatchlist(
      ref(null),
    )
    fetchAllWatchlist()
    await flushPromises()
    expect(stocksWatchlistData.value).toEqual([
      { primaryMarket: { symbol: 'AAPL' } },
    ])

    // Removing the last stock empties the URL; refetch must not hit the API
    // root (whose error body would land in `data` and break `.map` callers).
    fetchMock.mockClear()
    store.watchListedStocks = []
    await flushPromises()
    expect(fetchMock).not.toHaveBeenCalled()
    expect(Array.isArray(stocksWatchlistData.value)).toBe(true)
  })
})
