import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

const openPanel = vi.fn()
vi.mock('@/stores/walletMenuStore', () => ({
  useWalletMenuStore: () => ({ openPanel }),
}))

import HomeOffers from '@/modules/home/sections/HomeOffers.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: {} },
})

const mountIt = () => mount(HomeOffers, { global: { plugins: [i18n] } })

describe('HomeOffers', () => {
  it('renders one AppRewardsCard per offer', () => {
    expect(mountIt().findAll('[data-test="rewards-card"]').length).toBe(3)
  })

  it('opens the matching side-drawer panel on card click', async () => {
    openPanel.mockClear()
    const cards = mountIt().findAll('[data-test="rewards-card"]')
    await cards[0].trigger('click') // Trade +$50 -> trade
    await cards[1].trigger('click') // Buy crypto -> purchase
    await cards[2].trigger('click') // Hold Trade -> trade
    expect(openPanel.mock.calls).toEqual([['trade'], ['purchase'], ['trade']])
  })
})
