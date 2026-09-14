import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import {
  type StocksOverviewResponse,
  type StockOverviewItem,
  type StockTrendingItem,
  type StockNewsItem,
  type StockTopMoverItem,
  type StockBannerItem,
  type GetTradableAssetsResponse,
  type GetWebStocksInfoSummaryResponse,
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
  const trending = computed<StockTrendingItem[]>(
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

  // Match a news ticker to a tradable stock. News items only carry `tickers`
  // (symbols) — no icon URL — so callers (e.g. Market News cards) resolve them
  // via the tradable-assets list, fetched on app start. Tradable stocks are
  // keyed by an Ondo-tokenized `symbol` ("AAPLon") while news tickers are the
  // plain underlying ("AAPL"); match on the underlying by dropping the trailing
  // "on" (and also accept an already tokenized ticker).
  const matchStockByTicker = (ticker?: string) => {
    if (!ticker) return undefined
    const target = ticker.toUpperCase()
    return stocksAddresses.value.find(stock => {
      const sym = stock.symbol?.toUpperCase()
      if (!sym) return false
      const base = sym.endsWith('ON') ? sym.slice(0, -2) : sym
      return base === target || sym === target
    })
  }

  // Icon URL for a ticker, or undefined so the caller can fall back to the
  // initials avatar.
  const stockIconBySymbol = (ticker?: string): string | undefined => {
    const match = matchStockByTicker(ticker)
    return match?.iconPngUrl || match?.iconSvgUrl || undefined
  }

  // The tokenized tradable symbol ("AAPLon") for a plain ticker — the param the
  // stock page route expects — or undefined when the stock isn't tradable.
  const stockTradableSymbol = (ticker?: string): string | undefined =>
    matchStockByTicker(ticker)?.symbol

  /**------------------------
   * Helper Methods
   -------------------------*/
  const fetchUrlStock = ref<string>('')
  const mapMissingStocksInfo = ref<
    Record<string, GetWebStocksInfoSummaryResponse>
  >({})

  const fetchMissingStockData = async (
    symbol: string,
    address: string,
    chain: string,
  ): Promise<GetWebStocksInfoSummaryResponse | undefined> => {
    const _symbol = symbol.toLowerCase()
    if (!isStock(address, chain)) {
      return undefined
    }
    fetchUrlStock.value = `/v1/web/pages/stocks-info/stocks/${_symbol}/summary`

    if (!mapMissingStocksInfo.value[_symbol]) {
      await executeFetchMissingStockData()
      const data = stockData.value
      if (!data) return undefined
      mapMissingStocksInfo.value[_symbol] = data
    }
    return mapMissingStocksInfo.value[_symbol]
  }

  const { data: stockData, execute: executeFetchMissingStockData } =
    useMEWFetch(fetchUrlStock, {
      immediate: false,
    })
      .get()
      .json<GetWebStocksInfoSummaryResponse>()

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
    stockIconBySymbol,
    stockTradableSymbol,
    fetchMissingStockData,
    mapMissingStocksInfo,
  }
})
