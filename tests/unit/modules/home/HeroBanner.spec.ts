import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    en: {
      homePage: {
        hero: {
          banner: {
            title: 'Trade and get 5 USDC',
            subtitle: 'The first 10 trades of $50+ each hour get 10 USDC.',
            learnMore: 'Learn more',
            tradeStocks: 'Trade stocks',
          },
        },
      },
    },
  },
})

const push = vi.fn()
vi.mock('vue-router', () => ({ useRouter: () => ({ push }) }))

import HeroBanner from '@/modules/home/components/HeroBanner.vue'

const mountBanner = () => mount(HeroBanner, { global: { plugins: [i18n] } })

describe('HeroBanner (MEW-2094 promo, hidden for now)', () => {
  beforeEach(() => push.mockClear())

  it('renders the title, subtitle and both CTAs', () => {
    const w = mountBanner()
    expect(w.text()).toContain('Trade and get 5 USDC')
    expect(w.text()).toContain('The first 10 trades')
    expect(w.find('[data-test="hero-banner-learn"]').exists()).toBe(true)
    expect(w.find('[data-test="hero-banner-trade"]').exists()).toBe(true)
  })

  it('routes to the stocks page from "Trade stocks"', async () => {
    const w = mountBanner()
    await w.get('[data-test="hero-banner-trade"]').trigger('click')
    expect(push).toHaveBeenCalledWith({ name: 'Stocks' })
  })

  it('does not navigate from "Learn more" (target TBD)', async () => {
    const w = mountBanner()
    await w.get('[data-test="hero-banner-learn"]').trigger('click')
    expect(push).not.toHaveBeenCalled()
  })
})
