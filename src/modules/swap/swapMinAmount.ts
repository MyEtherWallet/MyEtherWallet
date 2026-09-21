import BigNumber from 'bignumber.js'
import { formatUnits } from 'viem'

// Display precision by magnitude (mirrors formatFloatingPointValue's tiers).
const displayDecimalsFor = (value: BigNumber): number =>
  value.gte(1) ? 2 : value.gte(0.0001) ? 4 : 8

/**
 * Display string for the smallest provider minimum among the given quote
 * minimums, expressed in the from-token's own units.
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
  const smallest = mins.reduce((a, b) => (b < a ? b : a))
  const human = new BigNumber(formatUnits(smallest, decimals))
  const dp = Math.min(displayDecimalsFor(human), decimals)
  return human.decimalPlaces(dp, BigNumber.ROUND_CEIL).toFixed()
}

/**
 * Resolve the minimum-from amount to display when the entered amount was below
 * every returned quote's minimum.
 *
 * A single sub-minimum quote request only surfaces the providers that still
 * return a quote at that amount; cheaper-minimum bridge providers return null
 * for the too-low request and are dropped by the aggregator, so the smallest min
 * among that first set overstates the real floor (MEW-2293). Re-query once at
 * that smallest min — a viable amount that lets those cheaper providers quote and
 * report their true min — and display the smallest across both sets. The probe
 * can only add lower minimums, so the shown value can only drop, never rise.
 *
 * If the probe fails or adds nothing, the first-set minimum is used unchanged.
 */
export const resolveMinFromDisplay = async (
  initialMins: bigint[],
  decimals: number,
  probeAtAmount: (amount: string) => Promise<bigint[]>,
): Promise<string> => {
  if (!initialMins.length) return '0'
  const smallest = initialMins.reduce((a, b) => (b < a ? b : a))
  let mins = initialMins
  try {
    const probed = await probeAtAmount(formatUnits(smallest, decimals))
    if (probed.length) mins = [...mins, ...probed]
  } catch {
    // Keep the first-set minimum when the re-query fails.
  }
  return smallestMinFromDisplay(mins, decimals)
}
