import { describe, it, expect } from 'vitest'
import { sectors, sectorLink } from '@/modules/home/sectors'

describe('sectors', () => {
  it('exposes the researched stock categories', () => {
    const filters = sectors.filter(s => s.market === 'stocks').map(s => s.filter)
    expect(filters).toEqual(
      expect.arrayContaining([
        'Equities',
        'Stock',
        'Large Cap',
        'US',
        'Growth',
        'Technology',
        'ETF',
        'Value',
        'Small Cap',
        'Industrials',
      ]),
    )
    expect(filters.length).toBe(10)
  })

  it('exposes 6 crypto categories', () => {
    const filters = sectors.filter(s => s.market === 'crypto').map(s => s.filter)
    expect(filters.length).toBe(6)
  })

  it('gives every sector a namespaced labelKey', () => {
    sectors.forEach(s => {
      expect(s.labelKey).toBe(`homePage.sectors.labels.${s.filter}`)
    })
  })

  it('builds a stocks deep-link with the sector query param', () => {
    const s = sectors.find(x => x.market === 'stocks')!
    const link = sectorLink(s)
    expect(link.path).toBe('/stocks')
    expect(link.query.sector).toBe(s.filter)
  })

  it('builds a crypto deep-link with the sector query param', () => {
    const s = sectors.find(x => x.market === 'crypto')!
    const link = sectorLink(s)
    expect(link.path).toBe('/crypto')
    expect(link.query.sector).toBe(s.filter)
  })
})
