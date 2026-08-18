import { computed, type Ref } from 'vue'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import type {
  GetWebTrendingTokensResponse,
  GetWebTrendingTokensResponseToken,
} from '@/mew_api/types'

/**
 * Trending crypto tokens for the Home Hero's "Trending crypto" card — the same
 * `/v1/web/trending-tokens` source the crypto page uses. Top 5, sorted desc.
 * Not fetched until `fetchTrending()` is called (mirrors useCryptoNewCoins).
 */
export function useCryptoTrending(): {
  trending: Ref<GetWebTrendingTokensResponseToken[]>
  fetchTrending: () => Promise<unknown>
  isLoading: Ref<boolean>
} {
  const { useMEWFetch } = useFetchMewApi()
  const {
    data,
    isFetching,
    execute: fetchTrending,
  } = useMEWFetch('/v1/web/trending-tokens?page=1&sort=desc&perPage=5', {
    immediate: false,
  })
    .get()
    .json<GetWebTrendingTokensResponse>()

  const trending = computed<GetWebTrendingTokensResponseToken[]>(
    () => data.value?.items ?? [],
  )

  return { trending, fetchTrending, isLoading: isFetching }
}
