import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import type { WatchlistRow } from '@/modules/home/composables/useWatchlistRows'

const makeRow = (over: Partial<WatchlistRow> = {}): WatchlistRow => ({
  key: 'token-ethereum',
  symbol: 'ETH',
  name: 'Ethereum',
  isStock: false,
  priceDisplay: '$3,000',
  change: -1.2,
  marketCapDisplay: '$360B',
  volumeDisplay: '$33B',
  sparkline: [3, 2, 1],
  route: { name: 'token-info-home', params: { tokenId: 'ethereum' } },
  tradeSymbol: 'ETH',
  removeType: 'crypto',
  removeId: 'ethereum',
  ...over,
})

const ROWS: WatchlistRow[] = [
  makeRow({
    key: 'stock-AAPL',
    symbol: 'AAPL',
    name: 'Apple',
    isStock: true,
    priceDisplay: '$256.72',
    change: 2.87,
    marketCapDisplay: '$178.43M',
    volumeDisplay: '$9.8M',
    route: { name: 'home-stock-info', params: { symbol: 'AAPL' } },
    tradeSymbol: 'AAPL',
    removeType: 'stock',
    removeId: 'AAPL',
  }),
  makeRow(),
]

const push = vi.fn()
vi.mock('vue-router', () => ({ useRouter: () => ({ push }) }))

// vuedraggable → render the #item slot per element (no real DnD in jsdom).
vi.mock('vuedraggable', () => ({
  default: {
    props: ['modelValue'],
    template:
      '<ul><template v-for="(el,i) in modelValue" :key="el.key"><slot name="item" :element="el" :index="i" /></template></ul>',
  },
}))
// Visual children pull the stocks store / chart.js — stub them.
vi.mock('@/components/AppTokenLogo.vue', () => ({
  default: { template: '<span />' },
}))
vi.mock('@/components/AppTokenSymbol.vue', () => ({
  default: { props: ['symbol'], template: '<span>{{ symbol }}</span>' },
}))
vi.mock('@/components/AppSearchInput.vue', () => ({
  default: {
    props: ['modelValue', 'placeholder', 'bgClass'],
    emits: ['update:modelValue'],
    template:
      '<input data-test="search" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
  },
}))
vi.mock('@/components/AppTooltip.vue', () => ({
  default: {
    props: ['text', 'position'],
    template: '<div data-test="tooltip" :data-text="text"><slot /></div>',
  },
}))
vi.mock('@/components/TableSparkline.vue', () => ({
  default: { template: '<span data-test="sparkline" />' },
}))
// The add-to-watchlist dialog pulls the asset-picker (perps SDK) — stub it and
// expose its open state.
vi.mock('@/modules/home/components/AddToWatchlistDialog.vue', () => ({
  default: {
    props: ['isOpen'],
    template: '<div data-test="add-dialog" :data-open="isOpen" />',
  },
}))
// The crypto action primes + opens the swap/bridge panel through this helper
// (which pulls the swap stack / Ledger). Stub it and assert the calls.
const openSwapForToken = vi.fn()
const openBridgeForToken = vi.fn()
vi.mock('@/modules/home/composables/useNewListingSwap', () => ({
  useNewListingSwap: () => ({ openSwapForToken, openBridgeForToken }),
}))

import HomeWatchlistTable from '@/modules/home/components/HomeWatchlistTable.vue'
import {
  useWatchlistStore,
  WATCHLIST_MAX,
} from '@/stores/watchlistTableStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: {} },
})

const mountTable = (rows: WatchlistRow[] = ROWS) =>
  mount(HomeWatchlistTable, {
    props: { rows },
    global: {
      plugins: [i18n],
      stubs: { RouterLink: { props: ['to'], template: '<a><slot /></a>' } },
    },
  })

describe('HomeWatchlistTable (MEW-2130)', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    push.mockClear()
    openSwapForToken.mockClear()
    openBridgeForToken.mockClear()
  })

  it('renders one row per provided watchlist row', () => {
    expect(mountTable().findAll('[data-test="watchlist-row"]').length).toBe(2)
  })

  it('star removes the item from the matching store bucket', async () => {
    const store = useWatchlistStore()
    store.setWatchlistItem('AAPL', true)
    store.setWatchlistItem('ethereum', false)
    const w = mountTable()
    const removeButtons = w.findAll('[data-test="watchlist-remove"]')
    await removeButtons[0].trigger('click') // AAPL (stock)
    expect(store.watchListedStocks).toEqual([])
    await removeButtons[1].trigger('click') // ethereum (crypto)
    expect(store.watchListedTokens).toEqual([])
  })

  it('Trade opens the trade side panel in place, without navigating', async () => {
    const walletMenu = useWalletMenuStore()
    const w = mountTable()
    await w.findAll('[data-test="watchlist-trade"]')[0].trigger('click')
    expect(walletMenu.selectedTradeTokenSymbol).toBe('AAPL')
    expect(walletMenu.walletPanel).toBe('trade')
    expect(walletMenu.isOpenSideMenu).toBe(true)
    expect(push).not.toHaveBeenCalled()
  })

  it('clicking the row body opens the asset info drawer', async () => {
    const w = mountTable()
    await w.findAll('[data-test="watchlist-row"]')[0].trigger('click')
    expect(push).toHaveBeenCalledWith(ROWS[0].route)
  })

  it('exposes a focusable link for the row body (keyboard access)', () => {
    const w = mountTable([makeRow()])
    const link = w.find('[data-test="watchlist-row-link"]')
    expect(link.exists()).toBe(true)
    expect(link.element.tagName).toBe('A')
  })

  it('clicking the star (remove) does not navigate', async () => {
    const w = mountTable()
    await w.findAll('[data-test="watchlist-remove"]')[0].trigger('click')
    expect(push).not.toHaveBeenCalled()
  })

  it('primes and opens Bridge with the row chains for a bridge cta', async () => {
    const chains = [{ chainName: 'Polygon', contract: '0x1', decimals: 18 }]
    const nativeChains = [{ chainName: 'Solana', decimals: 9 }]
    const w = mountTable([
      makeRow({ removeType: 'crypto', cta: 'bridge', chains, nativeChains }),
    ])
    await w.get('[data-test="watchlist-trade"]').trigger('click')
    expect(openBridgeForToken).toHaveBeenCalledWith(
      'ETH',
      'Ethereum',
      nativeChains,
      chains,
    )
    expect(openSwapForToken).not.toHaveBeenCalled()
  })

  it('primes and opens Swap for a crypto row without a bridge cta', async () => {
    const chains = [{ chainName: 'Ethereum', contract: '0x1', decimals: 18 }]
    const w = mountTable([
      makeRow({ removeType: 'crypto', cta: 'swap', chains, nativeChains: [] }),
    ])
    await w.get('[data-test="watchlist-trade"]').trigger('click')
    expect(openSwapForToken).toHaveBeenCalledWith('ETH', 'Ethereum', chains, [])
    expect(openBridgeForToken).not.toHaveBeenCalled()
  })

  it('caps the list at 5 and expands via Show more', async () => {
    const rows = Array.from({ length: 7 }, (_, i) =>
      makeRow({ key: `token-${i}`, symbol: `T${i}`, removeId: `t${i}` }),
    )
    const w = mountTable(rows)
    expect(w.findAll('[data-test="watchlist-row"]').length).toBe(5)
    await w.get('[data-test="watchlist-show-more"]').trigger('click')
    expect(w.findAll('[data-test="watchlist-row"]').length).toBe(7)
    expect(w.find('[data-test="watchlist-show-more"]').exists()).toBe(false)
  })

  it('filters rows by category (crypto only)', async () => {
    const w = mountTable()
    expect(w.findAll('[data-test="watchlist-row"]').length).toBe(2)
    await w.get('[data-test="watchlist-category"]').trigger('click')
    await w
      .get('[data-test="category-option"][data-value="crypto"]')
      .trigger('click')
    const rows = w.findAll('[data-test="watchlist-row"]')
    expect(rows.length).toBe(1) // only ETH (crypto)
  })

  it('filters rows by search query', async () => {
    const w = mountTable()
    await w.get('[data-test="search"]').setValue('apple')
    expect(w.findAll('[data-test="watchlist-row"]').length).toBe(1)
  })

  it('renders a loading row as a skeleton (star kept, no trade button)', () => {
    const w = mountTable([
      makeRow({ key: 'token-solana', symbol: '', name: '', loading: true }),
    ])
    expect(w.findAll('[data-test="watchlist-row"]').length).toBe(1)
    expect(w.find('[data-test="watchlist-remove"]').exists()).toBe(true)
    expect(w.find('[data-test="watchlist-trade"]').exists()).toBe(false)
  })

  it('Add asset opens the add-to-watchlist dialog on demand', async () => {
    const w = mountTable()
    expect(w.find('[data-test="add-dialog"]').exists()).toBe(false)
    await w.get('[data-test="watchlist-add-new"]').trigger('click')
    expect(w.get('[data-test="add-dialog"]').attributes('data-open')).toBe(
      'true',
    )
    expect(push).not.toHaveBeenCalled()
  })

  it('disables the Add asset button with a tooltip once both buckets are full (MEW-2374)', () => {
    const store = useWatchlistStore()
    for (let i = 0; i < WATCHLIST_MAX; i++) {
      store.setWatchlistItem(`coin-${i}`, false) // crypto
      store.setWatchlistItem(`STK-${i}`, true) // stock
    }
    const w = mountTable()
    expect(
      w.get('[data-test="watchlist-add-new"]').attributes('disabled'),
    ).toBeDefined()
    // The wrapping tooltip carries a message while the button is disabled.
    const tooltips = w.findAll('[data-test="tooltip"]')
    expect(
      tooltips.some(tip => (tip.attributes('data-text') ?? '').length > 0),
    ).toBe(true)
  })

  it('keeps the Add asset button enabled (no tooltip) while a bucket has room', () => {
    const store = useWatchlistStore()
    // Crypto full, stocks empty → still something to add.
    for (let i = 0; i < WATCHLIST_MAX; i++) {
      store.setWatchlistItem(`coin-${i}`, false)
    }
    const w = mountTable()
    expect(
      w.get('[data-test="watchlist-add-new"]').attributes('disabled'),
    ).toBeUndefined()
    const tooltips = w.findAll('[data-test="tooltip"]')
    expect(
      tooltips.every(tip => (tip.attributes('data-text') ?? '') === ''),
    ).toBe(true)
  })
})
