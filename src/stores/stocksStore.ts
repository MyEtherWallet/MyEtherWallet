import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import {
  type StocksOverviewResponse,
  type StockOverviewItem,
  type StockNewsItem,
  type StockTopMoverItem,
  type StockBannerItem,
} from '@/mew_api/types'

export const useStocksStore = defineStore('stocksStore', () => {
  const { useMEWFetch } = useFetchMewApi()

  const fetchUrl = '/v1/web/pages/stocks/overview'
  const {
    data: dataOverview,
    isFetching: isLoadingOverview,
    execute: fetchStockOverview,
  } = useMEWFetch(fetchUrl, {
    immediate: false,
  })
    .get()
    .json<StocksOverviewResponse>()

  const newlyAdded = computed<StockOverviewItem[]>(
    () => dataOverview.value?.newlyAdded || [],
  )
  const recentNews = computed<StockNewsItem[]>(
    () => dataOverview.value?.recentNews || [],
  )
  const trending = computed<StockOverviewItem[]>(
    () => dataOverview.value?.trending || [],
  )
  const topMovers = computed<StockTopMoverItem[]>(
    () => dataOverview.value?.topMovers || [],
  )
  const banner = computed<StockBannerItem[]>(
    () => dataOverview.value?.banner || [],
  )

  return {
    isLoadingOverview,
    fetchStockOverview,
    newlyAdded,
    recentNews,
    trending,
    topMovers,
    banner,
  }
})
