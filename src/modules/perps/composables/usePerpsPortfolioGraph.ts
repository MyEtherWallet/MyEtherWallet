import { ref, computed, watch, effectScope } from 'vue'
import { perpsClient } from '../configs'
import { usePerpsAuth, onPerpsAuthReset } from './usePerpsAuth'
import type { PortfolioGraphPoint } from '../sdk/types'

export type GraphRange = '24h' | '7d' | '30d' | 'all'

const DAY_MS = 24 * 60 * 60 * 1000

const RANGE_WINDOW_MS: Record<Exclude<GraphRange, 'all'>, number> = {
  '24h': DAY_MS,
  '7d': 7 * DAY_MS,
  '30d': 30 * DAY_MS,
}

const _graphDataRaw = ref<PortfolioGraphPoint[]>([])
const _graphLoading = ref(false)
const _graphRange = ref<GraphRange>('30d')
const _cache = ref<Map<GraphRange, PortfolioGraphPoint[]>>(new Map())

// The API's `range` only picks the bucket size — every response spans the whole
// account history. Trim it to the selected window so the selection means "how
// far back", the same as every other chart in the app.
const _graphData = computed<PortfolioGraphPoint[]>(() => {
  const points = _graphDataRaw.value
  const range = _graphRange.value
  if (range === 'all' || points.length === 0) return points

  const cutoff = Date.now() - RANGE_WINDOW_MS[range]
  const windowed = points.filter(p => new Date(p.time).getTime() >= cutoff)
  // An account with no recent activity can have no snapshot inside a short
  // window — fall back to the latest points instead of an empty chart.
  return windowed.length > 1 ? windowed : points.slice(-2)
})

let _initialized = false

// Detached scope so watchers survive component unmounts
const _scope = effectScope(true)

export function usePerpsPortfolioGraph() {
  const { token } = usePerpsAuth()

  async function fetchGraph() {
    if (!token.value) {
      _graphDataRaw.value = []
      return
    }

    const cached = _cache.value.get(_graphRange.value)
    if (cached) {
      _graphDataRaw.value = cached
      return
    }

    _graphLoading.value = true
    try {
      const res = await perpsClient.getPortfolioGraph(_graphRange.value)
      // Sorted so trimming to a window and reading the latest points is safe.
      const result = (res.result ?? [])
        .slice()
        .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
      _cache.value.set(_graphRange.value, result)
      _graphDataRaw.value = result
    } catch {
      _graphDataRaw.value = []
    } finally {
      _graphLoading.value = false
    }
  }

  if (!_initialized) {
    _initialized = true

    onPerpsAuthReset(() => {
      _graphDataRaw.value = []
      _cache.value.clear()
    })

    // Clear cache every 5 minutes
    setInterval(() => {
      _cache.value.clear()
    }, 300_000)

    _scope.run(() => {
      watch(
        token,
        val => {
          if (val) {
            _cache.value.clear()
            fetchGraph()
          } else {
            _graphDataRaw.value = []
            _cache.value.clear()
          }
        },
        { immediate: true },
      )

      watch(_graphRange, () => {
        if (token.value) fetchGraph()
      })
    })
  }

  function setRange(range: GraphRange) {
    _graphRange.value = range
  }

  return {
    graphData: _graphData,
    graphLoading: _graphLoading,
    graphRange: _graphRange,
    setRange,
    refetch: fetchGraph,
  }
}
