import BigNumber from 'bignumber.js'
import { formatUnits } from 'viem'

// Display precision by magnitude (mirrors formatFloatingPointValue's tiers).
const displayDecimalsFor = (value: BigNumber): number =>
  value.gte(1) ? 2 : value.gte(0.0001) ? 4 : 8

/** Base-unit amount as a display string, rounded UP at display precision. */
const displayUp = (base: bigint, decimals: number): string => {
  const human = new BigNumber(formatUnits(base, decimals))
  const dp = Math.min(displayDecimalsFor(human), decimals)
  return human.decimalPlaces(dp, BigNumber.ROUND_CEIL).toFixed()
}

/** A declared minimum of 0 or 1 base unit is a placeholder, not a real limit. */
const isRealMin = (m: bigint): boolean => m > 1n

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
  const real = mins.filter(isRealMin)
  const pool = real.length ? real : mins
  const smallest = pool.reduce((a, b) => (b < a ? b : a))
  return displayUp(smallest, decimals)
}

/** Number of parallel probe quotes fired to locate the servable floor. */
export const MIN_PROBE_STEPS = 3

/**
 * Geometrically spaced base-unit amounts strictly between `amountBase` and
 * `ceilingBase`, ascending. With 3 steps and 0.07 -> 446 POL this yields roughly
 * 0.63, 5.6 and 50 POL: one probe per order of magnitude of the gap.
 */
export const probeAmountsBetween = (
  amountBase: bigint,
  ceilingBase: bigint,
  steps = MIN_PROBE_STEPS,
): bigint[] => {
  const floor = amountBase > 0n ? amountBase : 1n
  if (steps < 1 || floor >= ceilingBase) return []
  const ratio = Math.pow(Number(ceilingBase) / Number(floor), 1 / (steps + 1))
  const out: bigint[] = []
  for (let k = 1; k <= steps; k++) {
    const factor = new BigNumber(Math.pow(ratio, k).toPrecision(15))
    const value = BigInt(
      new BigNumber(floor.toString())
        .times(factor)
        .integerValue(BigNumber.ROUND_CEIL)
        .toFixed(0),
    )
    if (value > floor && value < ceilingBase && !out.includes(value)) {
      out.push(value)
    }
  }
  return out
}

/**
 * Display string for the lowest amount a provider will actually serve when the
 * entered amount was below every returned quote's minimum.
 *
 * Providers such as Rango declare a placeholder minimum and simply return no
 * quote below a fee-dependent floor they never report, so the smallest declared
 * minimum (e.g. Changelly's ~446 POL) overstates the aggregator's real floor
 * (MEW-2293). Probe a few amounts between the entered amount and that declared
 * minimum in parallel; a probe is servable when some returned quote's own
 * minimum is at or below the probe amount (a quote clamped up to a higher
 * minimum does not count). The lowest servable probe is shown, rounded UP so
 * re-entering it clears the floor; if no probe is servable, the smallest real
 * declared minimum is shown as before.
 */
export const resolveServableMinDisplay = async (
  amountBase: bigint,
  mins: bigint[],
  decimals: number,
  probe: (amount: string) => Promise<bigint[]>,
): Promise<string> => {
  const real = mins.filter(isRealMin)
  if (!real.length) return smallestMinFromDisplay(mins, decimals)
  const ceiling = real.reduce((a, b) => (b < a ? b : a))
  const candidates = probeAmountsBetween(amountBase, ceiling)
  const results = await Promise.allSettled(
    candidates.map(async candidate => ({
      candidate,
      mins: await probe(formatUnits(candidate, decimals)),
    })),
  )
  const servable = results
    .filter(
      (r): r is PromiseFulfilledResult<{ candidate: bigint; mins: bigint[] }> =>
        r.status === 'fulfilled',
    )
    .map(r => r.value)
    .filter(({ candidate, mins: probedMins }) =>
      probedMins.some(m => m <= candidate),
    )
    .map(({ candidate }) => candidate)
  if (!servable.length) return displayUp(ceiling, decimals)
  return displayUp(servable.reduce((a, b) => (b < a ? b : a)), decimals)
}
