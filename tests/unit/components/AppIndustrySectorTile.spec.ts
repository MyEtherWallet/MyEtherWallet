import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import AppIndustrySectorTile from '@/components/AppIndustrySectorTile.vue'

describe('AppIndustrySectorTile', () => {
  const mountIt = (props = {}) =>
    mount(AppIndustrySectorTile, {
      props: { label: 'Technology', to: '/stocks?sector=Technology', ...props },
      global: { stubs: { RouterLink: RouterLinkStub } },
    })

  it('renders the label', () => {
    const w = mountIt()
    expect(w.get('[data-test="sector-label"]').text()).toBe('Technology')
  })

  it('renders as a RouterLink using `to`', () => {
    const w = mountIt()
    expect(w.get('[data-test="sector-tile"]').exists()).toBe(true)
    expect(w.getComponent(RouterLinkStub).props('to')).toEqual('/stocks?sector=Technology')
  })

  it('accepts an object `to` (as produced by sectorLink)', () => {
    const to = { path: '/crypto', query: { sector: 'DeFi' } }
    const w = mountIt({ to })
    expect(w.getComponent(RouterLinkStub).props('to')).toEqual(to)
  })

  it('renders count when provided', () => {
    const w = mountIt({ count: 147 })
    expect(w.text()).toContain('147')
  })

  it('renders as a plain div (not RouterLink) when `to` is unset', () => {
    const w = mountIt({ to: undefined })
    expect(w.findComponent(RouterLinkStub).exists()).toBe(false)
    expect(w.get('[data-test="sector-tile"]').exists()).toBe(true)
  })
})
