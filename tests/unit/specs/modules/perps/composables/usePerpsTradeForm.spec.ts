import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref, reactive } from 'vue'

// ── Mocks ────────────────────────────────────────────────────
// usePerpsTradeForm pulls in the whole perps stack (auth, markets,
// positions, mark prices, toasts, analytics, router, wallet-menu store).
// For the limit-price validation (MEW-1915) we only drive `orderType` and
// `limitPrice`, so every dependency is stubbed just enough to instantiate.

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

  it('shows "Enter target price" in the submit button when limit price is empty', () => {
    const form = usePerpsTradeForm()
    form.orderType.value = 'limit'
    form.limitPrice.value = ''
    expect(form.submitButtonLabel.value).toBe('Enter target price')
  })

  it('shows "Enter target price" in the submit button when limit price is zero', () => {
    const form = usePerpsTradeForm()
    form.orderType.value = 'limit'
    form.limitPrice.value = '0'
    expect(form.submitButtonLabel.value).toBe('Enter target price')
  })

  it('does not show "Enter target price" on the market tab', () => {
    const form = usePerpsTradeForm()
    form.orderType.value = 'market'
    form.limitPrice.value = ''
    expect(form.submitButtonLabel.value).not.toBe('Enter target price')
  })

  it('disables submit when limit price is empty', () => {
    const form = usePerpsTradeForm()
    form.orderType.value = 'limit'
    form.limitPrice.value = ''
    expect(form.submitDisabled.value).toBe(true)
  })
})
