import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { reactive, ref } from 'vue'

const recentNews = ref([
  {
    title: 'Big tech rally',
    articleUrl: 'https://example.com/a',
    thumbnailUrl: 'https://example.com/a.png',
    timestamp: 1_700_000_000_000,
    tickers: ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META'],
  },
  {
    title: 'Single name',
    articleUrl: 'https://example.com/b',
    thumbnailUrl: 'https://example.com/b.png',
    timestamp: 1_700_000_000_000,
    tickers: ['TSLA'],
  },
])

vi.mock('@/stores/stocksStore', () => ({
  useStocksStore: () =>
    reactive({ isLoadingOverview: ref(false), recentNews }),
}))

import ModuleNews from '@/modules/stocks/ModuleNews.vue'
import AppTag from '@/components/tag/AppTag.vue'

describe('ModuleNews', () => {
  const tagLabels = () => {
    const wrapper = mount(ModuleNews, {
      global: { mocks: { $t: (k: string) => k } },
    })
    return wrapper
      .findAll('a')
      .map(a => a.findAllComponents(AppTag).map(t => t.props('label')))
  }

  it('caps each article at 4 ticker tags', () => {
    expect(tagLabels()).toEqual([['AAPL', 'MSFT', 'NVDA', 'GOOGL'], ['TSLA']])
  })
})
