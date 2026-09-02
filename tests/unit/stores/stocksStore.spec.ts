import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { ref, type Ref } from 'vue'

// Keep the real fetch layer (Sentry, configs, network) out of the graph and
// expose each endpoint's `data` ref by URL so the test can inject a response.
const dataByUrl: Record<string, Ref<unknown>> = {}

vi.mock('@/composables/useFetchMewApi', () => ({
  useFetchMewApi: () => ({
    useMEWFetch: (url: unknown) => ({
      get: () => ({
        json: () => {
          const data = ref<unknown>(null)
          dataByUrl[typeof url === 'string' ? url : 'ref'] = data
          return {
            data,
            isFetching: ref(false),
            execute: vi.fn(),
            onFetchResponse: vi.fn(),
          }
        },
      }),
    }),
  }),
}))

import { useStocksStore } from '@/stores/stocksStore'

describe('stocksStore.stockIconBySymbol', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('maps a plain news ticker to a tokenized stock icon, png over svg, case-insensitive', () => {
    const store = useStocksStore()
    // Real shape: tradable symbols are Ondo-tokenized ("AAPLon"), stockAlias is
    // the full company name — news tickers are the plain underlying ("AAPL").
    dataByUrl['/v1/web/stocks/addresses'].value = [
      {
        symbol: 'AAPLon',
        stockAlias: 'Apple Inc',
        iconPngUrl: 'aapl.png',
        iconSvgUrl: 'aapl.svg',
        addresses: [],
      },
      { symbol: 'GOOGLon', stockAlias: 'Alphabet', iconSvgUrl: 'googl.svg', addresses: [] },
    ]

    expect(store.stockIconBySymbol('AAPL')).toBe('aapl.png')
    expect(store.stockIconBySymbol('googl')).toBe('googl.svg')
    // An already-tokenized ticker still resolves.
    expect(store.stockIconBySymbol('AAPLon')).toBe('aapl.png')
  })

  it('returns undefined for an unknown or missing symbol', () => {
    const store = useStocksStore()
    dataByUrl['/v1/web/stocks/addresses'].value = [
      { symbol: 'AAPLon', iconPngUrl: 'aapl.png', addresses: [] },
    ]

    expect(store.stockIconBySymbol('TSLA')).toBeUndefined()
    expect(store.stockIconBySymbol()).toBeUndefined()
  })
})
