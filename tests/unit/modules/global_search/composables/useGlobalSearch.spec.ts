// tests/unit/composables/useGlobalSearch.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { nextTick, ref } from 'vue'
import { useRecentlyViewedTokensStore } from '@/stores/recentlyViewedTokensStore'

const pushMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

// Module-level fetch state, shared between the composable under test and the
// test bodies. The composable destructures these refs from useFetchMewApi /
// useMEWFetch and watches them. Tests push values into them to simulate API
// responses without hitting the network.
const stocksData = ref<unknown>(null)
const cryptoData = ref<unknown>(null)
const stocksIsFetching = ref(false)
const cryptoIsFetching = ref(false)
const stocksExecute = vi.fn()
const cryptoExecute = vi.fn()

vi.mock('@/composables/useFetchMewApi', () => {
  // useFetchMewApi is called once per fetch consumer at module scope. The
  // composable creates stocks first, then crypto, so we hand back two
  // different useMEWFetch implementations in that order.
  const queue: Array<() => unknown> = [
    // stocks
    () => ({
      get: () => ({
        json: () => ({
          data: stocksData,
          isFetching: stocksIsFetching,
          execute: stocksExecute,
        }),
      }),
    }),
    // crypto
    () => ({
      get: () => ({
        json: () => ({
          data: cryptoData,
          isFetching: cryptoIsFetching,
          execute: cryptoExecute,
        }),
      }),
    }),
  ]
  return {
    useFetchMewApi: () => ({
      useMEWFetch: () => {
        const next = queue.shift()
        if (!next) {
          throw new Error('useMEWFetch called more times than expected')
        }
        return next()
      },
    }),
  }
})

// Import after mocks are set up.
const { useGlobalSearch } = await import(
  '@/modules/global_search/composables/useGlobalSearch'
)

describe('useGlobalSearch', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    pushMock.mockReset()
    stocksExecute.mockReset()
    cryptoExecute.mockReset()
    stocksData.value = null
    cryptoData.value = null
    stocksIsFetching.value = false
    cryptoIsFetching.value = false
    const { close } = useGlobalSearch()
    close()
  })

  it('debounces query updates by the configured window', async () => {
    vi.useFakeTimers()
    const { query, debouncedQuery } = useGlobalSearch()
    query.value = 'a'
    query.value = 'ab'
    query.value = 'abc'
    await nextTick()
    expect(debouncedQuery.value).toBe('')
    vi.advanceTimersByTime(180)
    await nextTick()
    expect(debouncedQuery.value).toBe('abc')
    vi.useRealTimers()
  })

  it('selectAsset routes stocks via STOCK_INFO_ROUTE_NAMES.stocks', () => {
    const { selectAsset } = useGlobalSearch()
    selectAsset({
      id: 'AAPL',
      symbol: 'AAPL',
      name: 'Apple',
      priceUsd: 200,
      change24hPct: 1,
      isStock: true,
    })
    expect(pushMock).toHaveBeenCalledWith({
      name: 'stocks-stock-info',
      params: { symbol: 'AAPL' },
    })
  })

  it('selectAsset routes crypto via STOCK_INFO_ROUTE_NAMES.crypto', () => {
    const { selectAsset } = useGlobalSearch()
    selectAsset({
      id: 'eth',
      symbol: 'ETH',
      name: 'Ethereum',
      priceUsd: 3000,
      change24hPct: 2,
      isStock: false,
    })
    expect(pushMock).toHaveBeenCalledWith({
      name: 'crypto-stock-info',
      params: { symbol: 'ETH' },
    })
  })

  it('selectAsset records to recentlyViewedTokensStore, closes popover, and clears cached results', async () => {
    const store = useRecentlyViewedTokensStore()
    const { selectAsset, isOpen, open, stocks, crypto } = useGlobalSearch()
    open()
    expect(isOpen.value).toBe(true)
    // Simulate a successful fetch having populated the cache before selection.
    stocks.value = [
      {
        id: 'AAPL',
        symbol: 'AAPL',
        name: 'Apple',
        priceUsd: 200,
        change24hPct: 1,
        isStock: true,
      },
    ]
    crypto.value = [
      {
        id: 'eth',
        symbol: 'ETH',
        name: 'Ethereum',
        priceUsd: 3000,
        change24hPct: 2,
        isStock: false,
      },
    ]
    selectAsset({
      id: 'AAPL',
      symbol: 'AAPL',
      name: 'Apple',
      priceUsd: 200,
      change24hPct: 1,
      isStock: true,
    })
    expect(store.recentlyViewedTokens[0]).toMatchObject({
      id: 'AAPL',
      symbol: 'AAPL',
      isStock: true,
    })
    expect(isOpen.value).toBe(false)
    // close() must fully reset singleton state so a re-open starts clean.
    expect(stocks.value).toEqual([])
    expect(crypto.value).toEqual([])
  })

  it('toggleExpand flips the per-section flag', () => {
    const { expanded, toggleExpand } = useGlobalSearch()
    expect(expanded.stocks).toBe(false)
    toggleExpand('stocks')
    expect(expanded.stocks).toBe(true)
    expect(expanded.crypto).toBe(false)
  })

  it('recentlyViewedTop6 returns first 6 from the store, mixed', () => {
    const store = useRecentlyViewedTokensStore()
    for (let i = 0; i < 8; i++) {
      store.addToken({
        id: `id-${i}`,
        symbol: `S${i}`,
        name: `N${i}`,
        isStock: i % 2 === 0,
      })
    }
    const { recentlyViewedTop6 } = useGlobalSearch()
    expect(recentlyViewedTop6.value).toHaveLength(6)
    expect(recentlyViewedTop6.value[0].symbol).toBe('S7')
  })

  it('does not fetch at import time and only fetches when the popover opens', async () => {
    // The mocks were created at module-import time, so any module-scope fetch
    // call would already show here. Asserting zero calls after import is the
    // strongest evidence that fetches are no longer eager.
    expect(stocksExecute).not.toHaveBeenCalled()
    expect(cryptoExecute).not.toHaveBeenCalled()

    const { open } = useGlobalSearch()
    open()
    await nextTick()

    expect(stocksExecute).toHaveBeenCalled()
    expect(cryptoExecute).toHaveBeenCalled()
  })

  it('open() triggers exactly one fetch per endpoint (no double-execute)', async () => {
    const { open } = useGlobalSearch()
    stocksExecute.mockReset()
    cryptoExecute.mockReset()
    open()
    await nextTick()
    expect(stocksExecute).toHaveBeenCalledTimes(1)
    expect(cryptoExecute).toHaveBeenCalledTimes(1)
  })

  it('filters out Ondo-flagged crypto items from the mapped crypto list', async () => {
    const { open, crypto } = useGlobalSearch()
    open()
    await nextTick()

    cryptoData.value = {
      items: [
        {
          coinId: 'eth',
          symbol: 'ETH',
          name: 'Ethereum',
          logoUrl: null,
          price: 3000,
          priceChangePercentage24h: 1.5,
          ondo: null,
        },
        {
          coinId: 'ondo-token',
          symbol: 'OND',
          name: 'OndoCoin',
          logoUrl: null,
          price: 1,
          priceChangePercentage24h: 0,
          // Items flagged with any ondo metadata must be filtered out so the
          // global search popover never surfaces them.
          ondo: { foo: 'bar' },
        },
        {
          coinId: 'btc',
          symbol: 'BTC',
          name: 'Bitcoin',
          logoUrl: null,
          price: 60000,
          priceChangePercentage24h: -0.2,
          ondo: null,
        },
      ],
    }
    await nextTick()

    const symbols = crypto.value.map(c => c.symbol)
    expect(symbols).toEqual(['ETH', 'BTC'])
    expect(symbols).not.toContain('OND')
  })
})
