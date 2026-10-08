import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, type Ref } from 'vue'
import { mount, flushPromises, enableAutoUnmount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { setActivePinia, createPinia } from 'pinia'
import type { AssetPickerItem } from '@/modules/home/composables/useAssetPicker'

const items = ref<AssetPickerItem[]>([])
const isLoading = ref(false)
// The refs the dialog hands the picker, so tests can assert what it asks for.
let pickerArgs: { tab: Ref<string>; category: Ref<string>; query: Ref<string> }
vi.mock('@/modules/home/composables/useAssetPicker', () => ({
  useAssetPicker: (
    tab: Ref<string>,
    category: Ref<string>,
    query: Ref<string>,
  ) => {
    pickerArgs = { tab, category, query }
    return { items, isLoading }
  },
}))

// AppDialog teleports and the real button/search/row pull heavy deps — stub.
vi.mock('@/components/AppDialog.vue', () => ({
  default: {
    props: { isOpen: Boolean },
    template:
      '<div v-if="isOpen"><slot name="title" /><slot name="content" /></div>',
  },
}))
vi.mock('@/components/AppSearchInput.vue', () => ({
  default: {
    props: ['modelValue'],
    emits: ['update:modelValue'],
    template:
      '<input data-test="search" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
  },
}))
vi.mock('@/components/AppBaseButton.vue', () => ({
  default: {
    props: ['disabled'],
    emits: ['click'],
    template:
      '<button data-test="picker-confirm" :disabled="disabled" @click="$emit(\'click\')"><slot /></button>',
  },
}))
vi.mock('@/modules/home/components/AssetPickerRow.vue', () => ({
  default: {
    props: ['item', 'selected'],
    emits: ['toggle'],
    template:
      '<button data-test="asset-picker-row" :aria-pressed="selected" @click="$emit(\'toggle\')">{{ item.symbol }}</button>',
  },
}))

import AddToWatchlistDialog from '@/modules/home/components/AddToWatchlistDialog.vue'
import { useWatchlistStore } from '@/stores/watchlistTableStore'
import { useToastStore } from '@/stores/toastStore'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    en: {
      homePage: {
        hero: {
          watchlist: {
            addModal: {
              allStocks: 'All stocks',
              allCrypto: 'All crypto',
              more: 'More',
              selectAssets: 'Select assets to add',
              addAssets: 'Add {count} asset | Add {count} assets',
              update: 'Update watchlist',
            },
          },
        },
      },
      stocks: { category_technology: 'Technology', category_etf: 'ETF' },
      crypto: { stablecoins: 'Stablecoins' },
    },
  },
})

const ETH: AssetPickerItem = {
  key: 'crypto-ethereum',
  symbol: 'ETH',
  name: 'Ethereum',
  type: 'crypto',
  watchlistId: 'ethereum',
}
const AAPL: AssetPickerItem = {
  key: 'stock-AAPL',
  symbol: 'AAPL',
  name: 'Apple',
  type: 'stock',
  watchlistId: 'AAPL',
}

const mountDialog = () =>
  mount(AddToWatchlistDialog, {
    props: { isOpen: true },
    global: { plugins: [i18n] },
    attachTo: document.body,
  })

const chips = (w: ReturnType<typeof mountDialog>) =>
  w.findAll('[data-test="picker-chip"]')
const confirm = (w: ReturnType<typeof mountDialog>) =>
  w.get('[data-test="picker-confirm"]')

enableAutoUnmount(afterEach)

describe('AddToWatchlistDialog', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    items.value = []
    isLoading.value = false
  })

  it('shows the Stocks and Crypto tabs with Stocks selected', () => {
    const tabs = mountDialog().findAll('[data-test="tab-bar-item"]')
    expect(tabs.map(t => t.text())).toEqual([
      'homePage.hero.watchlist.addModal.tabs.stocks',
      'homePage.hero.watchlist.addModal.tabs.crypto',
    ])
    expect(tabs[0].attributes('aria-selected')).toBe('true')
    expect(pickerArgs.tab.value).toBe('stocks')
  })

  it('shows the featured stock categories with "All stocks" picked', () => {
    const w = mountDialog()
    expect(chips(w).map(c => c.text())).toEqual([
      'All stocks',
      'Technology',
      'stocks.category_equities',
    ])
    expect(chips(w)[0].attributes('aria-pressed')).toBe('true')
    expect(w.get('[data-test="picker-more"]').text()).toBe('More')
    expect(pickerArgs.category.value).toBe('all')
  })

  it('filters by the clicked category', async () => {
    const w = mountDialog()
    await chips(w)[1].trigger('click')
    expect(pickerArgs.category.value).toBe('TECHNOLOGY')
    expect(chips(w)[1].attributes('aria-pressed')).toBe('true')
    expect(chips(w)[0].attributes('aria-pressed')).toBe('false')
  })

  it('swaps the categories and resets to "all" when the tab changes', async () => {
    const w = mountDialog()
    await chips(w)[1].trigger('click')
    await w.findAll('[data-test="tab-bar-item"]')[1].trigger('click')
    expect(pickerArgs.tab.value).toBe('crypto')
    expect(pickerArgs.category.value).toBe('all')
    expect(chips(w).map(c => c.text())).toEqual([
      'All crypto',
      'Stablecoins',
      'crypto.top_gainers',
    ])
  })

  it('picks a category from "More" and shows it on the More chip', async () => {
    const w = mountDialog()
    await w.get('[data-test="picker-more"]').trigger('click')
    // The menu is teleported to <body> so the dialog's scroll box can't clip it.
    const menu = document.body.querySelector('[data-test="picker-more-menu"]')!
    expect(w.element.contains(menu)).toBe(false)
    const etf = [...menu.querySelectorAll<HTMLElement>('[role="option"]')].find(
      o => o.textContent?.trim() === 'ETF',
    )!
    etf.click()
    await flushPromises()
    expect(pickerArgs.category.value).toBe('ETF')
    const more = w.get('[data-test="picker-more"]')
    expect(more.text()).toBe('ETF')
    expect(more.attributes('aria-pressed')).toBe('true')
    expect(chips(w)[0].attributes('aria-pressed')).toBe('false')
  })

  it('hides the tabs and categories while searching', async () => {
    const w = mountDialog()
    await w.get('[data-test="search"]').setValue('app')
    expect(pickerArgs.query.value).toBe('app')
    expect(w.find('[data-test="tab-bar-item"]').exists()).toBe(false)
    expect(w.find('[data-test="picker-chip"]').exists()).toBe(false)
    expect(w.find('[data-test="picker-more"]').exists()).toBe(false)
  })

  it('shows skeleton rows while loading, and the empty state after', () => {
    isLoading.value = true
    const loading = mountDialog()
    expect(loading.findAll('[data-test="picker-skeleton"]').length).toBe(6)
    expect(loading.find('[data-test="asset-picker-row"]').exists()).toBe(false)
    isLoading.value = false
    expect(mountDialog().find('[data-test="picker-empty"]').exists()).toBe(true)
  })

  it('disables confirm until something changes', () => {
    items.value = [ETH, AAPL]
    const btn = confirm(mountDialog())
    expect(btn.attributes('disabled')).toBeDefined()
    expect(btn.text()).toBe('Select assets to add')
  })

  it('counts the picked assets on the confirm button', async () => {
    items.value = [ETH, AAPL]
    const w = mountDialog()
    const rows = w.findAll('[data-test="asset-picker-row"]')
    await rows[0].trigger('click')
    expect(confirm(w).text()).toBe('Add 1 asset')
    await rows[1].trigger('click')
    expect(confirm(w).text()).toBe('Add 2 assets')
    expect(confirm(w).attributes('disabled')).toBeUndefined()
    // Un-picking returns to the untouched state.
    await rows[0].trigger('click')
    await rows[1].trigger('click')
    expect(confirm(w).attributes('disabled')).toBeDefined()
  })

  it('keeps picks across tab and category changes', async () => {
    items.value = [ETH]
    const w = mountDialog()
    await w.get('[data-test="asset-picker-row"]').trigger('click')
    await w.findAll('[data-test="tab-bar-item"]')[1].trigger('click')
    expect(confirm(w).text()).toBe('Add 1 asset')
    expect(
      w.get('[data-test="asset-picker-row"]').attributes('aria-pressed'),
    ).toBe('true')
  })

  it('keeps the category when the active tab is clicked again', async () => {
    const w = mountDialog()
    await chips(w)[1].trigger('click')
    await w.findAll('[data-test="tab-bar-item"]')[0].trigger('click')
    expect(pickerArgs.category.value).toBe('TECHNOLOGY')
  })

  it('blocks picks past the per-bucket cap and warns', async () => {
    const store = useWatchlistStore()
    store.watchListedStocks = Array.from({ length: 25 }, (_, i) => `S${i}`)
    const listed: AssetPickerItem = {
      ...AAPL,
      key: 'stock-S0',
      symbol: 'S0',
      watchlistId: 'S0',
    }
    items.value = [AAPL, listed]
    const w = mountDialog()
    const rows = w.findAll('[data-test="asset-picker-row"]')

    await rows[0].trigger('click')
    expect(rows[0].attributes('aria-pressed')).toBe('false')
    expect(confirm(w).attributes('disabled')).toBeDefined()
    expect(useToastStore().messages).toHaveLength(1)

    // Un-picking a listed stock frees the slot.
    await rows[1].trigger('click')
    await rows[0].trigger('click')
    expect(rows[0].attributes('aria-pressed')).toBe('true')
    // Crypto has its own bucket.
    items.value = [ETH]
    await flushPromises()
    await w.get('[data-test="asset-picker-row"]').trigger('click')
    expect(confirm(w).text()).toBe('Add 2 assets')
  })

  it('preselects watchlisted assets and saves the changes on confirm', async () => {
    const store = useWatchlistStore()
    store.setWatchlistItem('AAPL', true)
    items.value = [ETH, AAPL]
    const w = mountDialog()
    const rows = w.findAll('[data-test="asset-picker-row"]')
    expect(rows[1].attributes('aria-pressed')).toBe('true')

    // Only a removal → generic save label.
    await rows[1].trigger('click')
    expect(confirm(w).text()).toBe('Update watchlist')

    await rows[0].trigger('click')
    expect(confirm(w).text()).toBe('Add 1 asset')
    await confirm(w).trigger('click')
    await flushPromises()

    expect(store.watchListedStocks).toEqual([])
    expect(store.watchListedTokens).toEqual(['ethereum'])
    expect(w.emitted('update:isOpen')?.at(-1)).toEqual([false])
  })
})
