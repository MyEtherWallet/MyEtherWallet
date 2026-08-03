import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import HomeHero from '@/modules/home/sections/HomeHero.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: {} },
})

describe('HomeHero', () => {
  it('renders the placeholder box', () => {
    const w = mount(HomeHero, { global: { plugins: [i18n] } })
    expect(w.find('[data-test="home-hero-placeholder"]').exists()).toBe(true)
  })
})
