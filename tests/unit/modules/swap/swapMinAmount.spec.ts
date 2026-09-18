import { describe, it, expect, vi } from 'vitest'
import { parseUnits, formatUnits } from 'viem'

import {
  smallestMinFromDisplay,
  resolveMinFromDisplay,
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
})

describe('resolveMinFromDisplay', () => {
  it('lowers the shown min when the re-query surfaces a cheaper provider (POL, 18dp)', async () => {
    // Sub-minimum request only returned an expensive bridge (400 POL); a cheaper
    // provider (5 POL) returned null and was dropped by the aggregator (MEW-2293).
    const expensiveMin = parseUnits('400', 18)
    const cheaperMin = parseUnits('5', 18)
    // Re-query at 400 POL lets the cheaper provider quote and report its true min.
    const probe = vi.fn().mockResolvedValue([cheaperMin, expensiveMin])

    const display = await resolveMinFromDisplay([expensiveMin], 18, probe)

    expect(probe).toHaveBeenCalledWith(formatUnits(expensiveMin, 18))
    expect(display).toBe('5')
  })

  it('keeps the first-set min when the re-query adds nothing', async () => {
    const min = parseUnits('400', 18)
    const probe = vi.fn().mockResolvedValue([])
    expect(await resolveMinFromDisplay([min], 18, probe)).toBe('400')
  })

  it('falls back to the first-set min when the re-query throws', async () => {
    const min = parseUnits('400', 18)
    const probe = vi.fn().mockRejectedValue(new Error('network'))
    expect(await resolveMinFromDisplay([min], 18, probe)).toBe('400')
  })

  it('never raises the shown min even if the re-query only returns higher mins', async () => {
    const min = parseUnits('400', 18)
    const probe = vi.fn().mockResolvedValue([parseUnits('900', 18)])
    expect(await resolveMinFromDisplay([min], 18, probe)).toBe('400')
  })

  it('returns "0" when there are no initial minimums', async () => {
    const probe = vi.fn()
    expect(await resolveMinFromDisplay([], 18, probe)).toBe('0')
    expect(probe).not.toHaveBeenCalled()
  })
})
