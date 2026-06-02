import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useWalletMenuStore } from '@/stores/walletMenuStore'

const { routePath } = vi.hoisted(() => ({
  routePath: { value: '/' },
}))

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

  it('returns true when side panel is perps on any route', async () => {
    const { usePerpsActive } = await import(
      '@/modules/perps/composables/usePerpsActive'
    )
    const store = useWalletMenuStore()
    store.setWalletPanel('perps')
    routePath.value = '/stocks'
    const { isPerpsActive } = usePerpsActive()
    expect(isPerpsActive.value).toBe(true)
  })

  it('reacts to walletPanel changes', async () => {
    const { usePerpsActive } = await import(
      '@/modules/perps/composables/usePerpsActive'
    )
    const store = useWalletMenuStore()
    store.setWalletPanel('swap')
    routePath.value = '/'
    const { isPerpsActive } = usePerpsActive()
    expect(isPerpsActive.value).toBe(false)
    store.setWalletPanel('perps')
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
    routePath.value = '/'
    const fn = vi.fn()
    gatedPoll(fn, 5000)
    vi.advanceTimersByTime(1000)
    expect(fn).not.toHaveBeenCalled()
    store.setWalletPanel('perps')
    await vi.advanceTimersByTimeAsync(0)
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
