import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import AppRewardsCard from '@/components/AppRewardsCard.vue'

describe('AppRewardsCard', () => {
  const mountIt = (props = {}) =>
    mount(AppRewardsCard, {
      props: { title: 'Earn rewards', description: 'desc', to: '/earn', ...props },
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
  it('renders title and description', () => {
    const w = mountIt()
    expect(w.get('[data-test="rewards-title"]').text()).toBe('Earn rewards')
    expect(w.get('[data-test="rewards-desc"]').text()).toBe('desc')
  })
  it('links to `to` when provided', () => {
    const w = mountIt()
    expect(w.getComponent(RouterLinkStub).props('to')).toBe('/earn')
  })
})
