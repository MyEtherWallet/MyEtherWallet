import { describe, it, expect } from 'vitest'
import { sectors, sectorLink } from '@/modules/home/sectors'

describe('sectors', () => {
  it('exposes the 10 All-Stocks table categories in order', () => {
    const filters = sectors.filter(s => s.market === 'stocks').map(s => s.filter)
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
    const filters = sectors.filter(s => s.market === 'crypto').map(s => s.filter)
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
      .filter(s => s.market === 'stocks')
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
    const s = sectors.find(x => x.market === 'stocks')!
    const link = sectorLink(s)
    expect(link.path).toBe('/stocks')
    expect(link.query.category).toBe(s.filter)
  })

  it('deep-links a crypto tile to /crypto with the category query param', () => {
    const s = sectors.find(x => x.market === 'crypto')!
    const link = sectorLink(s)
    expect(link.path).toBe('/crypto')
    expect(link.query.category).toBe(s.filter)
  })
})
