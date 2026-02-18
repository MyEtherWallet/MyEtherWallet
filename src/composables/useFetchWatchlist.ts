import { computed, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWatchlistStore } from '@/stores/watchlistTableStore'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import type {
  GetWebTokensWatchlistResponse,
  GetWebStocksWatchlistResponse,
  Chain,
} from '@/mew_api/types'

export const useFetchWatchlist = (filterChain: Ref<Chain | null>) => {
  const watchlistStore = useWatchlistStore()
  const { watchListedTokens, watchListedStocks } = storeToRefs(watchlistStore)

  const { useMEWFetch } = useFetchMewApi()

  /**
   * Fetch tokens watchlist data
   */
  const fetchWatchListUrl = computed(() => {
    const coins = watchListedTokens.value.join(',')

    const filterChainParam =
      filterChain.value &&
      filterChain.value.name !== 'all' &&
      filterChain.value.name !== ''
        ? `&filterChain=${filterChain.value.name}`
        : ''
    return `/v1/web/tokens-watchlist?coins=${coins}${filterChainParam}`
  })

  const {
    data: tokensWatchlistData,
    isFetching: isFetchingTokensWatchlist,
    error: tokensWatchlistError,
    execute: fetchTokensWatchlist,
    onFetchResponse: onTokensWatchlistResponse,
    onFetchError: onTokensWatchlistError,
  } = useMEWFetch(fetchWatchListUrl, { immediate: false, refetch: true })
    .get()
    .json<GetWebTokensWatchlistResponse>()

  /**
   * Fetch stocks watchlist data
   */
  const fetchStocksWatchListUrl = computed(() => {
    if (watchListedStocks.value.length === 0) return ''
    const symbols = watchListedStocks.value.join(',')
    const filterChainParam =
      filterChain.value &&
      filterChain.value.name !== 'all' &&
      filterChain.value.name !== ''
        ? `&filterChain=${filterChain.value.name}`
        : ''
    return `/v1/web/pages/stocks/watchlist?symbols=${symbols}${filterChainParam}`
  })

  const {
    data: stocksWatchlistData,
    isFetching: isFetchingStocksWatchlist,
    error: stocksWatchlistError,
    execute: fetchStocksWatchlist,
    onFetchResponse: onStocksWatchlistResponse,
    onFetchError: onStocksWatchlistError,
  } = useMEWFetch(fetchStocksWatchListUrl, { immediate: false, refetch: true })
    .get()
    .json<GetWebStocksWatchlistResponse>()
  /**
   * Combined
   */
  const fetchAllWatchlist = () => {
    if (watchListedTokens.value.length > 0) {
      fetchTokensWatchlist()
    }
    if (watchListedStocks.value.length > 0) {
      fetchStocksWatchlist()
    }
  }
  const isPendingAllWatchlist = computed(() => {
    return isFetchingTokensWatchlist.value || isFetchingStocksWatchlist.value
  })

  const errorAllWatchlist = computed(() => {
    return tokensWatchlistError.value || stocksWatchlistError.value
  })

  return {
    //tokens
    tokensWatchlistData,
    isFetchingTokensWatchlist,
    tokensWatchlistError,
    fetchTokensWatchlist,
    onTokensWatchlistResponse,
    onTokensWatchlistError,
    //stocks
    stocksWatchlistData,
    isFetchingStocksWatchlist,
    stocksWatchlistError,
    fetchStocksWatchlist,
    onStocksWatchlistResponse,
    onStocksWatchlistError,
    //all
    fetchAllWatchlist,
    isPendingAllWatchlist,
    errorAllWatchlist,
  }
}
