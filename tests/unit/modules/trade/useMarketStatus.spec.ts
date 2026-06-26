import { describe, it, expect } from 'vitest'
import { resolveCurrentSession } from '@/modules/trade/composables/marketSession'
import type { GetWebSwapOndoMarketStatusResponse } from '@/mew_api/types'

const make = (
  over: Partial<GetWebSwapOndoMarketStatusResponse>,
): GetWebSwapOndoMarketStatusResponse =>
  ({
    timestamp: '2026-06-24T00:00:00Z',
    isOpen: false,
    marketStatus: 'closed',
    nextOpenSession: 'regular',
    nextOpen: '2026-06-24T13:30:00Z',
    nextClose: '2026-06-24T20:00:00Z',
    reason: null,
    ...over,
  }) as GetWebSwapOndoMarketStatusResponse

describe('resolveCurrentSession', () => {
  it('returns null when status is null', () => {
    expect(resolveCurrentSession(null)).toBeNull()
  })

  it.each([
    ['regular'],
    ['premarket'],
    ['postmarket'],
    ['overnight'],
  ])('returns the conventional session %s when market is open', session => {
    expect(
      resolveCurrentSession(make({ isOpen: true, marketStatus: session })),
    ).toBe(session)
  })

  it('returns "offhours" when conventional is closed but off-hours is open', () => {
    const status = make({
      isOpen: false,
      marketStatus: 'closed',
      offhours: {
        isOpen: true,
        nextOpen: '2026-06-22T00:05:00Z',
        nextClose: '2026-06-23T23:55:00Z',
      },
    })
    expect(resolveCurrentSession(status)).toBe('offhours')
  })

  it('returns null when conventional is closed and off-hours is closed', () => {
    expect(
      resolveCurrentSession(
        make({
          isOpen: false,
          offhours: {
            isOpen: false,
            nextOpen: '2026-06-22T00:05:00Z',
            nextClose: '2026-06-23T23:55:00Z',
          },
        }),
      ),
    ).toBeNull()
  })

  it('returns null when closed and off-hours field is absent (pre-backend)', () => {
    expect(resolveCurrentSession(make({ isOpen: false }))).toBeNull()
  })

  it('prefers off-hours over the conventional session when both are open (Case 1 precedence)', () => {
    const status = make({
      isOpen: true,
      marketStatus: 'regular',
      offhours: {
        isOpen: true,
        nextOpen: '2026-06-22T00:05:00Z',
        nextClose: '2026-06-23T23:55:00Z',
      },
    })
    expect(resolveCurrentSession(status)).toBe('offhours')
  })

  it('uses the conventional session when off-hours closed but market open (Case 2)', () => {
    const status = make({
      isOpen: true,
      marketStatus: 'postmarket',
      offhours: {
        isOpen: false,
        nextOpen: '2026-06-22T00:05:00Z',
        nextClose: '2026-06-23T23:55:00Z',
      },
    })
    expect(resolveCurrentSession(status)).toBe('postmarket')
  })
})
