import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { ref } from 'vue'
import { createI18n } from 'vue-i18n'
import enPerps from '@/i18n/locales/perps/en.json'

const contract = (baseCurrency: string, usdVolume: string) => ({
  market: `${baseCurrency}-USD`,
  baseCurrency,
  usdVolume,
  openInterestUsd: '1000',
  priceChangePercent: '1.5',
  indexPrice: '10',
  disabled: false,
})

const contracts = ref([
  contract('BBB', '300'),
  contract('AAA', '100'),
  contract('CCC', '200'),
])
const contractsLoading = ref(false)
const positions = ref<{ market: string; direction: string }[]>([])
const restricted = ref(false)
const watchOnly = ref(false)

vi.mock('@/modules/perps/composables/usePerpsMarkets', () => ({
  usePerpsMarkets: () => ({ markets: ref([]) }),
  usePerpsContracts: () => ({
    contracts,
    isLoading: contractsLoading,
    error: ref(null),
  }),
}))
vi.mock('@/modules/perps/composables/usePerpsPositions', () => ({
  usePerpsPositions: () => ({ positions }),
}))
vi.mock('@/modules/perps/composables/usePerpsRestriction', () => ({
  usePerpsRestriction: () => ({ isPerpsRestricted: restricted }),
}))
vi.mock('@/modules/perps/composables/usePerpsToasts', () => ({
  usePerpsToasts: () => ({}),
}))
vi.mock('@/modules/perps/configs', () => ({
  PERPS_PAGE_SIZE: 10,
  perpsClient: {},
}))
vi.mock('@/modules/perps/sentry', () => ({ capturePerps: vi.fn() }))
vi.mock('@/modules/perps/components/PerpsSelectLeverageDialog.vue', () => ({
  default: { render: () => null },
}))
vi.mock('@/stores/walletStore', () => ({
  useWalletStore: () => ({ isWatchOnly: watchOnly }),
}))
vi.mock('@/stores/watchlistTableStore', () => ({
  useWatchlistStore: () => ({
    watchListedPerps: ref([]),
    setWatchlistPerp: vi.fn(),
  }),
}))
vi.mock('@/analytics', () => ({
  analytics: {},
  PerpsChangeLeverageEvent: {},
  PerpsManageEvent: {},
  PerpsEventLocation: {},
  PerpsNewPositionAction: { LONG: 'long', SHORT: 'short' },
}))

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: enPerps },
})

const mountList = async () => {
  const PerpsMarketList = (
    await import('@/modules/perps/components/PerpsMarketList.vue')
  ).default
  return mount(PerpsMarketList, {
    global: {
      plugins: [i18n],
      directives: { ripple: {} },
      stubs: { RouterLink: RouterLinkStub },
    },
  })
}

// jsdom has no layout, so the wrapper measures 0 → size S (name + price).
const rowTitles = (w: Awaited<ReturnType<typeof mountList>>) =>
  w.findAll('[role="rowgroup"] [data-testid="cg-title"]').map(t => t.text())

// The first row's menu item (jsdom: size S, so every row has the menu).
const menuItem = (w: Awaited<ReturnType<typeof mountList>>, text: string) =>
  w
    .findAll('[role="rowgroup"] [role="row"]')[0]
    .findAll('li button')
    .find(b => b.text() === text)!

const nameHeader = (w: Awaited<ReturnType<typeof mountList>>) =>
  w.findAll('[role="columnheader"] button')[0]

describe('PerpsMarketList', () => {
  beforeEach(() => {
    contracts.value = [
      contract('BBB', '300'),
      contract('AAA', '100'),
      contract('CCC', '200'),
    ]
    contractsLoading.value = false
    positions.value = []
    restricted.value = false
    watchOnly.value = false
  })

  it('sorts by volume, highest first, by default', async () => {
    const w = await mountList()
    expect(rowTitles(w)).toEqual(['BBB', 'CCC', 'AAA'])
  })

  it('cycles a header desc → asc → back to the volume default', async () => {
    const w = await mountList()

    await nameHeader(w).trigger('click')
    expect(rowTitles(w)).toEqual(['CCC', 'BBB', 'AAA'])

    await nameHeader(w).trigger('click')
    expect(rowTitles(w)).toEqual(['AAA', 'BBB', 'CCC'])

    await nameHeader(w).trigger('click')
    expect(rowTitles(w)).toEqual(['BBB', 'CCC', 'AAA'])
  })

  it('links each row to its market page', async () => {
    const w = await mountList()
    expect(w.findAllComponents(RouterLinkStub)[0].props('to')).toEqual({
      name: 'perps-perp-info',
      params: { market: 'BBB-USD' },
    })
  })

  it('titles the page with an h1', async () => {
    const w = await mountList()
    expect(w.get('h1').text()).toBe('Explore perpetuals')
  })

  it('shows skeleton rows while the markets load', async () => {
    contractsLoading.value = true
    const w = await mountList()
    expect(w.get('[role="table"]').attributes('aria-busy')).toBe('true')
    expect(w.findAll('[role="rowgroup"] [role="row"]')).toHaveLength(8)
  })

  it('disables Long / Short in the menu in restricted regions', async () => {
    restricted.value = true
    const w = await mountList()
    expect(menuItem(w, 'Long').attributes('disabled')).toBeDefined()
    expect(menuItem(w, 'Short').attributes('disabled')).toBeDefined()
    expect(menuItem(w, 'View Market Info').attributes('disabled')).toBe(
      undefined,
    )
  })

  it('disables managing a position for a watch-only wallet', async () => {
    positions.value = [{ market: 'BBB-USD', direction: 'long' }]
    watchOnly.value = true
    const w = await mountList()
    for (const label of [
      'Change Leverage',
      'Add to Position',
      'Close Position',
    ])
      expect(menuItem(w, label).attributes('disabled')).toBeDefined()
  })

  it('leaves the watchlist to the row star, not the menu', async () => {
    const w = await mountList()
    const items = w
      .findAll('[role="rowgroup"] [role="row"]')[0]
      .findAll('li button')
      .map(b => b.text())
    expect(items).toEqual(['Long', 'Short', 'View Market Info'])
  })
})
