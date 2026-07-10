import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref, reactive } from 'vue'

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

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: vi.fn(mockT) }),
}))

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

vi.mock('@/modules/perps/composables/usePerpsAuth', () => ({
  usePerpsAuth: () => ({
    token: ref(null),
    login: vi.fn(),
    triggerRefresh: vi.fn(),
  }),
  usePerpsBalance: () => ({ balance: ref(null) }),
}))

vi.mock('@/modules/perps/composables/usePerpsMarkets', () => ({
  usePerpsMarkets: () => ({ markets: ref([]), isLoading: ref(false) }),
  usePerpsContracts: () => ({ contracts: ref([]) }),
}))

vi.mock('@/modules/perps/composables/usePerpsPositions', () => ({
  usePerpsPositions: () => ({
    positions: ref([]),
    hasLoaded: ref(true),
    closePosition: vi.fn(),
  }),
}))

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
    expect(form.orderSideButtons).toEqual([
      { label: 'perps.trade.long', value: 'buy' },
      { label: 'perps.trade.short', value: 'sell' },
    ])
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
