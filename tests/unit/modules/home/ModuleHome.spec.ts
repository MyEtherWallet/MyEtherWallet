import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h, reactive, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

// ModuleHome uses useI18n() (Composition API), which needs the i18n plugin
// installed on the app instance — global.mocks.$t alone only covers Options
// API / template $t usage, not the composable. Mirrors the pattern used in
// tests/unit/components/AppSearchInput.spec.ts.
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: {} },
})

const isWalletConnected = ref(false)
// Real Pinia stores auto-unwrap top-level refs (they're wrapped in `reactive`
// internally), so `store.isWalletConnected` reads as a plain boolean, not a
// Ref. Wrap the mock in `reactive()` too, otherwise comparisons against the
// raw Ref object never match.
vi.mock('@/stores/walletStore', () => ({ useWalletStore: () => reactive({ isWalletConnected }) }))

// Stub is defined inside the factory (not referenced from outer scope) because
// vi.mock factories are hoisted above module-level consts and would otherwise
// hit a TDZ "Cannot access before initialization" error.
vi.mock('@/modules/home/homeSections', () => {
  const Stub = (id: string) => defineComponent({ render: () => h('div', { 'data-test': `sec-${id}` }, id) })
  return {
    homeSections: [
      { id: 'a', component: Stub('a'), visibleWhen: 'always',      titleKey: 'homePage.offers.title', subtitleKey: 'homePage.offers.subtitle' },
      { id: 'b', component: Stub('b'), visibleWhen: 'connected',   titleKey: 'homePage.news.title',   subtitleKey: 'homePage.news.subtitle' },
      { id: 'c', component: Stub('c'), visibleWhen: 'unconnected', titleKey: 'homePage.sectors.title',subtitleKey: 'homePage.sectors.subtitle' },
    ],
  }
})

import ModuleHome from '@/modules/home/ModuleHome.vue'
const mountIt = () => mount(ModuleHome, { global: { plugins: [i18n] } })

describe('ModuleHome', () => {
  it('unconnected: shows always + unconnected, hides connected', () => {
    isWalletConnected.value = false
    const w = mountIt()
    expect(w.find('[data-test="sec-a"]').exists()).toBe(true)
    expect(w.find('[data-test="sec-c"]').exists()).toBe(true)
    expect(w.find('[data-test="sec-b"]').exists()).toBe(false)
  })
  it('connected: shows always + connected, hides unconnected', () => {
    isWalletConnected.value = true
    const w = mountIt()
    expect(w.find('[data-test="sec-b"]').exists()).toBe(true)
    expect(w.find('[data-test="sec-c"]').exists()).toBe(false)
  })
})
