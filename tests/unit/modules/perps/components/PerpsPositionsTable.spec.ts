import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
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

vi.mock('@/modules/perps/composables/usePerpsPositions', () => ({
  usePerpsPositions: () => ({
    positions: ref([position]),
    hasLoaded: ref(true),
  }),
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
  usePerpsOrders: () => ({ ...history(), orders: ref([]), refetch: vi.fn() }),
  usePerpsFills: () => ({ ...history(), fills: ref([]) }),
  usePerpsDepositsWithdrawals: () => ({
    deposits: ref([]),
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
      stubs: { RouterLink: true },
    },
  })
}

const headers = (w: Awaited<ReturnType<typeof mountTable>>) =>
  w.findAll('[role="columnheader"]').map(h => h.text())

const LARGE_ONLY = ['Entry Price', 'Margin Used', 'Total Funding']

describe('PerpsPositionsTable positions (MEW-2469)', () => {
  beforeEach(() => {
    tableWidth.value = 1300
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
})
