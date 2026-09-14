import { ref } from 'vue'
import { defineStore } from 'pinia'
import { perpsClient } from '@/modules/perps/configs'
import { capturePerps } from '@/modules/perps/sentry'
import { PERPS_FEATURE } from '@/sentry/constants'
import type { TradingPair } from '@/modules/perps/sdk/types'

/**
 * The perps trading-pair list. Every surface reads the same list, so the market
 * table, the info page and the order form can never disagree.
 *
 * Deliberately separate from `perpsContractsStore` and `perpsMarkPricesStore`:
 * consumers acquire these three independently (`usePerpsHistory` and
 * `PerpsPositionsTable` want only the pair list), and a store is created on
 * first use — so keeping them apart is what stops a markets-only consumer from
 * also firing the contracts snapshot and opening the mark-price subscription.
 */
export const usePerpsMarketsStore = defineStore('perpsMarkets', () => {
  const markets = ref<TradingPair[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchMarkets = async () => {
    isLoading.value = true
    error.value = null
    try {
      const data = await perpsClient.getMarkets()
      if (data.success) {
        markets.value = data.result.perps.tradingPairs
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch markets'
      capturePerps(PERPS_FEATURE.MARKETS, e, {
        title: 'PERPS: Error fetching markets',
      })
    } finally {
      isLoading.value = false
    }
  }

  // Runs exactly once, when the first consumer creates the store — the lazy
  // first load the old `marketsInitialized` module flag stood in for.
  void fetchMarkets()

  return { markets, isLoading, error, fetchMarkets }
})
