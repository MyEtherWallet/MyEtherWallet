import { ref, effectScope } from 'vue'
import type { Contract, TradingPair } from '../sdk/types'
import { perpsClient } from '../configs'
import { perpsWs } from '../sdk/ws'
import { ensurePerpsWsLifecycle } from './usePerpsWsLifecycle'

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
  } catch {
    contractsError.value = 'No markets found'
  } finally {
    contractsLoading.value = false
  }
}

type ContractPatch = Partial<Contract>
// rAF (not microtask): see usePerpsMarkPrices.ts for the rationale —
// high-frequency channels (topOfBooks, fundingRates) saturate the main
// thread with one full array.map per WS message under microtask scheduling.
const _scheduleContract: (cb: () => void) => void =
  typeof requestAnimationFrame === 'function'
    ? (cb) => requestAnimationFrame(cb)
    : (cb) => queueMicrotask(cb)

let _pendingContractPatch: Map<string, ContractPatch> | null = null
function _queueContractPatch(rows: ContractPatch[]) {
  if (!_pendingContractPatch) {
    _pendingContractPatch = new Map()
    _scheduleContract(() => {
      const patch = _pendingContractPatch
      _pendingContractPatch = null
      if (!patch) return
      const next = contracts.value.map(c => {
        const p = patch.get(c.market)
        return p ? { ...c, ...p } : c
      })
      contracts.value = next
    })
  }
  for (const r of rows) {
    const market = (r as { market?: string }).market
    if (!market) continue
    // topOfBooksPerps emits bids/asks as [[price,size]] tuples, but Contract
    // (and midPrice()) consume flat `bid`/`ask` strings. Lift the best level
    // from each side so the table actually updates.
    const raw = r as ContractPatch & {
      bids?: [string, string][]
      asks?: [string, string][]
    }
    const patch: ContractPatch = { ...r }
    const bestBid = raw.bids?.[0]?.[0]
    const bestAsk = raw.asks?.[0]?.[0]
    if (bestBid != null) patch.bid = bestBid
    if (bestAsk != null) patch.ask = bestAsk
    const existing = _pendingContractPatch.get(market) ?? {}
    _pendingContractPatch.set(market, { ...existing, ...patch })
  }
}

export function usePerpsContracts() {
  if (!contractsInitialized) {
    contractsInitialized = true
    ensurePerpsWsLifecycle()
    fetchContracts()
    effectScope(true).run(() => {
      perpsWs.subscribe<Partial<Contract>>('topOfBooksPerps', _queueContractPatch)
      perpsWs.subscribe<Partial<Contract>>('fundingRatesPerps', _queueContractPatch)
    })
  }
  return {
    contracts,
    isLoading: contractsLoading,
    error: contractsError,
    refetch: fetchContracts,
  }
}
