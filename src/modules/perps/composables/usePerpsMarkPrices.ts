import { ref } from 'vue'
import { perpsClient } from '../configs'
import { gatedPoll } from './usePerpsActive'
import { perpsWs } from '../sdk/ws'

const markPriceData = ref<Record<string, any>>({})
let initialized = false

async function fetchMarkPrices() {
  try {
    const res = await perpsClient.getMarkPrices()
    markPriceData.value = res.result ?? {}
  } catch (e) {
    console.error('Failed to fetch mark prices:', e)
  }
}

// Coalesce WS-driven patches: the server fans out one frame as N items, so
// without batching each item reassigns `markPriceData.value` and retriggers
// every consumer (trade form `currentPrice`, drawer header). Flushing once per
// microtask collapses a frame into a single reactive notification.
const pendingMarkPricePatches = new Map<string, { price: string; indexPrice?: string }>()
let markPriceFlushScheduled = false

function flushMarkPricePatches() {
  markPriceFlushScheduled = false
  if (pendingMarkPricePatches.size === 0) return
  const next = { ...markPriceData.value }
  for (const [market, patch] of pendingMarkPricePatches) {
    next[market] = { ...(next[market] ?? {}), ...patch }
  }
  pendingMarkPricePatches.clear()
  markPriceData.value = next
}

export function usePerpsMarkPrices() {
  if (!initialized) {
    initialized = true
    // Initial snapshot.
    fetchMarkPrices()
    // Realtime updates via WS. Server payload uses `markPrice`/`indexPrice`,
    // but the REST snapshot — and every consumer (`mp.price`) — keys on `price`.
    // Write under `price` so WS updates actually reach the UI; preserve
    // `indexPrice` alongside for any future consumer.
    perpsWs.subscribe('markPricesPerps', {}, (data: { market: string; markPrice: string; indexPrice?: string }) => {
      if (!data?.market) return
      const prev = pendingMarkPricePatches.get(data.market)
      pendingMarkPricePatches.set(data.market, {
        price: data.markPrice,
        indexPrice: data.indexPrice ?? prev?.indexPrice,
      })
      if (!markPriceFlushScheduled) {
        markPriceFlushScheduled = true
        queueMicrotask(flushMarkPricePatches)
      }
    })
    // Degraded fallback: full REST refresh every 30 s, gated to perps-active windows.
    gatedPoll(fetchMarkPrices, 30_000)
  }
  return { markPriceData, refetch: fetchMarkPrices }
}
