import type { WebTokenPriceChartInterval } from '@/mew_api/types'

/**
 * Lookback filters for the perps market-info price chart. Mirrors the
 * crypto/stocks info charts (1D/7D/1M/3M/1Y/ALL) instead of the old candle
 * resolutions — on a line chart the lookback range is what's meaningful.
 *
 * Each period maps to a lookback window (in seconds) plus the candle
 * resolution passed to the Ondo history endpoint, chosen to keep the returned
 * bar count small (well under any UDF bar cap).
 *
 * ponytail: ALL uses a fixed ~5y window — perps exposes no inception date in
 * the app; widen the window if markets older than that appear.
 */
export const PERPS_CHART_INTERVALS: WebTokenPriceChartInterval[] = [
  '1D',
  '7D',
  '1M',
  '3M',
  '1Y',
  'ALL',
]

const RANGE: Record<
  WebTokenPriceChartInterval,
  { seconds: number; resolution: string }
> = {
  '1D': { seconds: 86400, resolution: '5' }, // 5m  → 288 bars
  '7D': { seconds: 604800, resolution: '60' }, // 1h  → 168 bars
  '1M': { seconds: 2592000, resolution: '240' }, // 4h  → 180 bars
  '3M': { seconds: 7776000, resolution: '1D' }, // 1d  → 90 bars
  '1Y': { seconds: 31536000, resolution: '1D' }, // 1d  → 365 bars
  ALL: { seconds: 157680000, resolution: '1W' }, // 1w  → ~260 bars (~5y)
}

/**
 * Resolve a lookback filter to the `{ from, to, resolution }` args for
 * `perpsClient.getHistory`. `now` (unix seconds) is injectable for tests.
 */
export function getPerpsChartRange(
  interval: WebTokenPriceChartInterval,
  now: number = Math.floor(Date.now() / 1000),
): { from: number; to: number; resolution: string } {
  const { seconds, resolution } = RANGE[interval]
  return { from: now - seconds, to: now, resolution }
}
