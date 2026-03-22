import { ref, onMounted } from 'vue'
import type { Contract, TradingPair } from '../sdk/types'
import { perpsClient } from '../configs'

export function usePerpsMarkets() {
  const markets = ref<TradingPair[]>([])
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  async function fetchMarkets() {
    isLoading.value = true
    error.value = null
    try {
      const data = await perpsClient.getMarkets()
      if (data.success) {
        markets.value = data.result.perps.tradingPairs
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch markets'
    } finally {
      isLoading.value = false
    }
  }

  onMounted(fetchMarkets)

  return { markets, isLoading, error, refetch: fetchMarkets }
}

export function usePerpsContracts() {
  const contracts = ref<Contract[]>([])
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  async function fetchContracts() {
    isLoading.value = true
    error.value = null
    try {
      const data = await perpsClient.getContracts(true)
      if (data.success) {
        contracts.value = data.result
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch contracts'
    } finally {
      isLoading.value = false
    }
  }

  onMounted(fetchContracts)

  return { contracts, isLoading, error, refetch: fetchContracts }
}
