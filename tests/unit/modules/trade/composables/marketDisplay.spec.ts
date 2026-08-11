import { describe, it, expect } from 'vitest'
import {
  computeTimelineMarkerPct,
  getEtNowInfo,
  formatMinuteOfDay,
  buildLocalSessionRanges,
  SESSION_BOUNDS_ET,
} from '@/modules/trade/composables/marketDisplay'

// Reference geometry: 190px bar, 22px caps, 4px gaps, three equal 43.33px
// segments. Percentages below are those pixel edges over 190.
const PCT = {
  leftCapStart: 0,
  leftCapEnd: (22 / 190) * 100,
  preStart: (26 / 190) * 100,
  preEnd: ((26 + 130 / 3) / 190) * 100,
  regStart: ((26 + 130 / 3 + 4) / 190) * 100,
  regEnd: ((26 + (130 / 3) * 2 + 4) / 190) * 100,
  postEnd: ((26 + (130 / 3) * 3 + 8) / 190) * 100,
  rightCapStart: (168 / 190) * 100,
}

describe('computeTimelineMarkerPct', () => {
  it('interpolates to the middle of the regular segment at mid-session', () => {
    const midRegular =
      (SESSION_BOUNDS_ET.regular.start + SESSION_BOUNDS_ET.regular.end) / 2
    expect(computeTimelineMarkerPct(midRegular)).toBeCloseTo(
      (PCT.regStart + PCT.regEnd) / 2,
      3,
    )
  })

  it('pins session start and end to the segment edges', () => {
    expect(
      computeTimelineMarkerPct(SESSION_BOUNDS_ET.regular.start),
    ).toBeCloseTo(PCT.regStart, 3)
    expect(computeTimelineMarkerPct(SESSION_BOUNDS_ET.regular.end)).toBeCloseTo(
      PCT.regEnd,
      3,
    )
  })

  it('places transition gaps midway between the surrounding segments', () => {
    expect(computeTimelineMarkerPct(960)).toBeCloseTo(
      (PCT.regEnd + (PCT.regEnd + (4 / 190) * 100)) / 2,
      3,
    )
    expect(computeTimelineMarkerPct(570)).toBeCloseTo(
      (PCT.preEnd + PCT.regStart) / 2,
      3,
    )
  })

  it('maps the overnight tails onto the caps', () => {
    expect(computeTimelineMarkerPct(0)).toBeCloseTo(PCT.leftCapStart, 3)
    expect(computeTimelineMarkerPct(235)).toBeCloseTo(PCT.leftCapEnd, 3)
    expect(computeTimelineMarkerPct(1205)).toBeCloseTo(PCT.rightCapStart, 3)
    expect(computeTimelineMarkerPct(1440)).toBeCloseTo(100, 3)
  })
})

describe('getEtNowInfo', () => {
  it('converts a summer instant (EDT, UTC-4)', () => {
    const info = getEtNowInfo(new Date('2026-07-24T19:07:00Z'))
    expect(info.minuteOfDay).toBe(15 * 60 + 7)
    expect(info.weekday).toBe('Fri')
  })

  it('converts a winter instant (EST, UTC-5)', () => {
    const info = getEtNowInfo(new Date('2026-01-15T19:07:00Z'))
    expect(info.minuteOfDay).toBe(14 * 60 + 7)
    expect(info.weekday).toBe('Thu')
  })

  it('handles the midnight hour in ET', () => {
    const info = getEtNowInfo(new Date('2026-07-24T04:30:00Z'))
    expect(info.minuteOfDay).toBe(30)
    expect(info.weekday).toBe('Fri')
  })
})

describe('formatMinuteOfDay', () => {
  it('formats midnight and noon with 12-hour convention', () => {
    expect(formatMinuteOfDay(0)).toBe('12:00 AM')
    expect(formatMinuteOfDay(720)).toBe('12:00 PM')
  })

  it('formats session boundaries', () => {
    expect(formatMinuteOfDay(241)).toBe('4:01 AM')
    expect(formatMinuteOfDay(959)).toBe('3:59 PM')
  })

  it('wraps values outside a single day', () => {
    expect(formatMinuteOfDay(-60)).toBe('11:00 PM')
    expect(formatMinuteOfDay(1500)).toBe('1:00 AM')
  })
})

describe('buildLocalSessionRanges', () => {
  it('produces a start → end label for every session', () => {
    const ranges = buildLocalSessionRanges(new Date('2026-07-24T19:07:00Z'))
    for (const key of [
      'premarket',
      'regular',
      'postmarket',
      'overnight',
    ] as const) {
      expect(ranges[key]).toMatch(/^\d{1,2}:\d{2} [AP]M → \d{1,2}:\d{2} [AP]M$/)
    }
  })

  it('keeps the regular session 6h28m long in any timezone', () => {
    const ranges = buildLocalSessionRanges(new Date('2026-07-24T19:07:00Z'))
    const [start, end] = ranges.regular.split(' → ')
    const toMinutes = (label: string) => {
      const [, h, m, period] = label.match(/(\d+):(\d+) ([AP]M)/)!
      return (
        ((parseInt(h) % 12) + (period === 'PM' ? 12 : 0)) * 60 + parseInt(m)
      )
    }
    const duration = (toMinutes(end) - toMinutes(start) + 1440) % 1440
    expect(duration).toBe(
      SESSION_BOUNDS_ET.regular.end - SESSION_BOUNDS_ET.regular.start,
    )
  })
})
