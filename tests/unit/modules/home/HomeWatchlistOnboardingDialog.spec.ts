import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import type { RecommendedAsset } from '@/modules/home/components/watchlistOnboarding'

// Fixed recommendations covering all three buckets.
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
    emits: ['continue', 'skip', 'update:modelValue'],
    template:
      '<div><button data-test="s1" @click="$emit(\'continue\')">markets</button>' +
      '<button data-test="s1-pick" @click="$emit(\'update:modelValue\', [\'crypto\'])">pick</button>' +
      '<button data-test="s1-skip" @click="$emit(\'skip\')">skip</button></div>',
  },
}))
vi.mock('@/modules/home/components/WatchlistStepIndustries.vue', () => ({
  default: {
    emits: ['continue', 'back', 'skip', 'update:modelValue'],
    template:
      '<div><button data-test="s2" @click="$emit(\'continue\')">industries</button>' +
      '<button data-test="s2-back" @click="$emit(\'back\')">back</button>' +
      '<button data-test="s2-skip" @click="$emit(\'skip\')">skip</button></div>',
  },
}))
vi.mock('@/modules/home/components/WatchlistStepAssets.vue', () => ({
  default: {
    props: { assets: Array, isLoading: Boolean, modelValue: Array },
    emits: ['done', 'update:modelValue'],
    template:
      '<div><button data-test="pick" @click="$emit(\'update:modelValue\', [\'eth\',\'aapl\',\'btc\'])">pick</button>' +
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
  })

  it('advances markets → industries → assets and fetches recommendations', async () => {
    const w = mountDialog()
    expect(w.find('[data-test="s1"]').exists()).toBe(true)
    await w.get('[data-test="s1"]').trigger('click')
    expect(w.find('[data-test="s2"]').exists()).toBe(true)
    await w.get('[data-test="s2"]').trigger('click')
    expect(w.find('[data-test="done"]').exists()).toBe(true)
    expect(fetchRecommendations).toHaveBeenCalledTimes(1)
  })

  it('skip on markets jumps straight to assets and discards the market picks', async () => {
    const w = mountDialog()
    await w.get('[data-test="s1-pick"]').trigger('click') // select "crypto"
    await w.get('[data-test="s1-skip"]').trigger('click')
    expect(w.find('[data-test="done"]').exists()).toBe(true)
    // Skipping step 1 must NOT use the selection — fetch with empty markets.
    expect(fetchRecommendations).toHaveBeenCalledTimes(1)
    expect(fetchRecommendations).toHaveBeenCalledWith([], [])
  })

  it('continue on markets commits the picks used by the assets fetch', async () => {
    const w = mountDialog()
    await w.get('[data-test="s1-pick"]').trigger('click') // select "crypto"
    await w.get('[data-test="s1"]').trigger('click') // continue → industries
    await w.get('[data-test="s2-skip"]').trigger('click') // skip industries, keep markets
    expect(fetchRecommendations).toHaveBeenCalledWith(['crypto'], [])
  })

  it('skip on industries advances to assets', async () => {
    const w = mountDialog()
    await w.get('[data-test="s1"]').trigger('click')
    await w.get('[data-test="s2-skip"]').trigger('click')
    expect(w.find('[data-test="done"]').exists()).toBe(true)
    expect(fetchRecommendations).toHaveBeenCalledTimes(1)
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
