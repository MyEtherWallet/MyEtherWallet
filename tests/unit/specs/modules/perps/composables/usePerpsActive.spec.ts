import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useWalletMenuStore } from '@/stores/walletMenuStore'

const { routePath } = await vi.hoisted(async () => {
  const { ref } = await import('vue')
  return { routePath: ref('/') }
})

vi.mock('vue-router', () => ({
  useRoute: () => ({
    get path() {
      return routePath.value
    },
  }),
}))

describe('usePerpsActive', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    routePath.value = '/'
    vi.resetModules()
  })

  it('returns false on a non-perps route with side panel != perps', async () => {
    const { usePerpsActive } = await import(
      '@/modules/perps/composables/usePerpsActive'
    )
    const store = useWalletMenuStore()
    store.setWalletPanel('swap')
    routePath.value = '/stocks'
    const { isPerpsActive } = usePerpsActive()
    expect(isPerpsActive.value).toBe(false)
  })

  it('returns true on /perps route', async () => {
    const { usePerpsActive } = await import(
      '@/modules/perps/composables/usePerpsActive'
    )
    routePath.value = '/perps'
    const { isPerpsActive } = usePerpsActive()
    expect(isPerpsActive.value).toBe(true)
  })

  it('returns true on /perps/perp/:market sub-route', async () => {
    const { usePerpsActive } = await import(
      '@/modules/perps/composables/usePerpsActive'
    )
    routePath.value = '/perps/perp/ETH-USD'
    const { isPerpsActive } = usePerpsActive()
    expect(isPerpsActive.value).toBe(true)
  })

  it('returns true when side panel is perps AND drawer is open on any route', async () => {
    const { usePerpsActive } = await import(
      '@/modules/perps/composables/usePerpsActive'
    )
    const store = useWalletMenuStore()
    store.setWalletPanel('perps')
    store.setIsOpenSideMenu(true)
    routePath.value = '/stocks'
    const { isPerpsActive } = usePerpsActive()
    expect(isPerpsActive.value).toBe(true)
  })

  it('returns false when perps panel is selected but drawer is closed', async () => {
    const { usePerpsActive } = await import(
      '@/modules/perps/composables/usePerpsActive'
    )
    const store = useWalletMenuStore()
    store.setWalletPanel('perps')
    store.setIsOpenSideMenu(false)
    routePath.value = '/stocks'
    const { isPerpsActive } = usePerpsActive()
    expect(isPerpsActive.value).toBe(false)
  })

  it('reacts to walletPanel changes while drawer stays open', async () => {
    const { usePerpsActive } = await import(
      '@/modules/perps/composables/usePerpsActive'
    )
    const store = useWalletMenuStore()
    store.setWalletPanel('swap')
    store.setIsOpenSideMenu(true)
    routePath.value = '/'
    const { isPerpsActive } = usePerpsActive()
    expect(isPerpsActive.value).toBe(false)
    store.setWalletPanel('perps')
    expect(isPerpsActive.value).toBe(true)
  })

  it('reacts to drawer close while perps panel remains selected', async () => {
    const { usePerpsActive } = await import(
      '@/modules/perps/composables/usePerpsActive'
    )
    const store = useWalletMenuStore()
    store.setWalletPanel('perps')
    store.setIsOpenSideMenu(true)
    routePath.value = '/'
    const { isPerpsActive } = usePerpsActive()
    expect(isPerpsActive.value).toBe(true)
    store.setIsOpenSideMenu(false)
    expect(isPerpsActive.value).toBe(false)
  })

  it('reacts to route navigation /stocks → /perps', async () => {
    const { usePerpsActive } = await import(
      '@/modules/perps/composables/usePerpsActive'
    )
    routePath.value = '/stocks'
    const { isPerpsActive } = usePerpsActive()
    expect(isPerpsActive.value).toBe(false)
    routePath.value = '/perps'
    expect(isPerpsActive.value).toBe(true)
  })
})

describe('gatedPoll', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    routePath.value = '/'
    vi.useFakeTimers()
    vi.resetModules()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('does not call fn when inactive', async () => {
    const { gatedPoll } = await import(
      '@/modules/perps/composables/usePerpsActive'
    )
    const store = useWalletMenuStore()
    store.setWalletPanel('swap')
    routePath.value = '/'
    const fn = vi.fn()
    gatedPoll(fn, 1000)
    vi.advanceTimersByTime(3500)
    expect(fn).not.toHaveBeenCalled()
  })

  it('calls fn each tick while active', async () => {
    const { gatedPoll } = await import(
      '@/modules/perps/composables/usePerpsActive'
    )
    routePath.value = '/perps'
    const fn = vi.fn()
    gatedPoll(fn, 1000)
    vi.advanceTimersByTime(3500)
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('fires fn immediately on inactive→active transition', async () => {
    const { gatedPoll } = await import(
      '@/modules/perps/composables/usePerpsActive'
    )
    const store = useWalletMenuStore()
    store.setWalletPanel('swap')
    store.setIsOpenSideMenu(false)
    routePath.value = '/'
    const fn = vi.fn()
    gatedPoll(fn, 5000)
    vi.advanceTimersByTime(1000)
    expect(fn).not.toHaveBeenCalled()
    store.setWalletPanel('perps')
    store.setIsOpenSideMenu(true)
    await vi.advanceTimersByTimeAsync(0)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('fires fn on route navigation into /perps', async () => {
    const { gatedPoll } = await import(
      '@/modules/perps/composables/usePerpsActive'
    )
    routePath.value = '/stocks'
    const fn = vi.fn()
    gatedPoll(fn, 5000)
    vi.advanceTimersByTime(1000)
    expect(fn).not.toHaveBeenCalled()
    routePath.value = '/perps'
    await vi.advanceTimersByTimeAsync(0)
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
