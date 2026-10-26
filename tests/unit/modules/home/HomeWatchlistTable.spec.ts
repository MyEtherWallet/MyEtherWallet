import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
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

// jsdom has no layout: the table wrapper sizes itself from this width
// (L ≥1280, M ≥768, S below).
const cardWidth = ref(1300)
vi.mock('@vueuse/core', async importOriginal => ({
  ...(await importOriginal<typeof import('@vueuse/core')>()),
  useElementSize: () => ({ width: cardWidth, height: ref(0) }),
}))
// The logo pulls the stocks store — stub it.
vi.mock('@/components/AppTokenLogo.vue', () => ({
  default: { template: '<span />' },
}))
vi.mock('@/components/AppSearchbar.vue', () => ({
  default: {
    props: ['modelValue', 'placeholder', 'bgClass', 'size'],
    emits: ['update:modelValue'],
    template:
      '<input data-test="search" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
  },
}))
vi.mock('@/components/tooltip/AppTooltip.vue', () => ({
  default: {
    props: ['text', 'placement'],
    template: '<div data-test="tooltip" :data-text="text"><slot /></div>',
  },
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
import AppTable from '@/components/table/AppTable.vue'
import AppCellWatchlistToggle from '@/components/cell/AppCellWatchlistToggle.vue'
import { useWatchlistStore, WATCHLIST_MAX } from '@/stores/watchlistTableStore'
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
    global: { plugins: [i18n], directives: { ripple: {} } },
  })

// The star lives inside AppTableRow (no data-test of its own).
const stars = (w: ReturnType<typeof mountTable>) =>
  w.findAllComponents(AppCellWatchlistToggle)

describe('HomeWatchlistTable (MEW-2130)', () => {
  beforeEach(() => {
    localStorage.clear()
    cardWidth.value = 1300
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
    const removeButtons = stars(w)
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

  it('the row is focusable and Enter opens the drawer (keyboard access)', async () => {
    const w = mountTable([makeRow()])
    const row = w.get('[data-test="watchlist-row"]')
    expect(row.attributes('tabindex')).toBe('0')
    await row.trigger('keydown', { key: 'Enter' })
    expect(push).toHaveBeenCalledWith(makeRow().route)
  })

  it('titles a stock row with the ticker and a gradient "on"', () => {
    const [stock, crypto] = mountTable().findAll(
      '[data-test="watchlist-row"] [data-testid="cg-title"]',
    )
    expect(stock.text()).toBe('AAPLon')
    expect(stock.get('span.bg-stock-gradient').text()).toBe('on')
    expect(crypto.text()).toBe('ETH')
    expect(crypto.find('span.bg-stock-gradient').exists()).toBe(false)
  })

  it('clicking the star (remove) does not navigate', async () => {
    const w = mountTable()
    await stars(w)[0].trigger('click')
    expect(push).not.toHaveBeenCalled()
  })

  it('clicking the trade action does not navigate', async () => {
    const w = mountTable()
    await w.findAll('[data-test="watchlist-trade"]')[0].trigger('click')
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
    const showMore = () =>
      w.findAll('button').find(b => b.text() === 'common.show_count_more')
    await showMore()!.trigger('click')
    expect(w.findAll('[data-test="watchlist-row"]').length).toBe(7)
    expect(showMore()).toBeUndefined()
  })

  it('reordering persists the full key order, hidden rows last', () => {
    const rows = Array.from({ length: 7 }, (_, i) =>
      makeRow({ key: `token-${i}`, symbol: `T${i}`, removeId: `t${i}` }),
    )
    const w = mountTable(rows)
    w.findComponent(AppTable).vm.$emit('reorder', { from: 0, to: 2 })
    expect(useWatchlistStore().watchlistOrder).toEqual([
      'token-1',
      'token-2',
      'token-0',
      'token-3',
      'token-4',
      'token-5',
      'token-6',
    ])
  })

  it('turns reordering off while a filter is active', async () => {
    const w = mountTable()
    expect(w.findComponent(AppTable).props('reorderable')).toBe(true)
    await w.get('[data-test="search"]').setValue('apple')
    expect(w.findComponent(AppTable).props('reorderable')).toBe(false)
  })

  it('size S keeps price only and moves the action into the ellipsis menu', async () => {
    cardWidth.value = 400
    const walletMenu = useWalletMenuStore()
    const w = mountTable()
    expect(w.findAll('[role="columnheader"]').map(h => h.text())).toEqual([
      'common.watchlist',
      'homePage.hero.watchlist.table.columns.token',
      'homePage.hero.watchlist.table.columns.price',
      'common.actions',
    ])
    expect(w.find('[data-test="watchlist-trade"]').exists()).toBe(false)
    await w.findAll('[data-test="watchlist-menu"]')[0].trigger('click')
    await w.get('[data-test="watchlist-menu-trade"]').trigger('click')
    expect(walletMenu.walletPanel).toBe('trade')
    expect(push).not.toHaveBeenCalled()
    expect(w.find('[data-test="watchlist-menu-trade"]').exists()).toBe(false)
  })

  it('the ellipsis menu removes the row from the watchlist', async () => {
    cardWidth.value = 400
    const store = useWatchlistStore()
    store.setWatchlistItem('AAPL', true)
    const w = mountTable()
    await w.findAll('[data-test="watchlist-menu"]')[0].trigger('click')
    await w.get('[data-test="watchlist-menu-remove"]').trigger('click')
    expect(store.watchListedStocks).toEqual([])
    expect(push).not.toHaveBeenCalled()
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
    expect(stars(w).length).toBe(1)
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
