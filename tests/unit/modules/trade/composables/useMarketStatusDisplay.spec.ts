import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {},
}))

import { defineComponent, h } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import i18n from '@/i18n'
import { useMarketStatusStore } from '@/stores/marketStatusStore'
import { useMarketStatusDisplay } from '@/modules/trade/composables/useMarketStatusDisplay'
import type { GetWebSwapOndoMarketStatusResponse } from '@/mew_api/types'

const BASE = new Date('2026-07-24T16:45:00Z')

const make = (
  over: Partial<GetWebSwapOndoMarketStatusResponse>,
): GetWebSwapOndoMarketStatusResponse =>
  ({
    timestamp: BASE.toISOString(),
    isOpen: true,
    marketStatus: 'regular',
    nextOpenSession: 'postmarket',
    nextOpen: '2026-07-24T20:01:00Z',
    nextClose: '2026-07-24T19:59:00Z',
    reason: null,
    offhours: {
      isOpen: false,
      nextOpen: '2026-07-25T00:05:00Z',
      nextClose: '2026-07-26T23:55:00Z',
    },
    ...over,
  }) as GetWebSwapOndoMarketStatusResponse

let wrapper: VueWrapper | null = null

const mountDisplay = (status: GetWebSwapOndoMarketStatusResponse | null) => {
  const pinia = createPinia()
  setActivePinia(pinia)
  const store = useMarketStatusStore()
  store.marketStatus = status

  let display!: ReturnType<typeof useMarketStatusDisplay>
  wrapper = mount(
    defineComponent({
      setup() {
        display = useMarketStatusDisplay()
        return () => h('div')
      },
    }),
    { global: { plugins: [pinia, i18n] } },
  )
  return display
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(BASE)
})

afterEach(() => {
  wrapper?.unmount()
  wrapper = null
  vi.useRealTimers()
})

describe('pillStatus', () => {
  it('is weekend whenever off-hours is open, regardless of the conventional fields', () => {
    const display = mountDisplay(
      make({
        isOpen: true,
        marketStatus: 'overnight',
        offhours: {
          isOpen: true,
          nextOpen: '2026-07-25T00:05:00Z',
          nextClose: '2026-07-26T23:55:00Z',
        },
      }),
    )
    expect(display.pillStatus.value).toBe('weekend')
  })

  it.each([
    ['premarket', 'premarket'],
    ['postmarket', 'postmarket'],
    ['overnight', 'overnight'],
    ['regular', 'regular'],
    ['something-new', 'regular'],
  ])('maps open session %s to variant %s', (session, variant) => {
    const display = mountDisplay(make({ isOpen: true, marketStatus: session }))
    expect(display.pillStatus.value).toBe(variant)
  })

  it('is paused when nothing is tradable', () => {
    const display = mountDisplay(
      make({
        isOpen: false,
        marketStatus: 'closed',
        offhours: {
          isOpen: false,
          nextOpen: '2026-07-25T00:05:00Z',
          nextClose: '2026-07-26T23:55:00Z',
        },
      }),
    )
    expect(display.pillStatus.value).toBe('paused')
  })
})

describe('untilText', () => {
  it('is empty while the status has not loaded', () => {
    const display = mountDisplay(null)
    expect(display.untilText.value).toBe('')
  })

  it('shows the session close time while a session is open', () => {
    const display = mountDisplay(make({}))
    expect(display.untilText.value).toMatch(/^Until /)
  })

  it('counts down to the next session while paused', () => {
    const display = mountDisplay(
      make({
        isOpen: false,
        marketStatus: 'closed',
        nextOpen: new Date(BASE.getTime() + 2 * 60_000).toISOString(),
        nextOpenSession: 'regular',
        offhours: {
          isOpen: false,
          nextOpen: '2026-07-25T00:05:00Z',
          nextClose: '2026-07-26T23:55:00Z',
        },
      }),
    )
    expect(display.untilText.value).toBe('2 min until Regular market')
  })

  it('uses the off-hours close while in the weekend track', () => {
    const display = mountDisplay(
      make({
        isOpen: false,
        offhours: {
          isOpen: true,
          nextOpen: '2026-07-25T00:05:00Z',
          nextClose: '2026-07-26T23:55:00Z',
        },
      }),
    )
    expect(display.untilText.value).toMatch(/^Until /)
    expect(display.untilText.value).toContain('Sunday')
  })
})

describe('timeline props', () => {
  it('labels the market day in ET', () => {
    const display = mountDisplay(make({}))
    expect(display.dayLabel.value).toBe('FRI')
  })

  it('positions the marker inside the regular segment at 12:45 PM ET', () => {
    const display = mountDisplay(make({}))
    expect(display.markerPct.value).toBeGreaterThan(38)
    expect(display.markerPct.value).toBeLessThan(62)
  })

  it('exposes local ranges for every session tooltip', () => {
    const display = mountDisplay(make({}))
    expect(Object.keys(display.sessionRanges.value).sort()).toEqual([
      'overnight',
      'postmarket',
      'premarket',
      'regular',
    ])
  })
})

describe('nextOpenText', () => {
  it('describes the next session opening', () => {
    const display = mountDisplay(
      make({ nextOpenSession: 'premarket', nextOpen: '2026-07-27T08:01:00Z' }),
    )
    expect(display.nextOpenText.value).toMatch(/^Pre-Market starts /)
  })
})
