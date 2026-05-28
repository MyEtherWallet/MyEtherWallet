// tests/unit/composables/useGlobalSearch.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { nextTick } from 'vue'
import { useRecentlyViewedTokensStore } from '@/stores/recentlyViewedTokensStore'

const pushMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

// Import after mock is set up
const { useGlobalSearch } = await import(
  '@/modules/global-search/composables/useGlobalSearch'
)

const flush = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

describe('useGlobalSearch', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    pushMock.mockReset()
    const { close } = useGlobalSearch()
    close()
  })

  it('debounces query updates by 300ms', async () => {
    const { query, debouncedQuery } = useGlobalSearch()
    query.value = 'a'
    query.value = 'ab'
    query.value = 'abc'
    await nextTick()
    expect(debouncedQuery.value).toBe('')
    await flush(350)
    expect(debouncedQuery.value).toBe('abc')
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

  it('selectAsset records to recentlyViewedTokensStore and closes popover', () => {
    const store = useRecentlyViewedTokensStore()
    const { selectAsset, isOpen, open } = useGlobalSearch()
    open()
    expect(isOpen.value).toBe(true)
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
  })

  it('toggleExpand flips the per-section flag', () => {
    const { expanded, toggleExpand } = useGlobalSearch()
    expect(expanded.stocks.value).toBe(false)
    toggleExpand('stocks')
    expect(expanded.stocks.value).toBe(true)
    expect(expanded.crypto.value).toBe(false)
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
})
