import { storeToRefs } from 'pinia'
import { usePerpsPositionsStore } from '@/stores/perpsPositionsStore'
import { ensurePerpsWsLifecycle } from './usePerpsWsLifecycle'

/**
 * The account's open perps positions, from `perpsPositionsStore`. The first
 * caller starts the fetch and the subscription, by virtue of being the one that
 * creates the store.
 *
 * `ensurePerpsWsLifecycle()` stays here rather than in the store: it reaches for
 * `useRoute()` and a Pinia store, so it has to run from a caller's setup context
 * (see its own comment).
 */
export function usePerpsPositions() {
  ensurePerpsWsLifecycle()
  const store = usePerpsPositionsStore()
  const { positions, loading, hasLoaded, error } = storeToRefs(store)
  return {
    positions,
    loading,
    hasLoaded,
    error,
    refetch: store.fetchPositions,
    closePosition: store.closePosition,
  }
}
