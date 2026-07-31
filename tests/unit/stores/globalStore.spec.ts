import { beforeEach, describe, expect, it, vi } from 'vitest'
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
})
