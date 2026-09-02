import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { perpsClient } from '@/modules/perps/configs'
import { capturePerps } from '@/modules/perps/sentry'
import { PERPS_FEATURE } from '@/sentry/constants'
import {
  usePerpsAuth,
  onPerpsAuthReset,
} from '@/modules/perps/composables/usePerpsAuth'
import type { PortfolioGraphPoint } from '@/modules/perps/sdk/types'

export type GraphRange = '24h' | '7d' | '30d' | 'all'

/** How long a fetched range stays servable before it is refetched. */
const CACHE_TTL_MS = 300_000

/**
 * The signed-in account's portfolio history, per range.
 *
 * Named for the portfolio rather than the graph so the account-level balance and
 * summary — still module state inside `usePerpsAuth` — have an obvious home when
 * that composable is migrated.
 */
export const usePerpsPortfolioStore = defineStore('perpsPortfolio', () => {
  const graphData = ref<PortfolioGraphPoint[]>([])
  const graphLoading = ref(false)
  const graphRange = ref<GraphRange>('30d')
  const cache = ref<Map<GraphRange, PortfolioGraphPoint[]>>(new Map())

  const { token } = usePerpsAuth()

  const fetchGraph = async () => {
    if (!token.value) {
      graphData.value = []
      return
    }

    const cached = cache.value.get(graphRange.value)
    if (cached) {
      graphData.value = cached
      return
    }

    graphLoading.value = true
    try {
      const res = await perpsClient.getPortfolioGraph(graphRange.value)
      const result = res.result ?? []
      cache.value.set(graphRange.value, result)
      graphData.value = result
    } catch (e) {
      graphData.value = []
      capturePerps(PERPS_FEATURE.PORTFOLIO, e, {
        title: 'PERPS: Error fetching portfolio graph',
      })
    } finally {
      graphLoading.value = false
    }
  }

  const setRange = (range: GraphRange) => {
    graphRange.value = range
  }

  // Expiry is a plain timer rather than a per-entry timestamp check because the
  // whole cache ages together: one interval, started with the store and stoppable
  // (the previous module-level `setInterval` had no handle and could never be
  // cleared).
  let expiryTimer: ReturnType<typeof setInterval> | null = null
  const startCacheExpiry = () => {
    if (expiryTimer) return
    expiryTimer = setInterval(() => cache.value.clear(), CACHE_TTL_MS)
  }
  const stopCacheExpiry = () => {
    if (!expiryTimer) return
    clearInterval(expiryTimer)
    expiryTimer = null
  }

  // Wipes synchronously on auth teardown, without waiting for a watcher flush —
  // see the note on `onPerpsAuthReset`.
  onPerpsAuthReset(() => {
    graphData.value = []
    cache.value.clear()
  })

  watch(
    token,
    val => {
      if (val) {
        cache.value.clear()
        void fetchGraph()
      } else {
        graphData.value = []
        cache.value.clear()
      }
    },
    { immediate: true },
  )

  watch(graphRange, () => {
    if (token.value) void fetchGraph()
  })

  startCacheExpiry()

  return {
    graphData,
    graphLoading,
    graphRange,
    fetchGraph,
    setRange,
    startCacheExpiry,
    stopCacheExpiry,
  }
})
