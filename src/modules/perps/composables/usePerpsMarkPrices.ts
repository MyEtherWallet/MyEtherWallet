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
      const next = { ...markPriceData.value }
      next[data.market] = {
        ...(next[data.market] ?? {}),
        price: data.markPrice,
        indexPrice: data.indexPrice,
      }
      markPriceData.value = next
    })
    // Degraded fallback: full REST refresh every 30 s, gated to perps-active windows.
    gatedPoll(fetchMarkPrices, 30_000)
  }
  return { markPriceData, refetch: fetchMarkPrices }
}
