import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import {
  type StocksOverviewResponse,
  type StockOverviewItem,
  type StockNewsItem,
  type StockTopMoverItem,
  type StockBannerItem,
  type GetTradableAssetsResponse,
} from '@/mew_api/types'

export const useStocksStore = defineStore('stocksStore', () => {
  const { useMEWFetch } = useFetchMewApi()
  const { useMEWFetch: useMEWFetchAddresses } = useFetchMewApi()

  /**------------------------
   * Stocks Overview
   -------------------------*/
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

  /**------------------------
   * Stocks Addresses
   -------------------------*/
  const addressesFetchUrl = '/v1/web/stocks/addresses'
  const hasStocksAddressesData = ref<boolean>(false)

  const {
    data: dataAddresses,
    isFetching: isLoadingAddresses,
    execute: fetchStocksAddresses,
    onFetchResponse: onFetchStocksAddressesResponse,
  } = useMEWFetchAddresses(addressesFetchUrl, {
    immediate: false,
  })
    .get()
    .json<GetTradableAssetsResponse>()

  onFetchStocksAddressesResponse(() => {
    if (dataAddresses.value) {
      hasStocksAddressesData.value = true
    }
  })

  const stocksAddresses = computed(() => dataAddresses.value || [])

  /**------------------------
   * Helper Methods
   -------------------------*/
  const isStock = (address: string, chain: string): boolean => {
    if (!address || !chain || !stocksAddresses.value.length) return false
    const normalizedAddress = address.toLowerCase()
    const normalizedChain = chain.toUpperCase()

    return stocksAddresses.value.some(stock =>
      stock.addresses.some(
        addr =>
          addr.address?.toLowerCase() === normalizedAddress &&
          addr.chainName?.toUpperCase() === normalizedChain,
      ),
    )
  }

  return {
    // Overview
    isLoadingOverview,
    fetchStockOverview,
    newlyAdded,
    recentNews,
    trending,
    topMovers,
    banner,
    // Addresses
    isLoadingAddresses,
    fetchStocksAddresses,
    stocksAddresses,
    hasStocksAddressesData,
    // Helpers
    isStock,
  }
})
