import { ref, watch, effectScope } from 'vue'
import { perpsClient } from '../configs'
import { usePerpsAuth } from './usePerpsAuth'
import { perpsWs } from '../sdk/ws'
import { ensurePerpsWsLifecycle } from './usePerpsWsLifecycle'
import type { Position } from '../sdk/types'

const positions = ref<Position[]>([])
const loading = ref(false)
const hasLoaded = ref(false)
const error = ref<string | null>(null)
let initialized = false

async function fetchPositions() {
  const { token } = usePerpsAuth()
  if (!token.value) {
    positions.value = []
    return
  }
  loading.value = true
  error.value = null
  try {
    const res = await perpsClient.getPositions()
    positions.value = res.result ?? []
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load positions'
  } finally {
    loading.value = false
    hasLoaded.value = true
  }
}

function startWs() {
  if (initialized) return
  initialized = true
  ensurePerpsWsLifecycle()
  const { token, refreshKey } = usePerpsAuth()

  // Detached scope so these singleton watchers survive the unmount of the first
  // component that calls usePerpsPositions() — otherwise they die on route/panel
  // change and, guarded by `initialized`, never re-register, so an account
  // switch A→B stops clearing/refetching and keeps showing A's positions.
  effectScope(true).run(() => {
    watch(token, (newToken, oldToken) => {
      if (oldToken) {
        positions.value = []
        hasLoaded.value = false
      }
      if (newToken) void fetchPositions()
    }, { immediate: true })

    watch(refreshKey, () => {
      if (token.value) void fetchPositions()
    })

    perpsWs.subscribe<Position>('positionsPerps', (rows) => {
      positions.value = rows
      hasLoaded.value = true
    })
  })
}

async function closePosition(pos: Position) {
  const side = pos.direction === 'long' ? 'sell' : 'buy'
  await perpsClient.createOrder({
    market: pos.market,
    type: 'market',
    side,
    size: pos.netQuantity,
  })
  await fetchPositions()
}

export function usePerpsPositions() {
  startWs()
  return {
    positions,
    loading,
    hasLoaded,
    error,
    refetch: fetchPositions,
    closePosition,
  }
}
