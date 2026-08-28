import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

// AppTokenLogo imports the stocks store (Ledger SDK transitively). Stub it.
vi.mock('@/components/AppTokenLogo.vue', () => ({
  default: { template: '<span data-test="token-logo" />' },
}))

import WatchlistStepMarkets from '@/modules/home/components/WatchlistStepMarkets.vue'
import WatchlistStepIndustries from '@/modules/home/components/WatchlistStepIndustries.vue'
import WatchlistStepAssets from '@/modules/home/components/WatchlistStepAssets.vue'
import { MOCK_RECOMMENDED_ASSETS } from '@/modules/home/components/watchlistOnboarding'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: {} },
})

const mountWith = (component: unknown, props: Record<string, unknown> = {}) =>
  mount(component as never, { props, global: { plugins: [i18n] } })

describe('WatchlistStepMarkets (MEW-2130)', () => {
  it('renders one card per market and disables Continue with no selection', () => {
    const w = mountWith(WatchlistStepMarkets, { modelValue: [] })
    expect(w.findAll('[data-test="market-card"]').length).toBe(3)
    expect(
      w.get('[data-test="markets-continue"]').attributes('disabled'),
    ).toBeDefined()
  })

  it('toggles selection via update:modelValue and emits continue', async () => {
    const w = mountWith(WatchlistStepMarkets, { modelValue: [] })
    await w.findAll('[data-test="market-card"]')[0].trigger('click')
    expect(w.emitted('update:modelValue')?.[0][0]).toEqual(['stocks'])

    const enabled = mountWith(WatchlistStepMarkets, { modelValue: ['crypto'] })
    await enabled.get('[data-test="markets-continue"]').trigger('click')
    expect(enabled.emitted('continue')).toHaveLength(1)
  })
})

describe('WatchlistStepIndustries (MEW-2130)', () => {
  it('renders every industry pill and gates Continue on selection', () => {
    const w = mountWith(WatchlistStepIndustries, { modelValue: [] })
    expect(w.findAll('[data-test="industry-pill"]').length).toBe(12)
    expect(
      w.get('[data-test="industries-continue"]').attributes('disabled'),
    ).toBeDefined()
  })

  it('emits selection toggle on pill click', async () => {
    const w = mountWith(WatchlistStepIndustries, { modelValue: [] })
    await w.findAll('[data-test="industry-pill"]')[0].trigger('click')
    expect(w.emitted('update:modelValue')?.[0][0]).toEqual(['commodities'])
  })

  it('emits back when the header back button is clicked', async () => {
    const w = mountWith(WatchlistStepIndustries, { modelValue: [] })
    await w.get('[data-test="industries-back"]').trigger('click')
    expect(w.emitted('back')).toHaveLength(1)
  })
})

describe('WatchlistStepAssets (MEW-2130)', () => {
  it('shows the loading state while fetching', () => {
    const w = mountWith(WatchlistStepAssets, {
      assets: [],
      isLoading: true,
      modelValue: [],
    })
    expect(w.find('[data-test="assets-loading"]').exists()).toBe(true)
    expect(w.find('[data-test="asset-card"]').exists()).toBe(false)
  })

  it('caps the grid at 8 and reveals the rest via Show more', async () => {
    const w = mountWith(WatchlistStepAssets, {
      assets: MOCK_RECOMMENDED_ASSETS,
      isLoading: false,
      modelValue: [],
    })
    expect(w.findAll('[data-test="asset-card"]').length).toBe(8)
    await w.get('[data-test="assets-show-more"]').trigger('click')
    expect(w.findAll('[data-test="asset-card"]').length).toBe(
      MOCK_RECOMMENDED_ASSETS.length,
    )
    expect(w.find('[data-test="assets-show-more"]').exists()).toBe(false)
  })

  it('gates Done on selection and emits done', async () => {
    const empty = mountWith(WatchlistStepAssets, {
      assets: MOCK_RECOMMENDED_ASSETS,
      isLoading: false,
      modelValue: [],
    })
    expect(
      empty.get('[data-test="assets-done"]').attributes('disabled'),
    ).toBeDefined()

    const withSel = mountWith(WatchlistStepAssets, {
      assets: MOCK_RECOMMENDED_ASSETS,
      isLoading: false,
      modelValue: [MOCK_RECOMMENDED_ASSETS[0].id],
    })
    await withSel.get('[data-test="assets-done"]').trigger('click')
    expect(withSel.emitted('done')).toHaveLength(1)
  })

  it('emits back from the header', async () => {
    const w = mountWith(WatchlistStepAssets, {
      assets: MOCK_RECOMMENDED_ASSETS,
      isLoading: false,
      modelValue: [],
    })
    await w.get('[data-test="assets-back"]').trigger('click')
    expect(w.emitted('back')).toHaveLength(1)
  })

  it('filters the grid by search query', async () => {
    const w = mountWith(WatchlistStepAssets, {
      assets: MOCK_RECOMMENDED_ASSETS,
      isLoading: false,
      modelValue: [],
    })
    await w.find('input').setValue(MOCK_RECOMMENDED_ASSETS[0].symbol)
    const cards = w.findAll('[data-test="asset-card"]')
    expect(cards.length).toBeGreaterThan(0)
    expect(cards.length).toBeLessThan(MOCK_RECOMMENDED_ASSETS.length)
  })
})
