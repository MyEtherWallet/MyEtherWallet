import { computed, watch, effectScope, type ComputedRef } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useWalletMenuStore } from '@/stores/walletMenuStore'

let _isPerpsActive: ComputedRef<boolean> | null = null

export function usePerpsActive() {
  if (!_isPerpsActive) {
    const route = useRoute()
    const { walletPanel, isOpenSideMenu } = storeToRefs(useWalletMenuStore())
    _isPerpsActive = computed(
      () =>
        route.path.startsWith('/perps') ||
        (walletPanel.value === 'perps' && isOpenSideMenu.value),
    )
  }
  return { isPerpsActive: _isPerpsActive }
}

export function gatedPoll(fn: () => void, intervalMs: number) {
  const { isPerpsActive } = usePerpsActive()
  setInterval(() => {
    if (isPerpsActive.value) fn()
  }, intervalMs)
  // Detached scope so the watcher survives the unmount of whichever
  // component happens to call gatedPoll first.
  effectScope(true).run(() => {
    watch(isPerpsActive, on => {
      if (on) fn()
    })
  })
}
