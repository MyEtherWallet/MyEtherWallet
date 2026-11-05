import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { ref } from 'vue'
import { createI18n } from 'vue-i18n'
import enPerps from '@/i18n/locales/perps/en.json'

// jsdom has no layout: the table sizes itself from this width
// (L ≥1280, M ≥768, S below).
const tableWidth = ref(1300)
vi.mock('@vueuse/core', async importOriginal => ({
  ...(await importOriginal<typeof import('@vueuse/core')>()),
  useElementSize: () => ({ width: tableWidth, height: ref(0) }),
}))

const position = {
  market: 'AAA-USD',
  direction: 'long',
  netQuantity: '1',
  averageEntryPrice: '90',
  usedMargin: '25',
  unrealizedPnl: '10',
  markPrice: '100',
  liquidationPrice: '50',
  bankruptcyPrice: '40',
  maintenanceMargin: '5',
  notionalValue: '100',
  leverage: '4',
  netFundingSinceNeutral: '-1.5',
  returnOnEquity: '0.1',
}

const positions = ref([position])
const hasLoaded = ref(true)
const orders = ref<unknown[]>([])
const deposits = ref<unknown[]>([])

vi.mock('@/modules/perps/composables/usePerpsPositions', () => ({
  usePerpsPositions: () => ({ positions, hasLoaded }),
}))
const history = () => ({
  loading: ref(false),
  currentPage: ref(0),
  hasPrev: ref(false),
  hasNext: ref(false),
  nextPage: vi.fn(),
  prevPage: vi.fn(),
})
vi.mock('@/modules/perps/composables/usePerpsHistory', () => ({
  usePerpsOrders: () => ({ ...history(), orders, refetch: vi.fn() }),
  usePerpsFills: () => ({ ...history(), fills: ref([]) }),
  usePerpsDepositsWithdrawals: () => ({
    deposits,
    withdrawals: ref([]),
    loading: ref(false),
  }),
}))
vi.mock('@/modules/perps/composables/usePerpsMarkets', () => ({
  usePerpsMarkets: () => ({ markets: ref([]) }),
}))
vi.mock('@/modules/perps/composables/usePerpsToasts', () => ({
  usePerpsToasts: () => ({}),
}))
vi.mock('@/modules/perps/configs', () => ({
  PERPS_PAGE_SIZE: 10,
  perpsClient: {},
}))
vi.mock('@/modules/perps/sentry', () => ({ capturePerps: vi.fn() }))
vi.mock('@/stores/walletStore', () => ({
  useWalletStore: () => ({ isWatchOnly: ref(false) }),
}))
vi.mock('@/analytics', () => ({
  analytics: {},
  PerpsChangeLeverageEvent: {},
  PerpsManageEvent: {},
  PerpsOrderEvent: {},
  PerpsEventLocation: {},
}))
vi.mock('@/modules/perps/components/PerpsFillDetailsDialog.vue', () => ({
  default: { render: () => null },
}))
vi.mock('@/modules/perps/components/PerpsOrderDialog.vue', () => ({
  default: { render: () => null },
}))
vi.mock(
  '@/modules/perps/components/PerpsCancelOrderConfirmationDialog.vue',
  () => ({ default: { render: () => null } }),
)
vi.mock('@/modules/perps/components/PerpsSelectLeverageDialog.vue', () => ({
  default: { render: () => null },
}))

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: enPerps },
})

const mountTable = async () => {
  const PerpsPositionsTable = (
    await import('@/modules/perps/components/PerpsPositionsTable.vue')
  ).default
  return mount(PerpsPositionsTable, {
    global: {
      plugins: [i18n],
      directives: { ripple: {} },
      stubs: { RouterLink: RouterLinkStub },
    },
  })
}

const headers = (w: Awaited<ReturnType<typeof mountTable>>) =>
  w.findAll('[role="columnheader"]').map(h => h.text())

const LARGE_ONLY = ['Entry Price', 'Margin Used', 'Total Funding']

const openTab = async (
  w: Awaited<ReturnType<typeof mountTable>>,
  label: string,
) => {
  const tab = w.findAll('[role="radio"]').find(r => r.text().startsWith(label))
  await tab!.trigger('click')
}

const cell = (w: Awaited<ReturnType<typeof mountTable>>, text: string) =>
  w.findAll('[role="rowgroup"] [role="cell"] p').find(p => p.text() === text)!

const order = {
  orderId: '1',
  side: 'sell',
  price: '100',
  size: '2',
  market: 'AAA-USD',
  filledSize: '0',
  filledCost: '0',
  status: 'open',
  createdAt: '2026-01-01T00:00:00Z',
  type: 'limit',
}

describe('PerpsPositionsTable positions (MEW-2469)', () => {
  beforeEach(() => {
    tableWidth.value = 1300
    positions.value = [position]
    hasLoaded.value = true
    orders.value = []
    deposits.value = []
  })

  it('shows entry, margin used and total funding at L', async () => {
    const w = await mountTable()
    expect(headers(w)).toEqual(expect.arrayContaining(LARGE_ONLY))

    const cells = w
      .findAll('[role="rowgroup"] [role="cell"]')
      .map(c => c.text())
    expect(cells).toEqual(
      expect.arrayContaining(['$90.00', '$25.00', '-$1.50']),
    )
  })

  it('drops them at M and keeps the other columns', async () => {
    tableWidth.value = 900
    const w = await mountTable()
    for (const label of LARGE_ONLY) expect(headers(w)).not.toContain(label)
    expect(headers(w)).toContain('Mark Price')
  })

  it('links the row to the market, with direction and leverage', async () => {
    const w = await mountTable()
    expect(w.getComponent(RouterLinkStub).props('to')).toEqual({
      name: 'perps-perp-info',
      params: { market: 'AAA-USD' },
    })
    expect(w.get('[data-testid="cg-title"]').text()).toContain('AAA')
    expect(w.get('[data-testid="cg-description"]').text()).toBe('Long')
    expect(w.text()).toContain('4x')
  })

  it('colours uPnL by sign and shows ROE', async () => {
    const w = await mountTable()
    expect(cell(w, '+$10.00').classes()).toContain('text-text-success')
    expect(w.text()).toContain('+10.00%')
  })

  it('reads 0.00% when the ROE is not a number', async () => {
    positions.value = [{ ...position, returnOnEquity: '' }]
    const w = await mountTable()
    expect(w.text()).toContain('0.00%')
    expect(w.text()).not.toContain('NaN')
  })

  it('shows skeleton rows until positions load', async () => {
    hasLoaded.value = false
    const w = await mountTable()
    expect(w.get('[role="table"]').attributes('aria-busy')).toBe('true')
    expect(w.text()).not.toContain('No open positions')
  })
})

describe('PerpsPositionsTable orders (MEW-2469)', () => {
  beforeEach(() => {
    tableWidth.value = 1300
    orders.value = [order]
  })

  it('shows the order type at L only', async () => {
    const w = await mountTable()
    await openTab(w, 'Orders')
    expect(headers(w)).toContain('Type')
    expect(w.text()).toContain('Limit')

    tableWidth.value = 900
    await w.vm.$nextTick()
    expect(headers(w)).not.toContain('Type')
  })

  it('colours the side and offers cancel for an open order', async () => {
    const w = await mountTable()
    await openTab(w, 'Orders')
    expect(cell(w, 'Sell').classes()).toContain('text-text-error')
    expect(w.findAll('[role="rowgroup"] button').map(b => b.text())).toContain(
      'Cancel',
    )
  })
})

describe('PerpsPositionsTable deposits (MEW-2469)', () => {
  it('colours a deposit title green', async () => {
    deposits.value = [
      {
        coin: 'USDC',
        size: '5',
        status: 'confirmed',
        txid: 't',
        time: '2026-01-01T00:00:00Z',
        usdValue: '5',
      },
    ]
    const w = await mountTable()
    await openTab(w, 'Deposits')
    expect(w.get('[data-testid="cg-title"] span').classes()).toContain(
      'text-text-success',
    )
  })
})
