import { describe, it, expect, vi } from 'vitest'

// Keep the perps SDK + fetch layer out of the module graph.
vi.mock('@/modules/perps/composables/usePerpsMarkets', () => ({
  usePerpsContracts: () => ({ contracts: { value: [] } }),
  usePerpsMarkets: () => ({ markets: { value: [] } }),
}))
vi.mock('@/modules/perps/utils/market', () => ({
  getLogoUrl: (base: string) => `logo-${base}`,
}))
vi.mock('@/composables/useFetchMewApi', () => ({
  useFetchMewApi: () => ({ useMEWFetch: vi.fn() }),
}))

const {
  mapCryptoItem,
  mapStockItem,
  mapPerpItem,
  matchesQuery,
  dedupeItems,
} = await import('@/modules/home/composables/useAssetPicker')

describe('useAssetPicker mappers (MEW-2130)', () => {
  it('maps a plain crypto token', () => {
    expect(
      mapCryptoItem({
        coinId: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        logoUrl: 'eth.png',
        ondo: null,
      } as never),
    ).toEqual({
      key: 'crypto-ethereum',
      symbol: 'ETH',
      name: 'Ethereum',
      logoUrl: 'eth.png',
      type: 'crypto',
      watchlistId: 'ethereum',
    })
  })

  it('maps an Ondo tokenized stock in the crypto table to the stock bucket', () => {
    expect(
      mapCryptoItem({
        coinId: 'apple-ondo',
        name: 'Apple xStock',
        symbol: 'AAPLon',
        logoUrl: 'aapl.png',
        ondo: { stockAlias: 'Apple', primaryMarket: { symbol: 'AAPL' } },
      } as never),
    ).toMatchObject({
      key: 'stock-AAPL',
      symbol: 'AAPLon',
      name: 'Apple',
      type: 'stock',
      watchlistId: 'AAPL',
    })
  })

  it('maps a stock', () => {
    expect(
      mapStockItem({
        iconPngUrl: 'p.png',
        primaryMarket: { symbol: 'NVDA' },
        underlyingMarket: { name: 'Nvidia Inc.' },
      } as never),
    ).toEqual({
      key: 'stock-NVDA',
      symbol: 'NVDA',
      name: 'Nvidia Inc.',
      logoUrl: 'p.png',
      type: 'stock',
      watchlistId: 'NVDA',
    })
  })

  it('maps a perp using the joined trading-pair name', () => {
    expect(
      mapPerpItem(
        { market: 'BTC-USD', baseCurrency: 'BTC' } as never,
        { longName: 'Bitcoin' } as never,
      ),
    ).toEqual({
      key: 'perp-BTC',
      symbol: 'BTC',
      name: 'Bitcoin',
      logoUrl: 'logo-BTC',
      type: 'perp',
      watchlistId: 'BTC',
    })
  })

  it('matchesQuery is case-insensitive over symbol + name and passes on empty', () => {
    const item = mapStockItem({
      iconPngUrl: '',
      primaryMarket: { symbol: 'AAPL' },
      underlyingMarket: { name: 'Apple' },
    } as never)
    expect(matchesQuery(item, '')).toBe(true)
    expect(matchesQuery(item, 'appl')).toBe(true)
    expect(matchesQuery(item, 'AAPL')).toBe(true)
    expect(matchesQuery(item, 'tesla')).toBe(false)
  })

  it('dedupeItems keeps the first occurrence per key', () => {
    const a = { key: 'stock-AAPL', symbol: 'AAPL' } as never
    const b = { key: 'stock-AAPL', symbol: 'AAPLon' } as never
    const c = { key: 'crypto-eth', symbol: 'ETH' } as never
    expect(dedupeItems([a, b, c])).toEqual([a, c])
  })
})
