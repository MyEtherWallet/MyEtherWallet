import { describe, it, expect } from 'vitest'
import { sectors, sectorLink } from '@/modules/home/sectors'

describe('sectors', () => {
  it('exposes the 10 All-Stocks table categories in order', () => {
    const filters = sectors
      .filter(s => s.market === 'stocks' && s.filter)
      .map(s => s.filter)
    expect(filters).toEqual([
      'EQUITIES',
      'STOCK',
      'LARGE_CAP',
      'US',
      'GROWTH',
      'TECHNOLOGY',
      'ETF',
      'VALUE',
      'SMALL_CAP',
      'INDUSTRIALS',
    ])
  })

  it('exposes the 6 live crypto filter categories (no watchlist)', () => {
    const filters = sectors
      .filter(s => s.market === 'crypto')
      .map(s => s.filter)
    expect(filters).toEqual([
      'topGainers',
      'topLosers',
      'stablecoins',
      'defi-index',
      'meme-token',
      'tiktok-meme',
    ])
  })

  it('reuses the page category labels and gives every tile a color and icon', () => {
    sectors
      .filter(s => s.market === 'stocks' && s.filter)
      .forEach(s => expect(s.labelKey).toMatch(/^stocks\.category_/))
    sectors
      .filter(s => s.market === 'crypto')
      .forEach(s => expect(s.labelKey).toMatch(/^crypto\./))
    sectors.forEach(s => {
      expect(s.color).toMatch(/^#[0-9a-f]{6}$/i)
      expect(s.icon).toBeTruthy()
    })
  })

  it('deep-links a stock tile to /stocks with the category query param', () => {
    const s = sectors.find(x => x.market === 'stocks' && x.filter)!
    const link = sectorLink(s)
    expect(link.path).toBe('/stocks')
    expect(link.query?.category).toBe(s.filter)
  })

  it('deep-links a crypto tile to /crypto with the category query param', () => {
    const s = sectors.find(x => x.market === 'crypto')!
    const link = sectorLink(s)
    expect(link.path).toBe('/crypto')
    expect(link.query?.category).toBe(s.filter)
  })

  // Ondo Intelligent Portfolios is a section on /stocks (ModuleOip.vue), not a
  // row in the All-Stocks table, so its tile anchors instead of filtering.
  it('anchors the Ondo Intelligent Portfolios tile at the OIP section', () => {
    const s = sectors.find(x => x.id === 'stocks-oip')!
    expect(s.market).toBe('stocks')
    expect(s.filter).toBeUndefined()
    expect(sectorLink(s)).toEqual({ path: '/stocks', hash: '#oip' })
  })

  it('gives every stocks tile either a table filter or a section anchor', () => {
    sectors
      .filter(s => s.market === 'stocks')
      .forEach(s => expect(Boolean(s.filter) !== Boolean(s.hash)).toBe(true))
  })
})
