import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
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

vi.mock('@/modules/perps/composables/usePerpsMarkets', () => ({
  usePerpsMarkets: () => ({ markets: ref([]) }),
  usePerpsContracts: () => ({
    contracts,
    isLoading: ref(false),
    error: ref(null),
  }),
}))
vi.mock('@/modules/perps/composables/usePerpsPositions', () => ({
  usePerpsPositions: () => ({ positions: ref([]) }),
}))
vi.mock('@/modules/perps/composables/usePerpsRestriction', () => ({
  usePerpsRestriction: () => ({ isPerpsRestricted: ref(false) }),
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
  useWalletStore: () => ({ isWatchOnly: ref(false) }),
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
    global: { plugins: [i18n], stubs: { RouterLink: true } },
  })
}

// jsdom has no layout, so the wrapper measures 0 → size S (name + price).
const rowTitles = (w: Awaited<ReturnType<typeof mountList>>) =>
  w.findAll('[role="rowgroup"] [data-testid="cg-title"]').map(t => t.text())

const nameHeader = (w: Awaited<ReturnType<typeof mountList>>) =>
  w.findAll('[role="columnheader"] button')[0]

describe('PerpsMarketList', () => {
  beforeEach(() => {
    contracts.value = [
      contract('BBB', '300'),
      contract('AAA', '100'),
      contract('CCC', '200'),
    ]
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

  it('opens the market on row click', async () => {
    const w = await mountList()
    await w.findAll('[role="rowgroup"] [role="row"]')[0].trigger('click')
    expect(w.emitted('viewMarket')).toEqual([['BBB-USD']])
  })
})
