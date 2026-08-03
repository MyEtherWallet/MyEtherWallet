import { describe, it, expect } from 'vitest'
import { sectors, sectorLink } from '@/modules/home/sectors'

describe('sectors', () => {
  it('exposes the Figma stock sector tiles', () => {
    const filters = sectors.filter(s => s.market === 'stocks').map(s => s.filter)
    expect(filters).toEqual([
      '24/7 RWAs',
      'Consumer',
      'ETFs',
      'Financials',
      'Growth',
      'Technology',
      'Value',
      'Commodities',
    ])
  })

  it('exposes 6 crypto sectors', () => {
    const filters = sectors.filter(s => s.market === 'crypto').map(s => s.filter)
    expect(filters.length).toBe(6)
  })

  it('gives every sector a namespaced labelKey, a color and an icon', () => {
    sectors.forEach(s => {
      expect(s.labelKey).toMatch(/^homePage\.sectors\.labels\./)
      expect(s.color).toMatch(/^#[0-9a-f]{6}$/i)
      expect(s.icon).toBeTruthy()
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
