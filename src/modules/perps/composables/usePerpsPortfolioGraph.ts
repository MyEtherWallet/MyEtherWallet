import { storeToRefs } from 'pinia'
import { usePerpsPortfolioStore } from '@/stores/perpsPortfolioStore'

export type { GraphRange } from '@/stores/perpsPortfolioStore'

/**
 * The account's portfolio history graph, from `perpsPortfolioStore`. The first
 * caller starts the load, by virtue of being the one that creates the store.
 */
export function usePerpsPortfolioGraph() {
  const store = usePerpsPortfolioStore()
  const { graphData, graphLoading, graphRange } = storeToRefs(store)
  return {
    graphData,
    graphLoading,
    graphRange,
    setRange: store.setRange,
    refetch: store.fetchGraph,
  }
}
