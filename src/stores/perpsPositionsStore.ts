import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { perpsClient } from '@/modules/perps/configs'
import { capturePerps } from '@/modules/perps/sentry'
import { PERPS_FEATURE } from '@/sentry/constants'
import {
  usePerpsAuth,
  onPerpsAuthReset,
} from '@/modules/perps/composables/usePerpsAuth'
import { perpsWs } from '@/modules/perps/sdk/ws'
import type { Position } from '@/modules/perps/sdk/types'

/**
 * The signed-in account's open perps positions, kept live over WS.
 *
 * Store setup is the once-per-app site the old module-level `initialized` flag
 * and detached effect scope stood in for: these watchers and the subscription
 * are owned by the pinia instance, so they outlive every component that reads
 * them. That is what the previous implementation was working around — watchers
 * died with the first consumer's unmount and, gated by `initialized`, never
 * re-registered, so an account switch A→B kept showing A's positions.
 */
export const usePerpsPositionsStore = defineStore('perpsPositions', () => {
  const positions = ref<Position[]>([])
  const loading = ref(false)
  const hasLoaded = ref(false)
  const error = ref<string | null>(null)

  const { token, refreshKey } = usePerpsAuth()

  const fetchPositions = async () => {
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
      capturePerps(PERPS_FEATURE.POSITION, e, {
        title: 'PERPS: Error fetching positions',
      })
    } finally {
      loading.value = false
      hasLoaded.value = true
    }
  }

  const closePosition = async (pos: Position) => {
    const side = pos.direction === 'long' ? 'sell' : 'buy'
    await perpsClient.createOrder({
      market: pos.market,
      type: 'market',
      side,
      size: pos.netQuantity,
    })
    await fetchPositions()
  }

  // Kept alongside the token watcher below rather than folded into it: auth
  // teardown wipes this synchronously, without waiting for a watcher flush. See
  // the note on `onPerpsAuthReset` — showing a previous account's positions is a
  // trust bug, so the wipe must not depend on flush timing.
  onPerpsAuthReset(() => {
    positions.value = []
    hasLoaded.value = false
  })

  watch(
    token,
    (newToken, oldToken) => {
      if (oldToken) {
        positions.value = []
        hasLoaded.value = false
      }
      if (newToken) void fetchPositions()
    },
    { immediate: true },
  )

  watch(refreshKey, () => {
    if (token.value) void fetchPositions()
  })

  perpsWs.subscribe<Position>('positionsPerps', rows => {
    // Ignore pushes while signed out / mid wallet-switch — see the balancePerps
    // guard in usePerpsAuth: a stale frame for the previous account would
    // otherwise repopulate positions we just cleared.
    if (!token.value) return
    positions.value = rows
    hasLoaded.value = true
  })

  return {
    positions,
    loading,
    hasLoaded,
    error,
    fetchPositions,
    closePosition,
  }
})
