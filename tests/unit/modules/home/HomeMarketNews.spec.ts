import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

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
  useStocksStore: () => ({ recentNews: box.value }),
}))

import HomeMarketNews from '@/modules/home/sections/HomeMarketNews.vue'

describe('HomeMarketNews', () => {
  it('shows only the first page (perPage=6) then advances', async () => {
    box.value = makeNews(8)
    const w = mount(HomeMarketNews)
    expect(w.findAll('[data-test="news-card"]').length).toBe(6)

    await w.get('[data-test="next"]').trigger('click')
    expect(w.findAll('[data-test="news-card"]').length).toBe(2)
  })

  it('does not render pagination when there is only one page', () => {
    box.value = makeNews(6)
    const w = mount(HomeMarketNews)
    expect(w.find('[data-test="next"]').exists()).toBe(false)
  })
})
