import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import AppRewardsCard from '@/components/AppRewardsCard.vue'

describe('AppRewardsCard', () => {
  const mountIt = (props = {}) =>
    mount(AppRewardsCard, {
      props: {
        title: 'Trade +$50',
        highlight: 'Earn $10 USDC',
        category: 'Trade',
        to: '/earn',
        ...props,
      },
      global: { stubs: { RouterLink: RouterLinkStub } },
    })

  it('renders title, highlight and category', () => {
    const w = mountIt()
    expect(w.get('[data-test="rewards-title"]').text()).toBe('Trade +$50')
    expect(w.get('[data-test="rewards-highlight"]').text()).toBe('Earn $10 USDC')
    expect(w.get('[data-test="rewards-category"]').text()).toBe('Trade')
  })

  it('links to `to` when provided', () => {
    expect(mountIt().getComponent(RouterLinkStub).props('to')).toBe('/earn')
  })

  it('renders as a plain element when `to` is omitted', () => {
    const w = mount(AppRewardsCard, {
      props: { title: 'X' },
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    expect(w.find('[data-test="rewards-card"]').exists()).toBe(true)
    expect(w.findComponent(RouterLinkStub).exists()).toBe(false)
  })
})
