import { describe, it, expect, vi } from 'vitest'
import { parseUnits } from 'viem'

import {
  smallestMinFromDisplay,
  probeAmountsBetween,
  resolveServableMinDisplay,
  MIN_OUTPUT_USD,
  outputUsd,
  meetsOutputFloor,
  inputForOutputFloor,
} from '@/modules/swap/swapMinAmount'

describe('smallestMinFromDisplay', () => {
  it('rounds the minimum UP so the shown amount is never below it (PYUSD, 6dp)', () => {
    // Changelly minimumFrom for PYUSD->ETH = 50.013709 PYUSD in base units (MEW-2109).
    // 50.01 would still be below the minimum, so it must round up to 50.02.
    const min = 50013709n
    const display = smallestMinFromDisplay([min], 6)
    expect(display).toBe('50.02')
    // The displayed value, re-entered, must clear the base-unit minimum.
    expect(parseUnits(display, 6) >= min).toBe(true)
  })

  it('picks the smallest minimum across providers', () => {
    expect(smallestMinFromDisplay([60000000n, 50013709n], 6)).toBe('50.02')
  })

  it('handles 18-decimal tokens', () => {
    expect(smallestMinFromDisplay([1500000000000000000n], 18)).toBe('1.5')
  })

  it('preserves zero-decimal tokens (no fractional inflation)', () => {
    const min = 100n
    const display = smallestMinFromDisplay([min], 0)
    expect(display).toBe('100')
    expect(parseUnits(display, 0) >= min).toBe(true)
  })

  it('returns "0" when there are no minimums', () => {
    expect(smallestMinFromDisplay([], 6)).toBe('0')
  })

  it('ignores a placeholder minimum so a real floor is shown (POL, 18dp)', () => {
    // Rango reports minimumFrom = 1 base unit (a placeholder, not a real limit);
    // Changelly reports the real 445.9768161 POL. The real one must win, instead
    // of rendering a misleading 0.00000001 POL (MEW-2293).
    const rangoPlaceholder = 1n
    const changellyReal = parseUnits('445.9768161', 18)
    expect(
      smallestMinFromDisplay([rangoPlaceholder, changellyReal], 18),
    ).toBe('445.98')
  })

  it('treats a bare 0 minimum as a placeholder too', () => {
    const real = parseUnits('5', 18)
    expect(smallestMinFromDisplay([0n, real], 18)).toBe('5')
  })

  it('falls back to the raw value when every minimum is a placeholder', () => {
    // Nothing real to show; better than dropping the message entirely.
    expect(smallestMinFromDisplay([1n], 18)).toBe('0.00000001')
  })
})

describe('probeAmountsBetween', () => {
  it('spaces three probes geometrically, strictly inside the gap, ascending', () => {
    const amount = parseUnits('0.07', 18)
    const ceiling = parseUnits('446', 18)
    const probes = probeAmountsBetween(amount, ceiling)
    expect(probes).toHaveLength(3)
    for (let i = 0; i < probes.length; i++) {
      expect(probes[i] > amount).toBe(true)
      expect(probes[i] < ceiling).toBe(true)
      if (i > 0) expect(probes[i] > probes[i - 1]).toBe(true)
    }
    // ~0.63, ~5.6, ~50 POL: one probe per order of magnitude of the gap.
    expect(Number(probes[0]) / 1e18).toBeCloseTo(0.63, 1)
    expect(Number(probes[1]) / 1e18).toBeCloseTo(5.6, 0)
    expect(Number(probes[2]) / 1e18).toBeCloseTo(50, -1)
  })

  it('returns nothing when there is no gap to probe', () => {
    expect(probeAmountsBetween(10n, 10n)).toEqual([])
    expect(probeAmountsBetween(20n, 10n)).toEqual([])
    expect(probeAmountsBetween(1n, 2n)).toEqual([])
  })

  it('probes from one base unit when the entered amount parsed to zero', () => {
    const probes = probeAmountsBetween(0n, 10_000n)
    expect(probes.length).toBeGreaterThan(0)
    expect(probes[0] > 1n).toBe(true)
  })
})

describe('resolveServableMinDisplay', () => {
  const rangoPlaceholder = 1n
  const changellyReal = parseUnits('445.9768161', 18)
  const entered = parseUnits('0.07', 18)

  // A Rango-like provider: quotes (placeholder min) at or above its hidden floor,
  // nothing below it. Changelly always answers with its clamped real minimum.
  const providersWithFloor = (floor: bigint) => async (amount: string) => {
    const base = parseUnits(amount, 18)
    return base >= floor ? [changellyReal, rangoPlaceholder] : [changellyReal]
  }

  it('shows the lowest probe amount that actually received a quote', async () => {
    const probe = vi.fn(providersWithFloor(parseUnits('1', 18)))
    const display = await resolveServableMinDisplay(
      entered,
      [changellyReal],
      18,
      probe,
    )
    // Probes land near 0.63, 5.6 and 50 POL; the floor is 1 POL, so 5.6 is the
    // lowest servable one. Far below Changelly's 446.
    expect(probe).toHaveBeenCalledTimes(3)
    expect(Number(display)).toBeGreaterThan(1)
    expect(Number(display)).toBeLessThan(10)
    // Re-entering the shown value must clear the floor.
    expect(parseUnits(display, 18) >= parseUnits('1', 18)).toBe(true)
  })

  it('does not count a quote clamped up to a minimum above the probe amount', async () => {
    // Only Changelly answers, always with a minimum above every probe.
    const display = await resolveServableMinDisplay(
      entered,
      [changellyReal],
      18,
      async () => [changellyReal],
    )
    expect(display).toBe('445.98')
  })

  it('falls back to the smallest real declared minimum when every probe fails', async () => {
    const display = await resolveServableMinDisplay(
      entered,
      [rangoPlaceholder, changellyReal],
      18,
      async () => {
        throw new Error('network')
      },
    )
    expect(display).toBe('445.98')
  })

  it('tolerates one rejected probe and still uses the others', async () => {
    let calls = 0
    const probe = async (amount: string) => {
      if (calls++ === 0) throw new Error('flaky')
      return providersWithFloor(parseUnits('1', 18))(amount)
    }
    const display = await resolveServableMinDisplay(
      entered,
      [changellyReal],
      18,
      probe,
    )
    expect(Number(display)).toBeLessThan(446)
  })

  it('skips probing when no declared minimum is real', async () => {
    const probe = vi.fn(async () => [] as bigint[])
    const display = await resolveServableMinDisplay(0n, [1n], 18, probe)
    expect(probe).not.toHaveBeenCalled()
    expect(display).toBe('0.00000001')
  })
})

describe('output fiat floor', () => {
  // Rango, 0.007 POL -> ~0.00000027 ETH at $2,782: worth about $0.00075.
  const dustOut = parseUnits('0.00000027', 18)
  const ethPrice = 2782.41

  it('values the output in fiat using the to-token price', () => {
    const usd = outputUsd(dustOut, 18, ethPrice)
    expect(usd?.toNumber()).toBeCloseTo(0.00075, 4)
  })

  it('rejects dust output and accepts output worth the floor', () => {
    expect(meetsOutputFloor(dustOut, 18, ethPrice)).toBe(false)
    const oneDollarOfEth = parseUnits((MIN_OUTPUT_USD / ethPrice).toFixed(18), 18)
    expect(meetsOutputFloor(oneDollarOfEth, 18, ethPrice)).toBe(true)
  })

  it('never blocks a route when the price is unknown', () => {
    expect(outputUsd(dustOut, 18, undefined)).toBeNull()
    expect(meetsOutputFloor(dustOut, 18, 0)).toBe(true)
    expect(meetsOutputFloor(dustOut, 18, null)).toBe(true)
  })

  it('scales the quoted rate to the input needed for the floor, with margin', () => {
    const entered = parseUnits('0.007', 18)
    const usd = outputUsd(dustOut, 18, ethPrice)!
    const needed = inputForOutputFloor(entered, usd)!
    // 0.007 POL bought $0.00075, so $1 needs ~9.3 POL; +2% -> ~9.5 POL.
    expect(Number(needed) / 1e18).toBeCloseTo(9.5, 0)
    expect(needed > entered).toBe(true)
  })

  it('cannot scale a worthless or zero input', () => {
    expect(inputForOutputFloor(0n, outputUsd(dustOut, 18, ethPrice)!)).toBeNull()
    expect(inputForOutputFloor(parseUnits('1', 18), outputUsd(0n, 18, ethPrice)!)).toBeNull()
  })

  it('a synthesized floor minimum resolves like a declared one', async () => {
    // Only Rango answered (placeholder min) but under the floor; its scaled
    // input becomes the ceiling and, with no servable probe, the shown minimum.
    const entered = parseUnits('0.007', 18)
    const synthesized = inputForOutputFloor(entered, outputUsd(dustOut, 18, ethPrice)!)!
    const display = await resolveServableMinDisplay(
      entered,
      [1n, synthesized],
      18,
      async () => [], // probes below the floor are filtered out by the caller
    )
    expect(Number(display)).toBeCloseTo(9.5, 0)
    expect(parseUnits(display, 18) >= synthesized).toBe(true)
  })
})
