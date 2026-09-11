import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import type { RecommendedAsset } from '@/modules/home/components/watchlistOnboarding'

// Fixed recommendations covering all three buckets (finish() reads these).
const ASSETS: RecommendedAsset[] = [
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', type: 'crypto', watchlistId: 'ethereum' }, // prettier-ignore
  { id: 'aapl', symbol: 'AAPLon', name: 'Apple', type: 'stock', watchlistId: 'AAPL' },
  { id: 'btc', symbol: 'BTC', name: 'Bitcoin perp', type: 'perp', watchlistId: 'BTC' }, // prettier-ignore
]
const fetchRecommendations = vi.fn()
vi.mock('@/modules/home/composables/useRecommendedWatchlist', () => ({
  useRecommendedWatchlist: () => ({
    assets: ref(ASSETS),
    isLoading: ref(false),
    fetchRecommendations,
  }),
}))

const CATS = [{ id: 'STOCK:Equities' }, { id: 'CRYPTO:stablecoins' }]
const fetchCategories = vi.fn(async () => CATS)
vi.mock('@/modules/home/composables/useWatchlistCategories', () => ({
  useWatchlistCategories: () => ({
    categories: ref(CATS),
    isLoading: ref(false),
    fetchCategories,
  }),
  marketsToTypes: (markets: string[]) => markets,
}))

// AppDialog teleports to #app; replace with an inline passthrough.
vi.mock('@/components/AppDialog.vue', () => ({
  default: {
    props: { isOpen: Boolean },
    emits: ['update:isOpen'],
    template: '<div v-if="isOpen"><slot name="content" /></div>',
  },
}))

// Step stubs: expose the events + a way to set the model.
vi.mock('@/modules/home/components/WatchlistStepMarkets.vue', () => ({
  default: {
    props: { modelValue: Array },
    emits: ['continue', 'skip', 'update:modelValue'],
    template:
      '<div><button data-test="s1" @click="$emit(\'continue\')">markets</button>' +
      '<button data-test="s1-pick" @click="$emit(\'update:modelValue\', [\'crypto\'])">pick</button>' +
      '<button data-test="s1-skip" @click="$emit(\'skip\')">skip</button>' +
      '<span data-test="s1-model">{{ (modelValue || []).join(\',\') }}</span></div>',
  },
}))
vi.mock('@/modules/home/components/WatchlistStepIndustries.vue', () => ({
  default: {
    emits: ['continue', 'back', 'skip', 'update:modelValue'],
    template:
      '<div><button data-test="s2" @click="$emit(\'continue\')">industries</button>' +
      '<button data-test="s2-pick" @click="$emit(\'update:modelValue\', [\'STOCK:Equities\'])">pick</button>' +
      '<button data-test="s2-back" @click="$emit(\'back\')">back</button>' +
      '<button data-test="s2-skip" @click="$emit(\'skip\')">skip</button></div>',
  },
}))
vi.mock('@/modules/home/components/WatchlistStepAssets.vue', () => ({
  default: {
    props: { assets: Array, isLoading: Boolean, modelValue: Array },
    emits: ['done', 'back', 'update:modelValue'],
    template:
      '<div><button data-test="pick" @click="$emit(\'update:modelValue\', [\'eth\',\'aapl\',\'btc\'])">pick</button>' +
      '<button data-test="s3-back" @click="$emit(\'back\')">back</button>' +
      '<button data-test="done" @click="$emit(\'done\')">done</button></div>',
  },
}))

import HomeWatchlistOnboardingDialog from '@/modules/home/components/HomeWatchlistOnboardingDialog.vue'
import { useWatchlistStore } from '@/stores/watchlistTableStore'

const mountDialog = () =>
  mount(HomeWatchlistOnboardingDialog, { props: { isOpen: true } })

describe('HomeWatchlistOnboardingDialog (MEW-2130)', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    fetchRecommendations.mockClear()
    fetchCategories.mockClear()
  })

  it('markets → industries fetches categories; industries → assets recommends the picks', async () => {
    const w = mountDialog()
    await w.get('[data-test="s1"]').trigger('click') // → industries
    expect(w.find('[data-test="s2"]').exists()).toBe(true)
    expect(fetchCategories).toHaveBeenCalledTimes(1)
    await w.get('[data-test="s2-pick"]').trigger('click') // pick "STOCK:Equities"
    await w.get('[data-test="s2"]').trigger('click') // → assets
    expect(w.find('[data-test="done"]').exists()).toBe(true)
    expect(fetchRecommendations).toHaveBeenCalledWith(['STOCK:Equities'])
  })

  it('skip on markets discards the picks and recommends every category', async () => {
    const w = mountDialog()
    await w.get('[data-test="s1-pick"]').trigger('click') // select "crypto"
    await w.get('[data-test="s1-skip"]').trigger('click')
    await flushPromises() // skipFromMarkets awaits fetchCategories first
    expect(w.find('[data-test="done"]').exists()).toBe(true)
    expect(fetchCategories).toHaveBeenCalledWith(['STOCK', 'CRYPTO'])
    // Ignores the crypto pick — recommends across every fetched category.
    expect(fetchRecommendations).toHaveBeenCalledWith([
      'STOCK:Equities',
      'CRYPTO:stablecoins',
    ])
  })

  it('skip on industries ignores step 1 and recommends across both markets', async () => {
    const w = mountDialog()
    await w.get('[data-test="s1"]').trigger('click')
    await w.get('[data-test="s2-skip"]').trigger('click')
    await flushPromises() // skipToAssets awaits fetchCategories first
    expect(w.find('[data-test="done"]').exists()).toBe(true)
    expect(fetchCategories).toHaveBeenCalledWith(['STOCK', 'CRYPTO'])
    expect(fetchRecommendations).toHaveBeenCalledWith([
      'STOCK:Equities',
      'CRYPTO:stablecoins',
    ])
  })

  it('skip resets the skipped selection so back shows no stale picks', async () => {
    const w = mountDialog()
    await w.get('[data-test="s1-pick"]').trigger('click') // select "crypto"
    await w.get('[data-test="s1-skip"]').trigger('click')
    await flushPromises()
    // Back: assets → industries → markets. The market pick must be cleared.
    await w.get('[data-test="s3-back"]').trigger('click')
    await w.get('[data-test="s2-back"]').trigger('click')
    expect(w.get('[data-test="s1-model"]').text()).toBe('')
  })

  it('back from industries returns to markets', async () => {
    const w = mountDialog()
    await w.get('[data-test="s1"]').trigger('click')
    expect(w.find('[data-test="s2"]').exists()).toBe(true)
    await w.get('[data-test="s2-back"]').trigger('click')
    expect(w.find('[data-test="s1"]').exists()).toBe(true)
  })

  it('done adds each selected asset to its matching bucket and closes', async () => {
    const w = mountDialog()
    await w.get('[data-test="s1"]').trigger('click')
    await w.get('[data-test="s2"]').trigger('click')
    await w.get('[data-test="pick"]').trigger('click')
    await w.get('[data-test="done"]').trigger('click')

    const store = useWatchlistStore()
    expect(store.watchListedTokens).toEqual(['ethereum'])
    expect(store.watchListedStocks).toEqual(['AAPL'])
    expect(store.watchListedPerps).toEqual(['BTC'])
    expect(w.emitted('update:isOpen')?.at(-1)?.[0]).toBe(false)
  })
})
