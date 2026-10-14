import { computed, type Ref } from 'vue'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import type { CryptoOverview, CryptoOverviewToken } from '@/mew_api/types'

/**
 * New crypto tokens for the Home "New listings" crypto tab — the `newCoins`
 * from the crypto overview endpoint (the same source the crypto page uses).
 * Not fetched until `fetchNewCoins()` is called (mirrors stocksStore).
 */
export function useCryptoNewCoins(): {
  newCoins: Ref<CryptoOverviewToken[]>
  fetchNewCoins: () => Promise<unknown>
  isLoading: Ref<boolean>
} {
  const { useMEWFetch } = useFetchMewApi()
  const {
    data,
    isFetching,
    execute: fetchNewCoins,
  } = useMEWFetch('/v1/web/overview', { immediate: false })
    .get()
    .json<CryptoOverview>()

  const newCoins = computed<CryptoOverviewToken[]>(
    () => data.value?.newCoins ?? [],
  )

  return { newCoins, fetchNewCoins, isLoading: isFetching }
}
