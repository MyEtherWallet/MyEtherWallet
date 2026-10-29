import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { ref } from 'vue'
import { createI18n } from 'vue-i18n'

const push = vi.fn()
vi.mock('vue-router', async () => ({
  RouterLink: (await import('@vue/test-utils')).RouterLinkStub,
  useRouter: () => ({ push }),
}))

// jsdom has no layout: the table wrapper sizes itself from this width
// (L ≥1280, M ≥768, S below).
const cardWidth = ref(1300)
vi.mock('@vueuse/core', async importOriginal => ({
  ...(await importOriginal<typeof import('@vueuse/core')>()),
  useElementSize: () => ({ width: cardWidth, height: ref(0) }),
}))

// The real analytics module pulls the router and the wallet (Ledger) stack.
vi.mock('@/analytics', async () => ({
  ...(await vi.importActual('@/analytics/events')),
  analytics: { trackClickTokenTradeEvent: vi.fn() },
}))
vi.mock('@/stores/walletStore', async () => {
  const { defineStore } = await import('pinia')
  const { ref: r } = await import('vue')
  return {
    useWalletStore: defineStore('wallet', () => ({
      isWalletConnected: r(true),
      formattedTotalFiatPortfolioValue: r('$6.00'),
      isLoadingBalances: r(false),
      allTokens: r([
        {
          symbol: 'aaa',
          name: 'Aaa',
          coinId: 'aaa',
          contract: '0xa',
          balance: '1',
          price: 1,
          market_cap: 100,
        },
        {
          symbol: 'bbb',
          name: 'Bbb',
          coinId: 'bbb',
          contract: '0xb',
          balance: '1',
          price: 3,
          market_cap: 200,
        },
        {
          symbol: 'ccc',
          name: 'Ccc',
          coinId: 'ccc',
          contract: '0xc',
          balance: '1',
          price: 2,
          market_cap: 300,
        },
      ]),
      allStocks: r([
        {
          symbol: 'AAPLon',
          name: 'Apple',
          contract: '0xs',
          balance: '1',
          price: 5,
          market_cap: 10,
          ondo: { stockAlias: 'Apple', primaryMarket: { symbol: 'AAPLon' } },
        },
      ]),
      walletAddress: r('0x0'),
    })),
  }
})
vi.mock('@/stores/chainsStore', async () => {
  const { defineStore } = await import('pinia')
  const { ref: r } = await import('vue')
  return {
    useChainsStore: defineStore('chains', () => ({
      selectedChain: r({ name: 'ETHEREUM', chainID: '1' }),
      currentChainhasSwapSupport: r(true),
    })),
  }
})
vi.mock('@/stores/purchaseStore', () => ({
  usePurchaseStore: () => ({ isBuyableOnCompatibleChain: () => true }),
}))
vi.mock('@/composables/useFetchWatchlist', async () => {
  const { ref: r } = await import('vue')
  return {
    useFetchWatchlist: () => ({
      tokensWatchlistData: r([]),
      stocksWatchlistData: r([]),
      isFetchingTokensWatchlist: r(false),
      isFetchingStocksWatchlist: r(false),
      fetchAllWatchlist: vi.fn(),
    }),
  }
})
vi.mock(
  '@/modules/portfolio/components/balances/CustomTokensDialog.vue',
  () => ({
    default: { template: '<div />' },
  }),
)

import TableTokenBalance from '@/modules/portfolio/components/balances/TableTokenBalance.vue'
import AppTableRow from '@/components/table/AppTableRow.vue'
import AppCellWatchlistToggle from '@/components/cell/AppCellWatchlistToggle.vue'
import { useWalletStore } from '@/stores/walletStore'
import { useTokenInfoStore } from '@/stores/tokenInfoStore'
import { useCustomTokenStore } from '@/stores/customTokenStore'
import { TOKEN_INFO_ROUTE_NAMES } from '@/router/routeNames'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    en: { portfolio: { table: { results_of: '{count} of {total} results' } } },
  },
})

const mountTable = (view = 'all') =>
  mount(TableTokenBalance, {
    props: { view: view as 'all' },
    global: {
      plugins: [i18n],
      directives: { ripple: {} },
      // The empty-watchlist state uses the global router-link.
      stubs: { RouterLink: RouterLinkStub },
    },
  })

// Row titles (symbols) in render order.
const symbols = (w: ReturnType<typeof mountTable>) =>
  w.findAllComponents(AppTableRow).map(r => r.props('title'))

const BODY_ROW = '[role="rowgroup"] [role="row"]'
const buttonTexts = (w: ReturnType<typeof mountTable>) =>
  w.findAll(`${BODY_ROW} button`).map(b => b.text())
const headers = (w: ReturnType<typeof mountTable>) =>
  w.findAll('[role="columnheader"]').map(h => h.text())

describe('TableTokenBalance', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    cardWidth.value = 1300
  })

  it('cycles a header sort desc → asc → off, off being market cap asc', async () => {
    const w = mountTable()
    expect(symbols(w)).toEqual(['AAA', 'BBB', 'CCC'])

    const price = w
      .findAll('[role="columnheader"] button')
      .find(b => b.text() === 'portfolio.table.price_header')!
    await price.trigger('click')
    expect(symbols(w)).toEqual(['BBB', 'CCC', 'AAA'])
    await price.trigger('click')
    expect(symbols(w)).toEqual(['AAA', 'CCC', 'BBB'])
    await price.trigger('click')
    expect(symbols(w)).toEqual(['AAA', 'BBB', 'CCC'])
  })

  it('sorts the token column in the direction its arrow shows', async () => {
    const w = mountTable()
    const token = w
      .findAll('[role="columnheader"] button')
      .find(b => b.text() === 'portfolio.table.token_header')!
    await token.trigger('click')
    expect(symbols(w)).toEqual(['CCC', 'BBB', 'AAA'])
    await token.trigger('click')
    expect(symbols(w)).toEqual(['AAA', 'BBB', 'CCC'])
  })

  it('shows swap + buy at L, swap at M, the action menu at S', async () => {
    const w = mountTable()
    expect(buttonTexts(w).filter(t => t === 'common.swap')).toHaveLength(3)
    expect(buttonTexts(w).filter(t => t === 'common.buy')).toHaveLength(3)

    cardWidth.value = 900
    await w.vm.$nextTick()
    expect(buttonTexts(w).filter(t => t === 'common.swap')).toHaveLength(3)
    expect(buttonTexts(w)).not.toContain('common.buy')

    cardWidth.value = 400
    await w.vm.$nextTick()
    // Swap moves into the menu, as a button so the keyboard reaches it.
    const inline = w
      .findAll(`${BODY_ROW} button`)
      .filter(b => !b.element.closest('li'))
    expect(inline.map(b => b.text())).not.toContain('common.swap')
    expect(w.findAll(`${BODY_ROW} li > button`).map(b => b.text())).toContain(
      'common.swap',
    )
    expect(
      w.findAll(`${BODY_ROW} [aria-label="common.action_menu"]`),
    ).toHaveLength(3)
  })

  it('shows the market cap column at L only', async () => {
    const w = mountTable()
    expect(headers(w)).toContain('portfolio.table.market_cap_header')
    cardWidth.value = 900
    await w.vm.$nextTick()
    expect(headers(w)).not.toContain('portfolio.table.market_cap_header')
    expect(headers(w)).toContain('portfolio.table.price_header')
  })

  it('links each row to its token page and primes the token info', async () => {
    const w = mountTable()
    const link = w.getComponent(RouterLinkStub)
    expect(link.props('to')).toEqual({
      name: TOKEN_INFO_ROUTE_NAMES.home,
      params: { tokenId: 'aaa' },
    })
    await link.trigger('click')
    expect(useTokenInfoStore().tokenInfo).toMatchObject({ coinId: 'aaa' })
    expect(push).not.toHaveBeenCalled()
  })

  it('shows a page of skeleton rows while balances load', () => {
    useWalletStore().isLoadingBalances = true
    const w = mountTable()
    expect(w.get('[role="table"]').attributes('aria-busy')).toBe('true')
    expect(w.findAllComponents(AppTableRow)).toHaveLength(10)
    expect(w.get('nav p').text()).toBe('')
  })

  it('keeps the watchlist star on custom tokens that have a watchlist id', () => {
    useCustomTokenStore().addCustomToken('ETHEREUM', {
      name: 'Aaa',
      symbol: 'aaa',
      address: '0xa',
      decimals: 18,
    })
    const w = mountTable('custom')
    expect(symbols(w)).toEqual(['AAA'])
    expect(w.findAllComponents(AppCellWatchlistToggle)).toHaveLength(1)
  })

  it('labels the pager with the results shown so far', () => {
    expect(mountTable().get('nav p').text()).toBe('3 of 3 results')
  })

  it('titles stocks with their ticker and a gradient "on"', () => {
    const title = mountTable('stocks').get(
      '[role="rowgroup"] [data-testid="cg-title"]',
    )
    expect(title.text()).toBe('AAPLon')
    expect(title.get('span.bg-stock-gradient').text()).toBe('on')

    const crypto = mountTable().get(
      '[role="rowgroup"] [data-testid="cg-title"]',
    )
    expect(crypto.text()).toBe('AAA')
    expect(crypto.find('span.bg-stock-gradient').exists()).toBe(false)
  })

  it('shows coming soon instead of the table for the earning filter', () => {
    const w = mountTable('earning')
    expect(w.text()).toContain('common.coming_soon')
    expect(w.find('[role="table"]').exists()).toBe(false)
  })
})
