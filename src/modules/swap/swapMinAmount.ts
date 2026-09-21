import BigNumber from 'bignumber.js'
import { formatUnits } from 'viem'

// Display precision by magnitude (mirrors formatFloatingPointValue's tiers).
const displayDecimalsFor = (value: BigNumber): number =>
  value.gte(1) ? 2 : value.gte(0.0001) ? 4 : 8

/**
 * Display string for the smallest provider minimum among the given quote
 * minimums, expressed in the from-token's own units.
 *
 * Some providers report a placeholder minimum of 0 or 1 base unit instead of a
 * real limit (e.g. Rango), which would render as a misleading near-zero floor.
 * Those are ignored in favour of the real minimums; the raw list is only used as
 * a fallback when every entry is a placeholder (MEW-2293).
 *
 * Rounded UP at display precision so the shown amount is never below the real
 * minimum — otherwise a user who types the displayed value hits "amount too
 * low" again (MEW-2109). The minimums arrive in the token's base units, so they
 * are formatted with that token's decimals — never a fixed 18.
 */
export const smallestMinFromDisplay = (
  mins: bigint[],
  decimals: number,
): string => {
  if (!mins.length) return '0'
  const real = mins.filter(m => m > 1n)
  const pool = real.length ? real : mins
  const smallest = pool.reduce((a, b) => (b < a ? b : a))
  const human = new BigNumber(formatUnits(smallest, decimals))
  const dp = Math.min(displayDecimalsFor(human), decimals)
  return human.decimalPlaces(dp, BigNumber.ROUND_CEIL).toFixed()
}
