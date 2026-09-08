import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'

const { isTradingRestricted, reportModuleError, setIsRegionRestricted } =
  vi.hoisted(() => ({
    isTradingRestricted: vi.fn<() => Promise<boolean>>(),
    reportModuleError: vi.fn(),
    setIsRegionRestricted: vi.fn(),
  }))

vi.mock('@/modules/trade/providers/ondoHelpers', () => ({
  isTradingRestricted,
}))

vi.mock('@/utils/reportModuleError', () => ({ reportModuleError }))

// globalStore imports @/analytics and @sentry/vue; @/analytics transitively
// resolves the hardware-wallet SDK, which is unavailable under jsdom. Stub both
// so the store loads.
vi.mock('@/analytics', () => ({
  analytics: {
    setNetwork: vi.fn(),
    setIsRegionRestricted,
  },
}))

vi.mock('@sentry/vue', () => ({ setTag: vi.fn() }))

import { useGlobalStore } from '@/stores/globalStore'

describe('globalStore trading restriction', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    isTradingRestricted.mockReset()
    reportModuleError.mockReset()
    setIsRegionRestricted.mockReset()
  })

  it('starts fail-closed until the restriction check resolves', () => {
    expect(useGlobalStore().isTradingRestrictedInRegion).toBe(true)
  })

  it('deduplicates concurrent checks and caches the resolved result', async () => {
    let resolveRestriction: (restricted: boolean) => void = () => undefined
    isTradingRestricted.mockReturnValueOnce(
      new Promise(resolve => {
        resolveRestriction = resolve
      }),
    )
    const store = useGlobalStore()

    const first = store.fetchTradingRestriction()
    const second = store.fetchTradingRestriction()
    expect(isTradingRestricted).toHaveBeenCalledTimes(1)
    resolveRestriction(false)

    await expect(Promise.all([first, second])).resolves.toEqual([false, false])
    expect(store.isTradingRestrictedInRegion).toBe(false)
    expect(store.fetchedTradingThisSession).toBe(true)
    expect(setIsRegionRestricted).toHaveBeenCalledWith(false)

    await expect(store.fetchTradingRestriction()).resolves.toBe(false)
    expect(isTradingRestricted).toHaveBeenCalledTimes(1)
  })

  it('fails closed after an error and allows a later retry', async () => {
    const error = new Error('restriction service unavailable')
    isTradingRestricted
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce(false)
    const store = useGlobalStore()

    await expect(store.fetchTradingRestriction()).resolves.toBe(true)
    expect(store.isTradingRestrictedInRegion).toBe(true)
    expect(store.fetchedTradingThisSession).toBe(false)
    expect(reportModuleError).toHaveBeenCalledWith(
      expect.objectContaining({ error }),
    )

    await expect(store.fetchTradingRestriction()).resolves.toBe(false)
    expect(store.isTradingRestrictedInRegion).toBe(false)
    expect(isTradingRestricted).toHaveBeenCalledTimes(2)
  })

  // The gate every trade entry point reads: only "checked AND allowed" opens it.
  it('only reports trading allowed once a check has come back allowed', async () => {
    isTradingRestricted.mockResolvedValueOnce(false)
    const store = useGlobalStore()

    expect(store.isTradingAllowedInRegion).toBe(false)

    await store.fetchTradingRestriction()
    expect(store.isTradingAllowedInRegion).toBe(true)
  })

  it('keeps trading blocked when the check fails', async () => {
    isTradingRestricted.mockRejectedValueOnce(new Error('offline'))
    const store = useGlobalStore()

    await store.fetchTradingRestriction()
    expect(store.isTradingAllowedInRegion).toBe(false)
  })
})

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
