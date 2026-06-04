import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useChartHistoryCache, _resetChartHistoryCacheForTests } from '@/modules/perps/composables/useChartHistoryCache'

describe('useChartHistoryCache', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    _resetChartHistoryCacheForTests()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns undefined for unknown keys', () => {
    const { get } = useChartHistoryCache()
    expect(get('BTC-USD-60')).toBeUndefined()
  })

  it('returns a fresh entry inside the TTL', () => {
    const { get, set } = useChartHistoryCache()
    set('BTC-USD-60', { labels: [1, 2], points: [10, 20] })
    vi.advanceTimersByTime(30_000)
    expect(get('BTC-USD-60')).toEqual({ labels: [1, 2], points: [10, 20] })
  })

  it('returns undefined when the entry is older than the TTL (60s)', () => {
    const { get, set } = useChartHistoryCache()
    set('BTC-USD-60', { labels: [1], points: [10] })
    vi.advanceTimersByTime(61_000)
    expect(get('BTC-USD-60')).toBeUndefined()
  })

  it('shares state across composable invocations (module scope)', () => {
    const a = useChartHistoryCache()
    a.set('ETH-USD-60', { labels: [9], points: [100] })
    const b = useChartHistoryCache()
    expect(b.get('ETH-USD-60')).toEqual({ labels: [9], points: [100] })
  })

  it('clearAll wipes every entry', () => {
    const { get, set, clearAll } = useChartHistoryCache()
    set('BTC-USD-60', { labels: [1], points: [10] })
    clearAll()
    expect(get('BTC-USD-60')).toBeUndefined()
  })
})
