import { ref, effectScope } from 'vue'
import { perpsClient } from '../configs'
import { perpsWs } from '../sdk/ws'
import { ensurePerpsWsLifecycle } from './usePerpsWsLifecycle'

type MarkPriceRow = { market: string; markPrice?: string; price?: string }

const markPriceData = ref<Record<string, { price: string }>>({})
let initialized = false

// rAF (not microtask) so multiple high-frequency WS messages within a frame
// coalesce into a SINGLE render. queueMicrotask fires once per macrotask —
// and each onmessage is its own macrotask, so it doesn't coalesce in practice.
const _schedule: (cb: () => void) => void =
  typeof requestAnimationFrame === 'function'
    ? (cb) => requestAnimationFrame(cb)
    : (cb) => queueMicrotask(cb)

let _pendingPatch: Map<string, { price: string }> | null = null
function _queuePatch(rows: MarkPriceRow[]) {
  if (!_pendingPatch) {
    _pendingPatch = new Map()
    _schedule(() => {
      if (!_pendingPatch) return
      const next = { ...markPriceData.value }
      for (const [m, v] of _pendingPatch) next[m] = v
      markPriceData.value = next
      _pendingPatch = null
    })
  }
  for (const r of rows) {
    if (!r?.market) continue
    const p = r.markPrice ?? r.price
    if (p == null) continue
    _pendingPatch.set(r.market, { price: String(p) })
  }
}

async function seedFromRest() {
  try {
    const res = await perpsClient.getMarkPrices()
    const seed: Record<string, { price: string }> = {}
    const result = (res.result ?? {}) as unknown as Record<string, MarkPriceRow>
    for (const [m, v] of Object.entries(result)) {
      const p = v.markPrice ?? v.price
      if (p != null) seed[m] = { price: String(p) }
    }
    markPriceData.value = { ...seed, ...markPriceData.value }
  } catch {
    // ignore — WS will populate
  }
}

export function usePerpsMarkPrices() {
  if (!initialized) {
    initialized = true
    ensurePerpsWsLifecycle()
    effectScope(true).run(() => {
      perpsWs.subscribe<MarkPriceRow>('markPricesPerps', _queuePatch)
    })
    void seedFromRest()
  }
  return { markPriceData }
}
