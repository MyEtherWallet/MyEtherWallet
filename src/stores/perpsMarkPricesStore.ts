import { ref } from 'vue'
import { defineStore } from 'pinia'
import { perpsClient } from '@/modules/perps/configs'
import { perpsWs } from '@/modules/perps/sdk/ws'

type MarkPriceRow = { market: string; markPrice?: string; price?: string }

// rAF (not microtask) so multiple high-frequency WS messages within a frame
// coalesce into a SINGLE render. queueMicrotask fires once per macrotask — and
// each onmessage is its own macrotask, so it doesn't coalesce in practice.
const schedule: (cb: () => void) => void =
  typeof requestAnimationFrame === 'function'
    ? cb => requestAnimationFrame(cb)
    : cb => queueMicrotask(cb)

/**
 * Live mark prices per market, seeded from REST and then kept current over WS.
 *
 * Separate from `perpsMarketsStore` on purpose: see the note there on why these
 * are acquired independently.
 */
export const usePerpsMarkPricesStore = defineStore('perpsMarkPrices', () => {
  const markPriceData = ref<Record<string, { price: string }>>({})

  let pendingPatch: Map<string, { price: string }> | null = null

  const queuePatch = (rows: MarkPriceRow[]) => {
    if (!pendingPatch) {
      pendingPatch = new Map()
      schedule(() => {
        if (!pendingPatch) return
        const next = { ...markPriceData.value }
        for (const [m, v] of pendingPatch) next[m] = v
        markPriceData.value = next
        pendingPatch = null
      })
    }
    for (const r of rows) {
      if (!r?.market) continue
      const p = r.markPrice ?? r.price
      if (p == null) continue
      pendingPatch.set(r.market, { price: String(p) })
    }
  }

  const seedFromRest = async () => {
    try {
      const res = await perpsClient.getMarkPrices()
      const seed: Record<string, { price: string }> = {}
      const result = (res.result ?? {}) as unknown as Record<
        string,
        MarkPriceRow
      >
      for (const [m, v] of Object.entries(result)) {
        const p = v.markPrice ?? v.price
        if (p != null) seed[m] = { price: String(p) }
      }
      // Existing values win: anything the socket already pushed is fresher than
      // this snapshot.
      markPriceData.value = { ...seed, ...markPriceData.value }
    } catch {
      // ignore — WS will populate
    }
  }

  // Runs once, when the first consumer creates the store. The socket itself is
  // opened by `ensurePerpsWsLifecycle()`, which the composable calls from setup
  // context.
  perpsWs.subscribe<MarkPriceRow>('markPricesPerps', queuePatch)
  void seedFromRest()

  return { markPriceData }
})
