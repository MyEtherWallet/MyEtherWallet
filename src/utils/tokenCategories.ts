import { type TokenBalance } from '@/mew_api/types'

/**
 * Well-known stablecoin symbols.
 *
 * The balances API's `is_stablecoin` flag cannot carry the classification on
 * its own: it is absent for the majority of tokens and comes back `false` for
 * the majors (USDC, USDT, DAI, PYUSD), while a handful of long-tail tokens are
 * flagged `true`. Symbol matching backs the flag up so the well-known stables
 * are always categorized correctly.
 */
export const STABLECOIN_SYMBOLS = new Set([
  'USDT',
  'USDC',
  'USDC.E',
  'USDBC',
  'USDT0',
  'DAI',
  'USDE',
  'USDS',
  'PYUSD',
  'FDUSD',
  'TUSD',
  'USDP',
  'GUSD',
  'FRAX',
  'LUSD',
  'USDD',
  'BUSD',
  'USDG',
  'RLUSD',
  'CRVUSD',
  'GHO',
])

/** Market cap at or above which a token counts as large cap ($10B). */
export const LARGE_CAP_MARKET_CAP = 10_000_000_000

/** The portfolio overview buckets, one per row of the overview panel. */
export type TokenCategory = 'stocks' | 'stables' | 'largeCap' | 'altcoins'

/** Tokens the balances API flags as stable, plus the majors it misses. */
export const isStablecoin = (token: {
  symbol?: string
  is_stablecoin?: boolean
}): boolean =>
  token.is_stablecoin === true ||
  STABLECOIN_SYMBOLS.has((token.symbol ?? '').toUpperCase())

/**
 * Assigns a holding to exactly one bucket. The order matters: the buckets have
 * to partition the portfolio, otherwise a token that is both an Ondo RWA and a
 * stablecoin is counted twice and the percentages add up to over 100%.
 */
export const getTokenCategory = (token: TokenBalance): TokenCategory => {
  if (token.ondo !== undefined) {
    return 'stocks'
  }
  if (isStablecoin(token)) {
    return 'stables'
  }
  if (token.market_cap && token.market_cap >= LARGE_CAP_MARKET_CAP) {
    return 'largeCap'
  }
  return 'altcoins'
}
