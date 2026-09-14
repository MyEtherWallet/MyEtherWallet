import { describe, it, expect } from 'vitest'
import {
  PERPS_CHART_INTERVALS,
  getPerpsChartRange,
} from '@/modules/perps/utils/chart'

describe('perps chart lookback filters', () => {
  it('exposes the same lookback filters as crypto/stocks, in order', () => {
    expect(PERPS_CHART_INTERVALS).toEqual([
      '1D',
      '7D',
      '1M',
      '3M',
      '1Y',
      'ALL',
    ])
  })

  it('maps each filter to a from/to window ending at `now`', () => {
    const now = 1_700_000_000
    const cases: Array<[(typeof PERPS_CHART_INTERVALS)[number], number, string]> =
      [
        ['1D', 86400, '5'],
        ['7D', 604800, '60'],
        ['1M', 2592000, '240'],
        ['3M', 7776000, '1D'],
        ['1Y', 31536000, '1D'],
        ['ALL', 157680000, '1W'],
      ]
    for (const [interval, seconds, resolution] of cases) {
      const range = getPerpsChartRange(interval, now)
      expect(range).toEqual({ from: now - seconds, to: now, resolution })
    }
  })

  it('keeps every window under ~400 candles (well below the UDF bar cap)', () => {
    const secondsPerBar: Record<string, number> = {
      '5': 300,
      '60': 3600,
      '240': 14400,
      '1D': 86400,
      '1W': 604800,
    }
    for (const interval of PERPS_CHART_INTERVALS) {
      const { from, to, resolution } = getPerpsChartRange(interval, 0)
      const bars = (to - from) / secondsPerBar[resolution]
      expect(bars).toBeLessThanOrEqual(400)
    }
  })

  it('defaults `now` to the current time when omitted', () => {
    const before = Math.floor(Date.now() / 1000)
    const { to } = getPerpsChartRange('1D')
    const after = Math.floor(Date.now() / 1000)
    expect(to).toBeGreaterThanOrEqual(before)
    expect(to).toBeLessThanOrEqual(after)
  })
})
