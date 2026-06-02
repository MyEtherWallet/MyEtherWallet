import { ref, watch } from 'vue'
import { perpsClient } from '../configs'
import { gatedPoll } from './usePerpsActive'
import { usePerpsAuth } from './usePerpsAuth'
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

function startPolling() {
  if (initialized) return
  initialized = true
  const { token, refreshKey } = usePerpsAuth()

  // Use a simple watch via watchEffect-like pattern at module level
  // We check token on each poll cycle
  function poll() {
    if (token.value) {
      fetchPositions()
    } else {
      positions.value = []
    }
  }

  poll()
  gatedPoll(poll, 5_000)

  // The singleton is often initialised by PerpsMarketList (mounted before auth)
  // so the first poll() runs with no token and never sets loading=true. React
  // to any token change immediately so PerpsPositionsTable sees a loading state
  // on mount instead of an empty-state flash until the 5s interval ticks. Drop
  // stale data on the way out — covers logout and wallet-switch (A->B without
  // an intermediate clearAuth), where the previous account's positions would
  // otherwise linger on screen.
  watch(token, (newToken, oldToken) => {
    if (oldToken) {
      positions.value = []
      hasLoaded.value = false
    }
    if (newToken) poll()
  })

  // Watch for refreshKey changes by storing last seen value
  let lastRefreshKey = refreshKey.value
  setInterval(() => {
    if (refreshKey.value !== lastRefreshKey) {
      lastRefreshKey = refreshKey.value
      poll()
    }
  }, 500)
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
  startPolling()
  return {
    positions,
    loading,
    hasLoaded,
    error,
    refetch: fetchPositions,
    closePosition,
  }
}
