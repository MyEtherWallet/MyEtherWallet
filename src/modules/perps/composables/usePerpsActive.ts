import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useWalletMenuStore } from '@/stores/walletMenuStore'

export function usePerpsActive() {
  const route = useRoute()
  const menu = useWalletMenuStore()
  const { walletPanel, isOpenSideMenu } = storeToRefs(menu)
  return computed(
    () =>
      route.path.startsWith('/perps') ||
      (walletPanel.value === 'perps' && isOpenSideMenu.value),
  )
}
