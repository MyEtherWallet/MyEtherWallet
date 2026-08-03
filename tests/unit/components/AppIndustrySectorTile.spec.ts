import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { ClockIcon } from '@heroicons/vue/24/outline'
import AppIndustrySectorTile from '@/components/AppIndustrySectorTile.vue'

describe('AppIndustrySectorTile', () => {
  const mountIt = (props = {}) =>
    mount(AppIndustrySectorTile, {
      props: {
        label: 'Technology',
        color: '#4d1ee3',
        to: '/stocks?sector=Technology',
        ...props,
      },
      global: { stubs: { RouterLink: RouterLinkStub } },
    })

  it('renders the label', () => {
    expect(mountIt().get('[data-test="sector-label"]').text()).toBe('Technology')
  })

  it('applies the sector color as the tile background', () => {
    // rgb input avoids hex→rgb normalization ambiguity in jsdom.
    const tile = mountIt({ color: 'rgb(1, 2, 3)' }).get('[data-test="sector-tile"]')
    expect(tile.attributes('style')).toContain('background-color: rgb(1, 2, 3)')
  })

  it('renders the icon inside the bubble when provided', () => {
    const w = mountIt({ icon: ClockIcon })
    expect(w.findComponent(ClockIcon).exists()).toBe(true)
  })

  it('renders as a RouterLink using `to`', () => {
    const w = mountIt()
    expect(w.get('[data-test="sector-tile"]').exists()).toBe(true)
    expect(w.getComponent(RouterLinkStub).props('to')).toEqual(
      '/stocks?sector=Technology',
    )
  })

  it('accepts an object `to` (as produced by sectorLink)', () => {
    const to = { path: '/crypto', query: { sector: 'DeFi' } }
    expect(mountIt({ to }).getComponent(RouterLinkStub).props('to')).toEqual(to)
  })

  it('renders as a plain div (not RouterLink) when `to` is unset', () => {
    const w = mountIt({ to: undefined })
    expect(w.findComponent(RouterLinkStub).exists()).toBe(false)
    expect(w.get('[data-test="sector-tile"]').exists()).toBe(true)
  })
})
