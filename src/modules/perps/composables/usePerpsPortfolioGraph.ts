import { ref, watch, effectScope } from 'vue'
import { perpsClient } from '../configs'
import { usePerpsAuth, onPerpsAuthReset } from './usePerpsAuth'
import type { PortfolioGraphPoint } from '../sdk/types'

export type GraphRange = '24h' | '7d' | '30d' | 'all'

const _graphData = ref<PortfolioGraphPoint[]>([])
const _graphLoading = ref(false)
const _graphRange = ref<GraphRange>('30d')
const _cache = ref<Map<GraphRange, PortfolioGraphPoint[]>>(new Map())

let _initialized = false

// Detached scope so watchers survive component unmounts
const _scope = effectScope(true)

export function usePerpsPortfolioGraph() {
  const { token } = usePerpsAuth()

  async function fetchGraph() {
    if (!token.value) {
      _graphData.value = []
      return
    }

    const cached = _cache.value.get(_graphRange.value)
    if (cached) {
      _graphData.value = cached
      return
    }

    _graphLoading.value = true
    try {
      const res = await perpsClient.getPortfolioGraph(_graphRange.value)
      const result = res.result ?? []
      _cache.value.set(_graphRange.value, result)
      _graphData.value = result
    } catch {
      _graphData.value = []
    } finally {
      _graphLoading.value = false
    }
  }

  if (!_initialized) {
    _initialized = true

    onPerpsAuthReset(() => {
      _graphData.value = []
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
            _graphData.value = []
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
