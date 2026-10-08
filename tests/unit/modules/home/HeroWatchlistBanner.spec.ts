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
            subtitle: 'Find and follow assets you’d like to keep an eye on',
            addAssets: 'Add assets',
          },
        },
      },
    },
  },
})

const mountBanner = () =>
  mount(HeroWatchlistBanner, { global: { plugins: [i18n] } })

describe('HeroWatchlistBanner', () => {
  it('renders the title, subtitle and "Add assets" CTA', () => {
    const w = mountBanner()
    expect(w.text()).toContain('Build your watchlist')
    expect(w.text()).toContain('Find and follow assets')
    expect(w.get('[data-test="hero-watchlist-begin"]').text()).toBe(
      'Add assets',
    )
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

  it('emits "begin" when clicking anywhere on the banner, not just the CTA', async () => {
    const w = mountBanner()
    await w.get('[data-test="hero-watchlist-banner"]').trigger('click')
    expect(w.emitted('begin')).toHaveLength(1)
  })

  it('launches the flow via keyboard (Enter)', async () => {
    const w = mountBanner()
    await w.get('[data-test="hero-watchlist-banner"]').trigger('keydown.enter')
    expect(w.emitted('begin')).toHaveLength(1)
  })
})
