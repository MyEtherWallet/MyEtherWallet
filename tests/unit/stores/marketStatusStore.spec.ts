import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {},
}))

vi.mock('@/modules/trade/providers/ondoHelpers', () => ({
  getMarketStatus: vi.fn(),
  isTradingRestricted: vi.fn().mockResolvedValue(false),
  TRADING_RESTRICTED_HELP_URL: 'https://help.test',
}))

import { createPinia, setActivePinia } from 'pinia'
import { useMarketStatusStore } from '@/stores/marketStatusStore'
import { getMarketStatus } from '@/modules/trade/providers/ondoHelpers'
import type { GetWebSwapOndoMarketStatusResponse } from '@/mew_api/types'

const mockedGetMarketStatus = vi.mocked(getMarketStatus)

const BASE = new Date('2026-07-24T16:45:00Z')

const iso = (offsetMs: number) =>
  new Date(BASE.getTime() + offsetMs).toISOString()

const make = (
  over: Partial<GetWebSwapOndoMarketStatusResponse> = {},
): GetWebSwapOndoMarketStatusResponse =>
  ({
    timestamp: BASE.toISOString(),
    isOpen: true,
    marketStatus: 'regular',
    nextOpenSession: 'postmarket',
    nextOpen: iso(2 * 60 * 60_000),
    nextClose: iso(2 * 60 * 60_000),
    reason: null,
    offhours: {
      isOpen: false,
      nextOpen: iso(4 * 60 * 60_000),
      nextClose: iso(6 * 60 * 60_000),
    },
    ...over,
  }) as GetWebSwapOndoMarketStatusResponse

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(BASE)
  vi.clearAllMocks()
  setActivePinia(createPinia())
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useMarketStatusStore', () => {
  it('refetches when the tab becomes visible with stale data', async () => {
    mockedGetMarketStatus.mockResolvedValue(make())
    const store = useMarketStatusStore()
    await store.fetchMarketStatus()
    expect(mockedGetMarketStatus).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(61_000)
    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      configurable: true,
    })
    document.dispatchEvent(new Event('visibilitychange'))
    await vi.advanceTimersByTimeAsync(0)

    expect(mockedGetMarketStatus).toHaveBeenCalledTimes(2)
  })

  it('does not refetch on visibility when the data is fresh', async () => {
    mockedGetMarketStatus.mockResolvedValue(make())
    const store = useMarketStatusStore()
    await store.fetchMarketStatus()
    const callsAfterFetch = mockedGetMarketStatus.mock.calls.length

    document.dispatchEvent(new Event('visibilitychange'))
    await vi.advanceTimersByTimeAsync(0)

    expect(mockedGetMarketStatus.mock.calls.length).toBe(callsAfterFetch)
  })

  it('schedules a refetch right after the next session boundary', async () => {
    mockedGetMarketStatus.mockResolvedValue(
      make({ nextClose: iso(60_000), nextOpen: iso(90 * 60_000) }),
    )
    const store = useMarketStatusStore()
    await store.fetchMarketStatus()
    const callsAfterFetch = mockedGetMarketStatus.mock.calls.length

    await vi.advanceTimersByTimeAsync(59_000)
    expect(mockedGetMarketStatus.mock.calls.length).toBe(callsAfterFetch)

    await vi.advanceTimersByTimeAsync(4_000)
    expect(mockedGetMarketStatus.mock.calls.length).toBe(callsAfterFetch + 1)
  })

  it('retries on a short delay when the API reports only past boundaries', async () => {
    mockedGetMarketStatus.mockResolvedValue(
      make({
        nextClose: iso(-60_000),
        nextOpen: iso(-30_000),
        offhours: {
          isOpen: false,
          nextOpen: iso(-10_000),
          nextClose: iso(-5_000),
        },
      }),
    )
    const store = useMarketStatusStore()
    await store.fetchMarketStatus()
    const callsAfterFetch = mockedGetMarketStatus.mock.calls.length

    await vi.advanceTimersByTimeAsync(10_100)
    expect(mockedGetMarketStatus.mock.calls.length).toBe(callsAfterFetch + 1)
  })

  it('schedules a retry when the fetch fails', async () => {
    mockedGetMarketStatus.mockRejectedValueOnce(new Error('network down'))
    mockedGetMarketStatus.mockResolvedValue(make())
    const store = useMarketStatusStore()
    await store.fetchMarketStatus()
    expect(store.marketStatus).toBeNull()

    await vi.advanceTimersByTimeAsync(10_100)
    expect(mockedGetMarketStatus.mock.calls.length).toBe(2)
    expect(store.marketStatus).not.toBeNull()
  })

  it('collapses concurrent fetches into a single request', async () => {
    let release!: (value: GetWebSwapOndoMarketStatusResponse) => void
    mockedGetMarketStatus.mockReturnValue(
      new Promise(resolve => {
        release = resolve
      }),
    )
    const store = useMarketStatusStore()
    const first = store.fetchMarketStatus()
    const second = store.fetchMarketStatus()
    expect(mockedGetMarketStatus).toHaveBeenCalledTimes(1)

    release(make())
    await Promise.all([first, second])
    expect(store.marketStatus?.marketStatus).toBe('regular')
  })

  it('retries on a short delay when the reported session ended but the next boundary is ahead', async () => {
    mockedGetMarketStatus.mockResolvedValue(
      make({ nextClose: iso(-60_000), nextOpen: iso(6 * 60_000) }),
    )
    const store = useMarketStatusStore()
    await store.fetchMarketStatus()
    const callsAfterFetch = mockedGetMarketStatus.mock.calls.length

    await vi.advanceTimersByTimeAsync(10_100)

    expect(mockedGetMarketStatus.mock.calls.length).toBe(callsAfterFetch + 1)
  })

  it('reports a stale boundary while the close it claims has already passed', async () => {
    mockedGetMarketStatus.mockResolvedValue(make({ nextClose: iso(-60_000) }))
    const store = useMarketStatusStore()
    await store.fetchMarketStatus()

    expect(store.hasStaleBoundary()).toBe(true)
  })

  it('reports no stale boundary while the close is still ahead', async () => {
    mockedGetMarketStatus.mockResolvedValue(make({ nextClose: iso(60_000) }))
    const store = useMarketStatusStore()
    await store.fetchMarketStatus()

    expect(store.hasStaleBoundary()).toBe(false)
  })

  it('reads the off-hours boundary while off-hours is the open session', async () => {
    mockedGetMarketStatus.mockResolvedValue(
      make({
        isOpen: false,
        nextOpen: iso(60 * 60_000),
        offhours: {
          isOpen: true,
          nextOpen: iso(-60_000),
          nextClose: iso(-30_000),
        },
      }),
    )
    const store = useMarketStatusStore()
    await store.fetchMarketStatus()

    expect(store.hasStaleBoundary()).toBe(true)
  })

  it('reports no stale boundary before any status has loaded', () => {
    const store = useMarketStatusStore()

    expect(store.hasStaleBoundary()).toBe(false)
  })

  it('exposes the tradability computeds from the fetched status', async () => {
    mockedGetMarketStatus.mockResolvedValue(
      make({
        isOpen: false,
        marketStatus: 'closed',
        offhours: {
          isOpen: true,
          nextOpen: iso(-60_000),
          nextClose: iso(60 * 60_000),
        },
      }),
    )
    const store = useMarketStatusStore()
    await store.fetchMarketStatus()

    expect(store.isMarketOpen).toBe(false)
    expect(store.isOffHoursOpen).toBe(true)
    expect(store.currentSession).toBe('offhours')
    expect(store.isTradingSessionOpen).toBe(true)
  })
})
