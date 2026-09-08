import { storeToRefs } from 'pinia'
import { usePerpsMarkPricesStore } from '@/stores/perpsMarkPricesStore'
import { ensurePerpsWsLifecycle } from './usePerpsWsLifecycle'

/**
 * Live mark prices, from `perpsMarkPricesStore`. The first caller triggers the
 * REST seed and the WS subscription, by virtue of being the one that creates the
 * store.
 *
 * `ensurePerpsWsLifecycle()` stays here rather than in the store: it reaches for
 * `useRoute()` and a Pinia store, so it has to run from a caller's setup context
 * (see its own comment).
 */
export function usePerpsMarkPrices() {
  ensurePerpsWsLifecycle()
  const { markPriceData } = storeToRefs(usePerpsMarkPricesStore())
  return { markPriceData }
}
