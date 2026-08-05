import { formatUnits } from 'viem'

import { formatFloatingPointValue } from '@/utils/numberFormatHelper'

/**
 * Display string for the smallest provider minimum among the given quote
 * minimums, expressed in the from-token's own units.
 *
 * When every swap quote requires more than the user entered, MEW shows the
 * real minimum they need instead of a bare "amount too low" (MEW-2109). The
 * minimums come from the SDK in the from-token's base units, so they must be
 * formatted with that token's decimals — not a hardcoded 18.
 */
export const smallestMinFromDisplay = (
  mins: bigint[],
  decimals: number,
): string => {
  if (!mins.length) return '0'
  const smallest = mins.reduce((a, b) => (b < a ? b : a))
  return formatFloatingPointValue(formatUnits(smallest, decimals)).value
}
