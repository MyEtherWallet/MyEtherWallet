import { describe, it, expect, vi } from 'vitest'

// Keep the perps SDK (WS singleton) out of the module graph for this spec.
vi.mock('@/modules/perps/composables/usePerpsMarkets', () => ({
  usePerpsContracts: () => ({ contracts: { value: [] } }),
}))
vi.mock('@/modules/perps/utils/market', () => ({
  getLogoUrl: (base: string) => `logo-${base}`,
}))
// useCurrency → currencyStore → @/analytics (hardware SDK). Stub it out; the
// pure mappers take formatters by injection anyway.
vi.mock('@/composables/useCurrency', () => ({
  useCurrency: () => ({
    formatFiat: (v: unknown) => ({ display: `$${v}` }),
    formatFiatCompact: (v: unknown) => ({ display: `C${v}` }),
  }),
}))

const { mapTokenRow, mapStockRow, mapPerpRow, placeholderRow } = await import(
  '@/modules/home/composables/useWatchlistRows'
)
const { TOKEN_INFO_ROUTE_NAMES, STOCK_INFO_ROUTE_NAMES, PERP_INFO_ROUTE_NAME } =
  await import('@/router/routeNames')

const fmt = {
  fiat: (v: unknown) => `$${v}`,
  compact: (v: unknown) => `C${v}`,
}

describe('useWatchlistRows mappers (MEW-2130)', () => {
  it('maps a crypto token to a row', () => {
    const row = mapTokenRow(
      {
        coinId: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        logoUrl: 'eth.png',
        price: 3000,
        priceChangePercentage24h: 2.1,
        marketCap: 1_000_000_000,
        sparklineIn7d: [1, 2, 3],
      } as never,
      fmt,
    )
    expect(row).toMatchObject({
      key: 'token-ethereum',
      symbol: 'ETH',
      name: 'Ethereum',
      isStock: false,
      priceDisplay: '$3000',
      change: 2.1,
      marketValueDisplay: 'C1000000000',
      sparkline: [1, 2, 3],
      tradeSymbol: 'ETH',
      removeType: 'crypto',
      removeId: 'ethereum',
    })
    expect(row.route).toEqual({
      name: TOKEN_INFO_ROUTE_NAMES.home,
      params: { tokenId: 'ethereum' },
    })
  })

  it('maps a stock (string fields) to a row', () => {
    const row = mapStockRow(
      {
        iconPngUrl: 'aapl.png',
        primaryMarket: {
          symbol: 'AAPL',
          price: '256.72',
          priceChangePercentage24h: '2.87',
          sparkline24h: [4, 5, 6],
        },
        underlyingMarket: { name: 'Apple', marketCap: '178430000' },
      } as never,
      fmt,
    )
    expect(row).toMatchObject({
      key: 'stock-AAPL',
      symbol: 'AAPL',
      name: 'Apple',
      isStock: true,
      priceDisplay: '$256.72',
      change: 2.87,
      marketValueDisplay: 'C178430000',
      sparkline: [4, 5, 6],
      removeType: 'stock',
      removeId: 'AAPL',
    })
    expect(row.route).toEqual({
      name: STOCK_INFO_ROUTE_NAMES.home,
      params: { symbol: 'AAPL' },
    })
  })

  it('maps a perp contract (string sparkline → numbers, volume as market value)', () => {
    const row = mapPerpRow(
      {
        market: 'BTC-USD',
        baseCurrency: 'BTC',
        disabled: false,
        lastPrice: '60000',
        priceChangePercent: '-1.2',
        usdVolume: '5780000000',
        sparkline: { price: ['1', '2', '3'] },
      } as never,
      fmt,
    )
    expect(row).toMatchObject({
      key: 'perp-BTC',
      symbol: 'BTC',
      isStock: false,
      priceDisplay: '$60000',
      change: -1.2,
      marketValueDisplay: 'C5780000000',
      sparkline: [1, 2, 3],
      logoUrl: 'logo-BTC',
      tradeSymbol: 'BTC-USD',
      removeType: 'perp',
      removeId: 'BTC',
    })
    expect(row.route).toEqual({
      name: PERP_INFO_ROUTE_NAME,
      params: { market: 'BTC-USD' },
    })
  })

  it('placeholderRow keeps the loaded row key so it hydrates in place', () => {
    // Same key as mapTokenRow(coinId=ethereum) → Vue reuses the DOM node.
    const p = placeholderRow('crypto', 'ethereum')
    expect(p.key).toBe('token-ethereum')
    expect(p).toMatchObject({
      loading: true,
      isStock: false,
      removeType: 'crypto',
      removeId: 'ethereum',
    })
    expect(placeholderRow('stock', 'AAPL').key).toBe('stock-AAPL')
    expect(placeholderRow('perp', 'BTC').key).toBe('perp-BTC')
  })
})
