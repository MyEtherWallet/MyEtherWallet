import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { createI18n } from 'vue-i18n'

const push = vi.fn()
vi.mock('vue-router', () => ({ useRouter: () => ({ push }) }))

// jsdom has no layout: the table wrapper sizes itself from this width
// (L ≥1280, M ≥768, S below).
const cardWidth = ref(1300)
vi.mock('@vueuse/core', async importOriginal => ({
  ...(await importOriginal<typeof import('@vueuse/core')>()),
  useElementSize: () => ({ width: cardWidth, height: ref(0) }),
}))

// The real analytics module pulls the router and the wallet (Ledger) stack.
vi.mock('@/analytics', () => ({
  analytics: { trackClickTokenTradeEvent: vi.fn() },
  ClickTokenTradeEvent: { BUY: 'buy', SWAP: 'swap', TRADE: 'trade' },
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
      stubs: { RouterLink: true },
    },
  })

// Row titles (symbols) in render order.
const symbols = (w: ReturnType<typeof mountTable>) =>
  w.findAllComponents(AppTableRow).map(r => r.props('title'))

// Body rows are the clickable ones; the header row has no tabindex.
const buttonTexts = (w: ReturnType<typeof mountTable>) =>
  w.findAll('[role="row"][tabindex] button').map(b => b.text())

describe('TableTokenBalance', () => {
  beforeEach(() => {
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
    expect(buttonTexts(w)).not.toContain('common.swap')
    expect(
      w.findAll('[role="row"][tabindex] [aria-label="common.action_menu"]'),
    ).toHaveLength(3)
  })

  it('opens the token page on row click', async () => {
    const w = mountTable()
    await w.find('[role="row"][tabindex]').trigger('click')
    expect(push).toHaveBeenCalledWith({
      name: expect.any(String),
      params: { tokenId: 'aaa' },
    })
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
