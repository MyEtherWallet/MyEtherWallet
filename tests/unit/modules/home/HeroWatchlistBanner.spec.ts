import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import HeroWatchlistBanner from '@/modules/home/components/HeroWatchlistBanner.vue'

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
          watchlist: {
            title: 'Build your watchlist',
            subtitle: 'Find assets to follow based on your interests',
            begin: "Let's begin",
          },
        },
      },
    },
  },
})

const mountBanner = () =>
  mount(HeroWatchlistBanner, { global: { plugins: [i18n] } })

describe('HeroWatchlistBanner (MEW-2094 watchlist onboarding)', () => {
  it('renders the title, subtitle and begin CTA', () => {
    const w = mountBanner()
    expect(w.text()).toContain('Build your watchlist')
    expect(w.text()).toContain('Find assets to follow')
    expect(w.find('[data-test="hero-watchlist-begin"]').exists()).toBe(true)
  })

  it('renders four decorative stock avatars', () => {
    const w = mountBanner()
    expect(w.findAll('[data-test="stock-avatar"]').length).toBe(4)
  })

  it('emits "begin" when the CTA is clicked', async () => {
    const w = mountBanner()
    await w.get('[data-test="hero-watchlist-begin"]').trigger('click')
    expect(w.emitted('begin')).toHaveLength(1)
  })
})
