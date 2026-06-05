import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { ref } from 'vue'

const routeRef = ref({ path: '/' })
vi.mock('vue-router', () => ({
  useRoute: () => routeRef.value,
}))

import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { usePerpsActive } from '../usePerpsActive'

describe('usePerpsActive', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    routeRef.value = { path: '/' }
  })

  it('is false when not on /perps and side menu closed', () => {
    const active = usePerpsActive()
    expect(active.value).toBe(false)
  })

  it('is true when route starts with /perps', () => {
    routeRef.value = { path: '/perps/AAPL-PERP' }
    const active = usePerpsActive()
    expect(active.value).toBe(true)
  })

  it('is true when walletPanel === "perps" AND side menu open', () => {
    const menu = useWalletMenuStore()
    menu.setWalletPanel('perps')
    menu.setIsOpenSideMenu(true)
    const active = usePerpsActive()
    expect(active.value).toBe(true)
  })

  it('is false when walletPanel === "perps" but side menu closed', () => {
    const menu = useWalletMenuStore()
    menu.setWalletPanel('perps')
    menu.setIsOpenSideMenu(false)
    const active = usePerpsActive()
    expect(active.value).toBe(false)
  })
})
