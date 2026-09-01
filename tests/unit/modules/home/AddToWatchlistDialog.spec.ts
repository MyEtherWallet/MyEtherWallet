import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import type { AssetPickerItem } from '@/modules/home/composables/useAssetPicker'

const items = ref<AssetPickerItem[]>([])
const isLoading = ref(false)
vi.mock('@/modules/home/composables/useAssetPicker', () => ({
  useAssetPicker: () => ({ items, isLoading }),
}))

// AppDialog teleports; AppSearchInput/AssetPickerRow pull heavy deps — stub all.
vi.mock('@/components/AppDialog.vue', () => ({
  default: {
    props: { isOpen: Boolean },
    template: '<div v-if="isOpen"><slot name="content" /></div>',
  },
}))
vi.mock('@/components/AppSearchInput.vue', () => ({
  default: { template: '<input data-test="search" />' },
}))
vi.mock('@/modules/home/components/AssetPickerRow.vue', () => ({
  default: {
    props: ['item'],
    template: '<div data-test="asset-picker-row">{{ item.symbol }}</div>',
  },
}))

import AddToWatchlistDialog from '@/modules/home/components/AddToWatchlistDialog.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: {} },
})

const mountDialog = () =>
  mount(AddToWatchlistDialog, {
    props: { isOpen: true },
    global: { plugins: [i18n] },
  })

describe('AddToWatchlistDialog (MEW-2130)', () => {
  beforeEach(() => {
    items.value = []
    isLoading.value = false
  })

  it('renders the market tabs (All, Stocks, Crypto — no Perps) with All selected by default', () => {
    const w = mountDialog()
    const tabs = w.findAll('[data-test="picker-tab"]')
    expect(tabs.length).toBe(3)
    expect(tabs[0].attributes('aria-selected')).toBe('true')
  })

  it('switches the active tab on click', async () => {
    const w = mountDialog()
    const tabs = w.findAll('[data-test="picker-tab"]')
    await tabs[2].trigger('click') // crypto
    expect(w.findAll('[data-test="picker-tab"]')[2].attributes('aria-selected')).toBe(
      'true',
    )
    expect(w.findAll('[data-test="picker-tab"]')[0].attributes('aria-selected')).toBe(
      'false',
    )
  })

  it('shows the loading spinner while fetching', () => {
    isLoading.value = true
    expect(mountDialog().find('[data-test="picker-loading"]').exists()).toBe(true)
  })

  it('renders one row per item', () => {
    items.value = [
      { key: 'crypto-eth', symbol: 'ETH', name: 'Ethereum', type: 'crypto', watchlistId: 'ethereum' },
      { key: 'stock-AAPL', symbol: 'AAPL', name: 'Apple', type: 'stock', watchlistId: 'AAPL' },
    ]
    expect(mountDialog().findAll('[data-test="asset-picker-row"]').length).toBe(2)
  })

  it('shows the empty state when there are no items and not loading', () => {
    items.value = []
    isLoading.value = false
    expect(mountDialog().find('[data-test="picker-empty"]').exists()).toBe(true)
  })
})
