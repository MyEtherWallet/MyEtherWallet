import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import HomeIndustrySectors from '@/modules/home/sections/HomeIndustrySectors.vue'
import { sectors } from '@/modules/home/sectors'

// HomeIndustrySectors uses useI18n() (Composition API), which needs the i18n
// plugin installed on the app instance. Mirrors the pattern used in
// tests/unit/modules/home/HomeNewListings.spec.ts.
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: {} },
})

// The real AppSlideGroup renders content through per-index named slots
// (#item-0, #item-1, ...) — see src/components/app_slide_group/AppSlideGroup.vue.
// The stub renders every possible slot up to a generous cap so both tabs'
// item counts are covered without hardcoding per-tab totals.
const MAX_ITEMS = 10
const AppSlideGroupStub = {
  template: `<div>${Array.from({ length: MAX_ITEMS }, (_, i) => `<slot name="item-${i}" />`).join('')}</div>`,
}

// The real AppTabs binds `v-model:activeTabIndex` via `defineModel` and
// exposes a single `tab-panel` slot. Mirrors HomeNewListings.spec.ts's stub.
const AppTabsStub = {
  props: ['activeTabIndex'],
  emits: ['update:activeTabIndex'],
  template:
    '<div><button data-test="tab-switch" @click="$emit(\'update:activeTabIndex\', activeTabIndex === 0 ? 1 : 0)" /><slot name="tab-panel" /></div>',
}

describe('HomeIndustrySectors', () => {
  const mountIt = () =>
    mount(HomeIndustrySectors, {
      global: {
        plugins: [i18n],
        stubs: {
          RouterLink: RouterLinkStub,
          AppTabs: AppTabsStub,
          AppSlideGroup: AppSlideGroupStub,
        },
      },
    })

  const stockCount = sectors.filter(s => s.market === 'stocks').length
  const cryptoCount = sectors.filter(s => s.market === 'crypto').length

  it('renders one tile per stock sector on the stocks tab', () => {
    const w = mountIt()
    expect(w.findAll('[data-test="sector-tile"]').length).toBe(stockCount)
  })

  it('switches to one tile per crypto sector on the crypto tab', async () => {
    const w = mountIt()
    await w.get('[data-test="tab-switch"]').trigger('click')
    expect(w.findAll('[data-test="sector-tile"]').length).toBe(cryptoCount)
  })

  it('links each tile to its sector deep-link', () => {
    const w = mountIt()
    const links = w.findAllComponents(RouterLinkStub)
    const stockSectors = sectors.filter(s => s.market === 'stocks')
    expect(links[0].props('to')).toEqual({
      path: '/stocks',
      query: { sector: stockSectors[0].filter },
    })
  })
})
