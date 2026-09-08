import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

// HomeMarketNews uses useI18n() (Composition API) for the empty-state
// copy, which needs the i18n plugin installed on the app instance. Mirrors
// the pattern used in tests/unit/modules/home/HomeNewListings.spec.ts.
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: {} },
})

// Real StockNewsItem shape (src/mew_api/schema.ts →
// GetWebStocksOverviewResponse['recentNews'][number]): title / thumbnailUrl /
// articleUrl / timestamp / tickers — there is no url/source field.
const makeNews = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    title: `n${i}`,
    articleUrl: `https://x.test/${i}`,
    thumbnailUrl: `https://x.test/${i}.png`,
    timestamp: 1700000000000 + i,
    tickers: ['AAPL'],
  }))

// A plain mutable box (not a Vue ref) — the mocked store below mirrors how
// Pinia setup stores expose computed<T[]> refs already auto-unwrapped on the
// store instance, so the component can read `stocksStore.recentNews` directly.
const { box } = vi.hoisted(() => ({ box: { value: [] as unknown[] } }))

vi.mock('@/stores/stocksStore', () => ({
  useStocksStore: () => ({
    recentNews: box.value,
    stockIconBySymbol: (s?: string) => (s ? `icon-${s}` : undefined),
    stockTradableSymbol: (s?: string) => (s ? `${s}on` : undefined),
  }),
}))

import HomeMarketNews from '@/modules/home/sections/HomeMarketNews.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'

describe('HomeMarketNews', () => {
  // The news card renders a token badge (AppTokenLogo + AppTokenSymbol) when a
  // ticker is present; both pull in stocksStore internals irrelevant here, so
  // they're stubbed.
  const mountIt = () =>
    mount(HomeMarketNews, {
      global: {
        plugins: [i18n],
        stubs: {
          AppTokenLogo: true,
          AppTokenSymbol: true,
          // Render the slot so the badge's AppTokenLogo is still mounted.
          RouterLink: { template: '<a><slot /></a>' },
        },
      },
    })

  it('shows only the first page (perPage=6) then advances', async () => {
    box.value = makeNews(8)
    const w = mountIt()
    expect(w.findAll('[data-test="news-card"]').length).toBe(6)

    await w.get('[data-test="next"]').trigger('click')
    expect(w.findAll('[data-test="news-card"]').length).toBe(2)
  })

  it('does not render pagination when there is only one page', () => {
    box.value = makeNews(6)
    const w = mountIt()
    expect(w.find('[data-test="next"]').exists()).toBe(false)
  })

  it('shows the empty state and no news cards when there is no news', () => {
    box.value = makeNews(0)
    const w = mountIt()
    expect(w.find('[data-test="news-empty"]').exists()).toBe(true)
    expect(w.findAll('[data-test="news-card"]').length).toBe(0)
  })

  it('resolves the ticker to a stock logo and passes it to the footer badge', () => {
    box.value = [
      {
        title: 'n0',
        articleUrl: 'https://x.test/0',
        timestamp: 1700000000000,
        tickers: ['AAPL'],
      },
    ]
    const w = mountIt()
    // Ticker symbol resolved to an icon URL via the store, then passed down.
    expect(w.findComponent(AppTokenLogo).props('url')).toBe('icon-AAPL')
  })
})
