import { ref, watch } from 'vue'
import { perpsClient } from '../configs'
import { usePerpsAuth } from './usePerpsAuth'
import type { Position } from '../sdk/types'

const positions = ref<Position[]>([])
const loading = ref(false)
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
  setInterval(poll, 5_000)

  // The singleton is often initialised by PerpsMarketList (mounted before auth)
  // so the first poll() runs with no token and never sets loading=true. React
  // to login/logout immediately so PerpsPositionsTable sees a loading state on
  // mount instead of an empty-state flash until the 5s interval ticks.
  watch(token, (newToken, oldToken) => {
    if (newToken && !oldToken) {
      poll()
    } else if (!newToken && oldToken) {
      positions.value = []
    }
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
  return { positions, loading, error, refetch: fetchPositions, closePosition }
}
