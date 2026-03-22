import { ref, watchEffect, onUnmounted } from 'vue'
import { perpsClient } from '../configs'
import { usePerpsAuth } from './usePerpsAuth'
import type { Position } from '../sdk/types'

export function usePerpsPositions() {
  const { token, refreshKey } = usePerpsAuth()
  const positions = ref<Position[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  let pollTimer: ReturnType<typeof setInterval> | null = null

  async function fetchPositions() {
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

  watchEffect(() => {
    void refreshKey.value
    if (pollTimer) clearInterval(pollTimer)
    if (token.value) {
      fetchPositions()
      pollTimer = setInterval(fetchPositions, 5_000)
    } else {
      positions.value = []
      pollTimer = null
    }
  })

  onUnmounted(() => {
    if (pollTimer) clearInterval(pollTimer)
  })

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

  return { positions, loading, error, refetch: fetchPositions, closePosition }
}
