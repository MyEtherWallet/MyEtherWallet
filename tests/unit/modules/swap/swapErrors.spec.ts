import { describe, it, expect } from 'vitest'

import { isExpectedSwapQuoteError } from '@/modules/swap/swapErrors'

describe('isExpectedSwapQuoteError', () => {
  it('flags the on-chain revert seen in Sentry APP-MEW-WEB-EV', () => {
    expect(
      isExpectedSwapQuoteError(
        'Quote failed: execution reverted (InsufficientReturnAmount())',
      ),
    ).toBe(true)
  })

  it('flags any execution-reverted quote failure (case-insensitive)', () => {
    expect(isExpectedSwapQuoteError('Execution Reverted')).toBe(true)
  })

  it('flags insufficient-funds conditions', () => {
    expect(
      isExpectedSwapQuoteError('insufficient funds for intrinsic gas'),
    ).toBe(true)
  })

  it('does NOT flag a genuine error (still reported to Sentry)', () => {
    expect(isExpectedSwapQuoteError('Cannot read properties of undefined')).toBe(
      false,
    )
    expect(isExpectedSwapQuoteError('Network request failed')).toBe(false)
  })

  it('handles missing/empty messages', () => {
    expect(isExpectedSwapQuoteError()).toBe(false)
    expect(isExpectedSwapQuoteError('')).toBe(false)
  })
})
