import { ref } from 'vue'
import { defineStore } from 'pinia'
import { perpsClient } from '@/modules/perps/configs'
import { capturePerps } from '@/modules/perps/sentry'
import { PERPS_FEATURE } from '@/sentry/constants'
import { perpsWs } from '@/modules/perps/sdk/ws'
import type { Contract } from '@/modules/perps/sdk/types'

type ContractPatch = Partial<Contract>

// rAF (not microtask): the high-frequency channels (topOfBooks, fundingRates)
// saturate the main thread with one full array.map per WS message under
// microtask scheduling. See `perpsMarkPricesStore` for the longer rationale.
const schedule: (cb: () => void) => void =
  typeof requestAnimationFrame === 'function'
    ? cb => requestAnimationFrame(cb)
    : cb => queueMicrotask(cb)

/**
 * Perps contracts — the per-market quote/funding snapshot, kept live over WS.
 *
 * Separate from `perpsMarketsStore` on purpose: see the note there on why these
 * are acquired independently.
 */
export const usePerpsContractsStore = defineStore('perpsContracts', () => {
  const contracts = ref<Contract[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Only the first load drives the spinner; later refetches patch in place, so
  // flipping `isLoading` again would blank a table that already has rows.
  let isFirstFetch = true

  const fetchContracts = async () => {
    if (isFirstFetch) {
      isLoading.value = true
      isFirstFetch = false
    }
    error.value = null
    try {
      const data = await perpsClient.getContracts(true)
      if (data.success) {
        const next = JSON.stringify(data.result)
        if (next !== JSON.stringify(contracts.value)) {
          contracts.value = data.result
        }
      }
    } catch (e) {
      error.value = 'No markets found'
      capturePerps(PERPS_FEATURE.MARKETS, e, {
        title: 'PERPS: Error fetching contracts',
      })
    } finally {
      isLoading.value = false
    }
  }

  let pendingPatch: Map<string, ContractPatch> | null = null

  const queuePatch = (rows: ContractPatch[]) => {
    if (!pendingPatch) {
      pendingPatch = new Map()
      schedule(() => {
        const patch = pendingPatch
        pendingPatch = null
        if (!patch) return
        contracts.value = contracts.value.map(c => {
          const p = patch.get(c.market)
          return p ? { ...c, ...p } : c
        })
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
      const existing = pendingPatch.get(market) ?? {}
      pendingPatch.set(market, { ...existing, ...patch })
    }
  }

  // Store setup is the once-per-app site the old `contractsInitialized` flag and
  // detached effect scope were emulating. The socket itself is opened by
  // `ensurePerpsWsLifecycle()`, which the composable calls from setup context.
  void fetchContracts()
  perpsWs.subscribe<ContractPatch>('topOfBooksPerps', queuePatch)
  perpsWs.subscribe<ContractPatch>('fundingRatesPerps', queuePatch)

  return { contracts, isLoading, error, fetchContracts }
})
