import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ref, reactive, unref } from 'vue'
import type { Ref } from 'vue'
import type { Contract, PerpsBalance, Position, TradingPair } from '@/modules/perps/sdk/types'

// ── Mocks ────────────────────────────────────────────────────
// usePerpsTradeForm pulls in the whole perps stack (auth, markets,
// positions, mark prices, toasts, analytics, router, wallet-menu store).
// For the limit-price validation (MEW-1915) we only drive `orderType` and
// `limitPrice`, so every dependency is stubbed just enough to instantiate.

// `usePerpsTradeForm` calls `useI18n()` synchronously in setup context. Mock
// it so tests assert on the i18n *keys* + params passed to `t`, not on
// hardcoded English sentences (those now live in `perps/en.json`). The mock
// echoes `key` when there are no params, or `key::<json params>` when there
// are, consistent with `usePerpsToasts.spec.ts`.
function mockT(key: string, params?: Record<string, unknown>): string {
  return params ? `${key}::${JSON.stringify(params)}` : key
}

// A shared `t` spy backed by a reactive `localeTick` ref that stands in for
// vue-i18n's reactive locale: reading it inside `t` means any `computed` that
// calls `t()` tracks it and re-evaluates on a locale switch — exactly how the
// real vue-i18n `t` behaves. This is what lets MEW-2112 assert the long/short
// toggle re-translates. The ref is created inside the (hoisted) factory, which
// runs at require time when the top-level `ref` import is already initialized
// (same trick as the usePerpsMarkets mock below).
const i18nMock = vi.hoisted(
  () =>
    ({ localeTick: null, tSpy: null }) as {
      localeTick: { value: number }
      tSpy: ReturnType<typeof vi.fn>
    },
)
vi.mock('vue-i18n', () => {
  i18nMock.localeTick = ref(0)
  i18nMock.tSpy = vi.fn((key: string, params?: Record<string, unknown>) => {
    void i18nMock.localeTick.value
    return mockT(key, params)
  })
  return { useI18n: () => ({ t: i18nMock.tSpy }) }
})

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

const walletMenuState = reactive<Record<string, unknown>>({
  selectedTradeOrderSide: 'buy',
  selectedTradeManageMode: null,
  selectedTradeTokenSymbol: 'AAPL-USD',
})
vi.mock('@/stores/walletMenuStore', () => ({
  useWalletMenuStore: () =>
    ({
      get selectedTradeOrderSide() {
        return walletMenuState.selectedTradeOrderSide
      },
      setSelectedTradeOrderSide: (v: unknown) => {
        walletMenuState.selectedTradeOrderSide = v
      },
      get selectedTradeManageMode() {
        return walletMenuState.selectedTradeManageMode
      },
      setSelectedTradeManageMode: (v: unknown) => {
        walletMenuState.selectedTradeManageMode = v
      },
      get selectedTradeTokenSymbol() {
        return walletMenuState.selectedTradeTokenSymbol
      },
      setSelectedTradeTokenSymbol: (v: unknown) => {
        walletMenuState.selectedTradeTokenSymbol = v
      },
    }) as unknown,
}))

vi.mock('@/analytics', () => ({
  analytics: new Proxy({}, { get: () => vi.fn() }),
  PerpsTradeOrderEvent: {},
  PerpsTpSlEvent: {},
  PerpsChangeLeverageEvent: {},
  PerpsClosePositionEvent: {},
}))

vi.mock('@/modules/perps/configs', () => ({
  perpsClient: new Proxy({}, { get: () => vi.fn() }),
  BUILDER_CODE: 'BC',
}))

const mockPerpsState = vi.hoisted(
  () =>
    ({
      balance: { value: null } as Ref<PerpsBalance | null>,
      positions: { value: [] } as unknown as Ref<Position[]>,
      markets: { value: [] } as unknown as Ref<TradingPair[]>,
    }) as const,
)

vi.mock('@/modules/perps/composables/usePerpsAuth', () => ({
  usePerpsAuth: () => ({
    token: ref(null),
    login: vi.fn(),
    triggerRefresh: vi.fn(),
  }),
  usePerpsBalance: () => ({ balance: mockPerpsState.balance }),
}))

// A settable contracts ref so tests can drive the market list (MEW-2025).
// The holder is hoisted (plain object, no vue); the real ref is created inside
// the mock factory — which runs at require time, when the top-level `ref`
// import is already initialized — so `filteredMarketList` recomputes on change.
const mockContracts = vi.hoisted(
  () => ({ contracts: null as unknown as Ref<Contract[]> }),
)
vi.mock('@/modules/perps/composables/usePerpsMarkets', () => {
  mockContracts.contracts = ref<Contract[]>([])
  return {
    usePerpsMarkets: () => ({
      markets: mockPerpsState.markets,
      isLoading: ref(false),
    }),
    usePerpsContracts: () => ({ contracts: mockContracts.contracts }),
  }
})

vi.mock('@/modules/perps/composables/usePerpsPositions', () => {
  return {
    usePerpsPositions: () => ({
      positions: mockPerpsState.positions,
      hasLoaded: ref(true),
      closePosition: vi.fn(),
    }),
  }
})

vi.mock('@/modules/perps/composables/usePerpsMarkPrices', () => ({
  usePerpsMarkPrices: () => ({ markPriceData: ref({}) }),
}))

vi.mock('@/modules/perps/composables/usePerpsToasts', () => ({
  usePerpsToasts: () => new Proxy({}, { get: () => vi.fn() }),
}))

import { usePerpsTradeForm } from '@/modules/perps/composables/usePerpsTradeForm'

describe('usePerpsTradeForm — target price required (MEW-1915)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    walletMenuState.selectedTradeOrderSide = 'buy'
    walletMenuState.selectedTradeManageMode = null
    walletMenuState.selectedTradeTokenSymbol = 'AAPL-USD'
    mockPerpsState.balance.value = null
    mockPerpsState.positions.value = []
    mockPerpsState.markets.value = []
  })

  it('flags an empty limit price as an error on the limit tab', () => {
    const form = usePerpsTradeForm()
    form.orderType.value = 'limit'
    form.limitPrice.value = ''
    expect(form.limitPriceHasError.value).toBe(true)
  })

  it('flags a zero limit price as an error on the limit tab', () => {
    const form = usePerpsTradeForm()
    form.orderType.value = 'limit'
    form.limitPrice.value = '0'
    expect(form.limitPriceHasError.value).toBe(true)
  })

  it('does not flag an empty price on the market tab', () => {
    const form = usePerpsTradeForm()
    form.orderType.value = 'market'
    form.limitPrice.value = ''
    expect(form.limitPriceHasError.value).toBe(false)
  })

  it('resolves the enter-target-price key in the submit button when limit price is empty', () => {
    const form = usePerpsTradeForm()
    form.orderType.value = 'limit'
    form.limitPrice.value = ''
    expect(form.submitButtonLabel.value).toBe('perps.trade.enter-target-price')
  })

  it('resolves the enter-target-price key in the submit button when limit price is zero', () => {
    const form = usePerpsTradeForm()
    form.orderType.value = 'limit'
    form.limitPrice.value = '0'
    expect(form.submitButtonLabel.value).toBe('perps.trade.enter-target-price')
  })

  it('does not resolve the enter-target-price key on the market tab', () => {
    const form = usePerpsTradeForm()
    form.orderType.value = 'market'
    form.limitPrice.value = ''
    expect(form.submitButtonLabel.value).not.toBe(
      'perps.trade.enter-target-price',
    )
  })

  it('disables submit when limit price is empty', () => {
    const form = usePerpsTradeForm()
    form.orderType.value = 'limit'
    form.limitPrice.value = ''
    expect(form.submitDisabled.value).toBe(true)
  })
})

describe('usePerpsTradeForm — i18n label keys (MEW-2012)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    walletMenuState.selectedTradeOrderSide = 'buy'
    walletMenuState.selectedTradeManageMode = null
    walletMenuState.selectedTradeTokenSymbol = 'AAPL-USD'
  })

  it('resolves the open-position key + direction/symbol params with no active position', () => {
    const form = usePerpsTradeForm()
    form.orderType.value = 'market'
    expect(form.submitButtonLabel.value).toBe(
      mockT('perps.trade.open-position', {
        direction: mockT('perps.trade.long'),
        symbol: 'AAPL',
      }),
    )
  })

  it('resolves the short direction label when order side is sell', () => {
    const form = usePerpsTradeForm()
    form.orderType.value = 'market'
    form.setOrderSide('sell')
    expect(form.submitButtonLabel.value).toBe(
      mockT('perps.trade.open-position', {
        direction: mockT('perps.trade.short'),
        symbol: 'AAPL',
      }),
    )
  })

  it('resolves the close-position key + direction/symbol params for closeButtonLabel', () => {
    const form = usePerpsTradeForm()
    expect(form.closeButtonLabel.value).toBe(
      mockT('perps.trade.close-position', {
        symbol: 'AAPL',
        direction: mockT('perps.trade.short'),
      }),
    )
  })

  it('resolves the closing key on closeButtonLabel while a close is in flight', () => {
    const form = usePerpsTradeForm()
    form.isClosing.value = true
    expect(form.closeButtonLabel.value).toBe('perps.trade.closing')
  })

  it('builds orderSideButtons labels from the long/short i18n keys', () => {
    const form = usePerpsTradeForm()
    expect(unref(form.orderSideButtons)).toEqual([
      { label: 'perps.trade.long', value: 'buy' },
      { label: 'perps.trade.short', value: 'sell' },
    ])
  })

  it('re-translates the long/short toggle when the locale changes (MEW-2112)', () => {
    const form = usePerpsTradeForm()
    const labels = () => unref(form.orderSideButtons).map(b => b.label)
    const longCalls = () =>
      i18nMock.tSpy.mock.calls.filter(c => c[0] === 'perps.trade.long').length

    expect(labels()).toEqual(['perps.trade.long', 'perps.trade.short'])
    const before = longCalls()

    // vue-i18n flips its reactive locale on a language switch.
    i18nMock.localeTick.value++
    labels() // consumer (the v-for) re-reads on re-render

    // A `computed` re-invokes `t()` after the locale changes; the old plain
    // array froze its labels at setup and never re-called `t` — that was the bug.
    expect(longCalls()).toBeGreaterThan(before)
  })

  it('builds marketFilterTabs labels from i18n keys while keeping keys stable', () => {
    const form = usePerpsTradeForm()
    expect(form.marketFilterTabs).toEqual([
      { key: 'all', label: 'perps.select-market.filter-tab-all' },
      { key: 'Equities', label: 'perps.select-market.filter-tab-equities' },
      {
        key: 'Commodities',
        label: 'perps.select-market.filter-tab-commodities',
      },
      { key: 'Indices', label: 'perps.select-market.filter-tab-indices' },
    ])
  })

  it('builds marketSortOptions labels from i18n keys while keeping values stable', () => {
    const form = usePerpsTradeForm()
    expect(form.marketSortOptions).toEqual([
      {
        value: 'name',
        label: 'perps.select-market.sort-name',
        numeric: false,
      },
      {
        value: 'volume',
        label: 'perps.select-market.sort-volume',
        numeric: true,
      },
      {
        value: 'price',
        label: 'perps.select-market.sort-price',
        numeric: true,
      },
      {
        value: 'priceChange',
        label: 'perps.select-market.sort-price-change',
        numeric: true,
      },
    ])
  })
})

describe('usePerpsTradeForm — hide disabled tokens (MEW-2025)', () => {
  const makeContract = (market: string, disabled: boolean) =>
    ({
      market,
      baseCurrency: market.split('-')[0],
      quoteCurrency: 'USD',
      disabled,
      usdVolume: '0',
      priceChangePercent: '0',
      bid: '1',
      ask: '1',
      indexPrice: '1',
      tags: [],
    }) as unknown as Contract

  beforeEach(() => {
    vi.clearAllMocks()
    walletMenuState.selectedTradeOrderSide = 'buy'
    walletMenuState.selectedTradeManageMode = null
    walletMenuState.selectedTradeTokenSymbol = 'AAA-USD'
  })

  afterEach(() => {
    mockContracts.contracts.value = []
  })

  it('excludes contracts flagged disabled from the market selector list', () => {
    mockContracts.contracts.value = [
      makeContract('AAA-USD', false),
      makeContract('BBB-USD', true),
      makeContract('CCC-USD', false),
    ]
    const form = usePerpsTradeForm()
    const markets = form.filteredMarketList.value.map(c => c.market)
    expect(markets).toContain('AAA-USD')
    expect(markets).toContain('CCC-USD')
    expect(markets).not.toContain('BBB-USD')
  })

  it('keeps every contract when none are disabled', () => {
    mockContracts.contracts.value = [
      makeContract('AAA-USD', false),
      makeContract('BBB-USD', false),
    ]
    const form = usePerpsTradeForm()
    expect(form.filteredMarketList.value).toHaveLength(2)
  })
})

describe('usePerpsTradeForm — cross-margin liquidation estimate', () => {
  beforeEach(() => {
    walletMenuState.selectedTradeOrderSide = 'sell'
    walletMenuState.selectedTradeManageMode = null
    walletMenuState.selectedTradeTokenSymbol = 'MSFT-USD'
    mockPerpsState.balance.value = {
      walletBalance: '110.621987',
      realizedPnl: '-0.006',
      unrealizedPnl: '0.864695',
      marginBalance: '111.486682',
      usedMargin: '65.768924',
      availableMargin: '45.717758',
      withdrawableMargin: '45.717758',
      maintenanceMarginRequirement: '32.401618',
      totalMaintenanceMargin: '32.401618',
      marginRatio: '0.2907',
      leverage: '10.5',
      underLiquidation: false,
      totalFundingPayments: '-0.012631',
      totalTradingFees: '0.32247',
      totalPnL: '0.523594',
      netInvested: '110.640618',
    }
    mockPerpsState.positions.value = []
    mockPerpsState.markets.value = [
      {
        market: 'MSFT-USD.P',
        pair: { base: 'MSFT', quote: 'USD' },
        defaultLeverage: '10',
        marginInfo: [
          {
            positionBracketUsd: '1000000',
            maintenanceMarginRate: '0.05',
            maintenanceAmount: '0',
            maxLeverage: '10',
          },
        ],
      } as TradingPair,
    ]
    mockContracts.contracts.value = [
      {
        market: 'MSFT-USD.P',
        baseCurrency: 'MSFT',
        quoteCurrency: 'USD',
        disabled: false,
        bid: '396.2',
        ask: '396.2',
      } as Contract,
    ]
  })

  afterEach(() => {
    mockContracts.contracts.value = []
  })

  it('uses the balance snapshot total when positions have not refreshed yet', () => {
    const form = usePerpsTradeForm()
    form.setOrderSide('sell')
    form.inputAmount.value = '2'

    expect(form.currentPrice.value).toBe(396.2)
    expect(form.positionSizeUsd.value).toBe(20)
    expect(form.estimatedLiquidation.value).toBeCloseTo(1869.4, 2)
  })
})
