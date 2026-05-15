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

export function usePerpsContracts() {
  if (!contractsInitialized) {
    contractsInitialized = true
    fetchContracts()
    setInterval(fetchContracts, 2500)
  }
  return {
    contracts,
    isLoading: contractsLoading,
    error: contractsError,
    refetch: fetchContracts,
  }
}
