import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import HomeOffers from '@/modules/home/sections/HomeOffers.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: {} },
})

describe('HomeOffers', () => {
  it('renders one AppRewardsCard per offer', () => {
    const w = mount(HomeOffers, {
      global: { plugins: [i18n], stubs: { RouterLink: RouterLinkStub } },
    })
    expect(w.findAll('[data-test="rewards-card"]').length).toBe(3)
  })
})
