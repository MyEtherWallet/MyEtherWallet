import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { createI18n } from 'vue-i18n'
import enPerps from '@/i18n/locales/perps/en.json'
import enCommon from '@/i18n/locales/common/en.json'

const setRange = vi.fn()

vi.mock('@/modules/perps/composables/usePerpsPortfolioGraph', () => ({
  usePerpsPortfolioGraph: () => ({
    graphData: ref([
      {
        time: '2026-01-01T00:00:00Z',
        marginBalance: '10',
        realizedPnl: '1',
        netInvested: '9',
      },
    ]),
    graphLoading: ref(false),
    graphRange: ref('30d'),
    setRange,
  }),
}))

// Desktop is where the range control used to stretch full width.
vi.mock('@/composables/useAppBreakpoints', () => ({
  useAppBreakpoints: () => ({ isDesktopAndUp: ref(true) }),
}))

// The real chart pulls in the wallet stack (useCurrency -> Ledger); not under test.
vi.mock('@/modules/portfolio/components/history/HistoryChart.vue', () => ({
  default: { name: 'HistoryChart', render: () => null },
}))

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en: { ...enCommon, ...enPerps } },
})

const mountChart = async () => {
  const PerpsPortfolioChart = (
    await import('@/modules/perps/components/PerpsPortfolioChart.vue')
  ).default
  return mount(PerpsPortfolioChart, {
    global: { plugins: [i18n] },
  })
}

describe('PerpsPortfolioChart', () => {
  it('sizes the range control to its content', async () => {
    const chart = await mountChart()
    const control = chart.get('[data-testid="segmented-control"]')
    expect(control.classes()).toContain('w-fit')
    expect(control.classes()).not.toContain('w-full')
  })

  it('renders the series switch as selected design-library chips', async () => {
    const chart = await mountChart()
    const chips = chart.findAll('[data-testid="chip"]')
    expect(chips.map(c => c.text())).toEqual([
      enPerps.perps.portfolio['series-value'],
      enPerps.perps.portfolio['series-net-invested'],
      enPerps.perps.portfolio['series-pnl'],
    ])
    chips.forEach(c => expect(c.attributes('aria-pressed')).toBe('true'))
  })

  it('toggles series but keeps at least one active', async () => {
    const chart = await mountChart()
    const chips = () => chart.findAll('[data-testid="chip"]')

    await chips()[0].trigger('click')
    await chips()[1].trigger('click')
    expect(chips()[0].attributes('aria-pressed')).toBe('false')
    expect(chips()[1].attributes('aria-pressed')).toBe('false')

    await chips()[2].trigger('click')
    expect(chips()[2].attributes('aria-pressed')).toBe('true')

    await chips()[0].trigger('click')
    expect(chips()[0].attributes('aria-pressed')).toBe('true')
  })
})
