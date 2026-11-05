import { describe, it, expect, vi } from 'vitest'

vi.mock('@/i18n', () => ({
  default: {
    global: {
      t: (key: string, params?: Record<string, string>) =>
        params ? `${key}:${JSON.stringify(params)}` : key,
    },
  },
}))

import {
  getLocalizedSwapQuoteError,
  isExpectedSwapQuoteError,
} from '@/modules/swap/swapErrors'

// Raw BSC node error as surfaced by the MEW API multi-quotes endpoint.
const RAW_INSUFFICIENT_FUNDS =
  'Quote failed: failed with 16777216 gas: insufficient funds for gas * price + value: address 0x987Bdf5498F2B2E643D435a37bCA3430beff8507 have 731751886664816 want 30000000000000000'

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
    expect(isExpectedSwapQuoteError(RAW_INSUFFICIENT_FUNDS)).toBe(true)
  })

  it('does NOT flag a genuine error (still reported to Sentry)', () => {
    expect(
      isExpectedSwapQuoteError('Cannot read properties of undefined'),
    ).toBe(false)
    expect(isExpectedSwapQuoteError('Network request failed')).toBe(false)
  })

  it('handles missing/empty messages', () => {
    expect(isExpectedSwapQuoteError()).toBe(false)
    expect(isExpectedSwapQuoteError('')).toBe(false)
  })
})

describe('getLocalizedSwapQuoteError', () => {
  it('maps insufficient funds for gas to the network-fee message', () => {
    expect(getLocalizedSwapQuoteError(RAW_INSUFFICIENT_FUNDS, 'BNB')).toBe(
      'swap.error.insufficient-balance-for-fees:{"symbol":"BNB"}',
    )
  })

  it('maps "gas required exceeds allowance" to the network-fee message', () => {
    expect(
      getLocalizedSwapQuoteError(
        'gas required exceeds allowance (21000)',
        'ETH',
      ),
    ).toBe('swap.error.insufficient-balance-for-fees:{"symbol":"ETH"}')
  })

  it('does not interpolate "undefined" when the symbol is unknown', () => {
    expect(getLocalizedSwapQuoteError(RAW_INSUFFICIENT_FUNDS, undefined)).toBe(
      'swap.error.insufficient-balance-for-fees:{"symbol":""}',
    )
  })

  it('maps execution reverts to pair-not-available', () => {
    expect(
      getLocalizedSwapQuoteError(
        'Quote failed: execution reverted (InsufficientReturnAmount())',
        'ETH',
      ),
    ).toBe('swap.error.pair-not-available')
  })

  it('maps any other "Quote failed" simulation error to the generic message', () => {
    expect(
      getLocalizedSwapQuoteError(
        'Quote failed: failed with 5000000 gas: out of gas',
        'ETH',
      ),
    ).toBe('swap.error.quote-failed')
  })

  it('returns undefined for unrecognized or empty messages', () => {
    expect(getLocalizedSwapQuoteError('Fetch failed', 'ETH')).toBeUndefined()
    expect(getLocalizedSwapQuoteError('', 'ETH')).toBeUndefined()
    expect(getLocalizedSwapQuoteError(undefined, 'ETH')).toBeUndefined()
  })
})
