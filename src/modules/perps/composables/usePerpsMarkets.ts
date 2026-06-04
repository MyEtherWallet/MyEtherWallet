import { ref } from 'vue'
import type { Contract, TradingPair } from '../sdk/types'
import { perpsClient } from '../configs'
import { perpsWs } from '../sdk/ws'
import { gatedPoll } from './usePerpsActive'

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
 *
 * Patches are coalesced through a microtask: WS frames arrive in bursts (the
 * dispatcher fans an array of items into per-item handler calls), and each
 * `contracts.value = [...]` reassignment retriggers PerpsMarketList's
 * enriched/filtered/sorted/paginated computed chain plus a full row re-render.
 * Without batching, a 30-market frame burns ~30 full cascades back-to-back and
 * saturates the main thread (clicks queue, drawer never opens). Coalescing
 * collapses one frame into a single reassignment.
 */
const pendingContractPatches = new Map<string, Partial<Contract>>()
let contractFlushScheduled = false

function flushContractPatches() {
  contractFlushScheduled = false
  if (pendingContractPatches.size === 0) return
  const next = contracts.value.slice()
  let mutated = false
  for (const [market, patch] of pendingContractPatches) {
    const idx = next.findIndex(c => c.market === market)
    if (idx >= 0) {
      next[idx] = { ...next[idx], ...patch }
      mutated = true
    }
  }
  pendingContractPatches.clear()
  if (mutated) contracts.value = next
}

function updateContract(market: string, patch: Partial<Contract>) {
  const prev = pendingContractPatches.get(market)
  pendingContractPatches.set(
    market,
    prev ? { ...prev, ...patch } : { ...patch },
  )
  if (!contractFlushScheduled) {
    contractFlushScheduled = true
    queueMicrotask(flushContractPatches)
  }
}

export function usePerpsContracts() {
  if (!contractsInitialized) {
    contractsInitialized = true
    fetchContracts()

    // Order-book frames carry { market, asks: [[price, size], ...], bids: [[price, size], ...] }
    // Best ask/bid are the first tuple on each side; empty sides leave that side
    // unchanged so a one-sided book doesn't blank out the REST-seeded value.
    perpsWs.subscribe(
      'topOfBooksPerps',
      {},
      (d: { market: string; bids?: [string, string][]; asks?: [string, string][] }) => {
        if (!d?.market) return
        const patch: Partial<Contract> = {}
        const topBid = d.bids?.[0]?.[0]
        const topAsk = d.asks?.[0]?.[0]
        if (topBid !== undefined) patch.bid = topBid
        if (topAsk !== undefined) patch.ask = topAsk
        if (Object.keys(patch).length === 0) return
        updateContract(d.market, patch)
      },
    )

    perpsWs.subscribe(
      'tradesPerps',
      {},
      (d: { market: string; price: string }) => {
        if (!d?.market) return
        updateContract(d.market, { lastPrice: d.price })
      },
    )

    perpsWs.subscribe(
      'fundingRatesPerps',
      {},
      (d: {
        market: string
        fundingRate: string
        nextFundingRate?: string
        nextFundingRateTimestamp?: string
      }) => {
        if (!d?.market) return
        updateContract(d.market, {
          fundingRate: d.fundingRate,
          nextFundingRate: d.nextFundingRate,
          nextFundingRateTimestamp: d.nextFundingRateTimestamp,
        })
      },
    )

    // 30s REST refresh keeps non-WS fields (sparkline, volumes, OI, high/low,
    // priceChangePercent, tags) fresh while perps is active.
    gatedPoll(fetchContracts, 30_000)
  }
  return {
    contracts,
    isLoading: contractsLoading,
    error: contractsError,
    refetch: fetchContracts,
    updateContract,
  }
}
