import { storeToRefs } from 'pinia'
import { usePerpsMarketsStore } from '@/stores/perpsMarketsStore'
import { usePerpsContractsStore } from '@/stores/perpsContractsStore'
import { ensurePerpsWsLifecycle } from './usePerpsWsLifecycle'

/**
 * The perps trading-pair list, from `perpsMarketsStore`. The first caller
 * triggers the load, by virtue of being the one that creates the store.
 */
export function usePerpsMarkets() {
  const store = usePerpsMarketsStore()
  const { markets, isLoading, error } = storeToRefs(store)
  return { markets, isLoading, error, refetch: store.fetchMarkets }
}

/**
 * Perps contracts, from `perpsContractsStore`.
 *
 * `ensurePerpsWsLifecycle()` stays here rather than in the store: it reaches for
 * `useRoute()` and a Pinia store, so it has to run from a caller's setup context
 * (see its own comment). On non-perps routes it only leaves the contracts
 * snapshot fetched and never opens a socket.
 */
export function usePerpsContracts() {
  ensurePerpsWsLifecycle()
  const store = usePerpsContractsStore()
  const { contracts, isLoading, error } = storeToRefs(store)
  return { contracts, isLoading, error, refetch: store.fetchContracts }
}
