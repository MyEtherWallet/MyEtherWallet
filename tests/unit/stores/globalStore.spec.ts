import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { setActivePinia, createPinia } from 'pinia'

// globalStore imports @/analytics and @sentry/vue; @/analytics transitively
// resolves the hardware-wallet SDK, which is unavailable under jsdom. Stub
// both so the store loads — this spec only exercises the hide-balance flag.
vi.mock('@/analytics', () => ({
  analytics: { setNetwork: vi.fn(), setIsRegionRestricted: vi.fn() },
}))
vi.mock('@sentry/vue', () => ({ setTag: vi.fn() }))

const { useGlobalStore } = await import('@/stores/globalStore')

describe('globalStore hideBalances (MEW-2094)', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('defaults to false', () => {
    expect(useGlobalStore().hideBalances).toBe(false)
  })

  it('toggleHideBalances flips the flag', () => {
    const store = useGlobalStore()
    store.toggleHideBalances()
    expect(store.hideBalances).toBe(true)
    store.toggleHideBalances()
    expect(store.hideBalances).toBe(false)
  })

  it('persists to localStorage under mew-hide-balances', async () => {
    useGlobalStore().toggleHideBalances()
    await nextTick()
    expect(localStorage.getItem('mew-hide-balances')).toBe('true')
  })
})
