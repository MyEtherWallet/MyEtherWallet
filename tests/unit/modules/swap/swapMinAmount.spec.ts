import { describe, it, expect } from 'vitest'
import { parseUnits } from 'viem'

import { smallestMinFromDisplay } from '@/modules/swap/swapMinAmount'

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
