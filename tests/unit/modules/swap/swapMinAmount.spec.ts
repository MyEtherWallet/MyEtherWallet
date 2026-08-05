import { describe, it, expect } from 'vitest'

import { smallestMinFromDisplay } from '@/modules/swap/swapMinAmount'

describe('smallestMinFromDisplay', () => {
  it('formats a single provider minimum in the token decimals (PYUSD, 6dp)', () => {
    // Changelly minimumFrom for PYUSD->ETH = 50.013709 PYUSD in base units (MEW-2109)
    expect(smallestMinFromDisplay([50013709n], 6)).toBe('50.01')
  })

  it('picks the smallest minimum across providers', () => {
    expect(smallestMinFromDisplay([60000000n, 50013709n], 6)).toBe('50.01')
  })

  it('handles 18-decimal tokens', () => {
    expect(smallestMinFromDisplay([1500000000000000000n], 18)).toBe('1.5')
  })

  it('returns "0" when there are no minimums', () => {
    expect(smallestMinFromDisplay([], 6)).toBe('0')
  })
})
