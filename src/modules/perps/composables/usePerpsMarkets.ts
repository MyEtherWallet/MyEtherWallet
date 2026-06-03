import { ref } from 'vue'
import type { Contract, TradingPair } from '../sdk/types'
import { perpsClient } from '../configs'

// Singleton state for markets
const markets = ref<TradingPair[]>([])
const marketsLoading = ref(false)
const marketsError = ref<string | null>(null)
let marketsInitialized = false

async function fetchMarkets() {
  marketsLoading.value = true
  marketsError.value = null
  try {
    const data = await perpsClient.getMarkets()
    if (data.success) {
      markets.value = data.result.perps.tradingPairs
    }
  } catch (e) {
    marketsError.value =
      e instanceof Error ? e.message : 'Failed to fetch markets'
  } finally {
    marketsLoading.value = false
  }
}

export function usePerpsMarkets() {
  if (!marketsInitialized) {
    marketsInitialized = true
    fetchMarkets()
  }
  return {
    markets,
    isLoading: marketsLoading,
    error: marketsError,
    refetch: fetchMarkets,
  }
}

// Singleton state for contracts
const contracts = ref<Contract[]>([])
const contractsLoading = ref(false)
const contractsError = ref<string | null>(null)
let contractsInitialized = false
let isFirstContractsFetch = true

async function fetchContracts() {
  if (isFirstContractsFetch) {
    contractsLoading.value = true
    isFirstContractsFetch = false
  }
  contractsError.value = null
  try {
    const data = await perpsClient.getContracts(true)
    if (data.success) {
      const next = JSON.stringify(data.result)
      if (next !== JSON.stringify(contracts.value)) {
        contracts.value = data.result
      }
    }
  } catch (e) {
    contractsError.value =
      e instanceof Error ? e.message : 'Failed to fetch contracts'
  } finally {
    contractsLoading.value = false
  }
}

/**
 * Apply a partial patch to one contract by market. No-op if the market is not
 * present — REST snapshot is authoritative for the initial set.
 */
function updateContract(market: string, patch: Partial<Contract>) {
  const idx = contracts.value.findIndex(c => c.market === market)
  if (idx < 0) return
  contracts.value = [
    ...contracts.value.slice(0, idx),
    { ...contracts.value[idx], ...patch },
    ...contracts.value.slice(idx + 1),
  ]
}

export function usePerpsContracts() {
  if (!contractsInitialized) {
    contractsInitialized = true
    fetchContracts()
    // WS subscriptions + REST fallback wired in Task 10/11.
  }
  return {
    contracts,
    isLoading: contractsLoading,
    error: contractsError,
    refetch: fetchContracts,
    updateContract,
  }
}
