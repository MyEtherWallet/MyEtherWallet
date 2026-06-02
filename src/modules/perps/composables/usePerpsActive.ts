import { computed, type ComputedRef } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useWalletMenuStore } from '@/stores/walletMenuStore'

let _isPerpsActive: ComputedRef<boolean> | null = null

export function usePerpsActive() {
  if (!_isPerpsActive) {
    const route = useRoute()
    const { walletPanel } = storeToRefs(useWalletMenuStore())
    _isPerpsActive = computed(
      () => route.path.startsWith('/perps') || walletPanel.value === 'perps',
    )
  }
  return { isPerpsActive: _isPerpsActive }
}
