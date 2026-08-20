import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

const openPanel = vi.fn()
vi.mock('@/stores/walletMenuStore', () => ({
  useWalletMenuStore: () => ({ openPanel }),
}))
const openModal = vi.fn()
vi.mock('@/stores/holdingsStore', () => ({
  useHoldingsStore: () => ({ openModal }),
}))
// The trade-info modal self-fetches rewards data on mount — stub it.
vi.mock('@/modules/rwa_rewards/RwaTradeInfoModal.vue', () => ({
  default: {
    props: ['isOpen'],
    template: '<div data-test="trade-info-modal" />',
  },
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
  beforeEach(() => {
    openPanel.mockClear()
    openModal.mockClear()
  })

  it('renders one AppRewardsCard per offer', () => {
    expect(mountIt().findAll('[data-test="rewards-card"]').length).toBe(3)
  })

  it('trade card opens the trade-info modal (Portfolio trade popup)', async () => {
    const w = mountIt()
    expect(w.find('[data-test="trade-info-modal"]').exists()).toBe(false)
    await w.findAll('[data-test="rewards-card"]')[0].trigger('click')
    expect(w.find('[data-test="trade-info-modal"]').exists()).toBe(true)
    expect(openPanel).not.toHaveBeenCalled()
  })

  it('buy card opens the purchase side-panel', async () => {
    await mountIt().findAll('[data-test="rewards-card"]')[1].trigger('click')
    expect(openPanel).toHaveBeenCalledWith('purchase')
  })

  it('hold card opens the holdings rewards modal (Portfolio hold popup)', async () => {
    await mountIt().findAll('[data-test="rewards-card"]')[2].trigger('click')
    expect(openModal).toHaveBeenCalledTimes(1)
    expect(openPanel).not.toHaveBeenCalled()
  })
})
