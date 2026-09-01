import { describe, it, expect } from 'vitest'
import { isTransientSwapInitError } from '@/utils/swapInitError'

describe('isTransientSwapInitError', () => {
  it('is true for a JSON-parse SyntaxError (SDK parsed a non-JSON upstream body)', () => {
    // The exact production case: JSON.parse("400: Invalid request")
    expect(
      isTransientSwapInitError(
        new SyntaxError(
          'Unexpected non-whitespace character after JSON at position 3',
        ),
      ),
    ).toBe(true)
    // Firefox / Safari phrasings also mention "JSON"
    expect(
      isTransientSwapInitError(
        new SyntaxError('JSON.parse: unexpected character at line 1 column 1'),
      ),
    ).toBe(true)
  })

  it('is false for a SyntaxError unrelated to JSON parsing', () => {
    expect(
      isTransientSwapInitError(new SyntaxError('Unexpected token <')),
    ).toBe(false)
  })

  it('is true for network errors (various phrasings)', () => {
    expect(isTransientSwapInitError(new Error('Network Error'))).toBe(true)
    expect(isTransientSwapInitError(new TypeError('Failed to fetch'))).toBe(
      true,
    )
    expect(isTransientSwapInitError(new Error('fetch failed'))).toBe(true)
    expect(isTransientSwapInitError(new Error('Request timeout'))).toBe(true)
    expect(isTransientSwapInitError(new Error('Load failed'))).toBe(true)
  })

  it('is false for a genuine, unexpected error', () => {
    expect(
      isTransientSwapInitError(
        new TypeError("Cannot read properties of undefined (reading 'all')"),
      ),
    ).toBe(false)
  })

  // A bare `includes('network')` matched this, so a real application bug was
  // retried and then suppressed from Sentry as expected noise.
  it('is false for a property-access TypeError that merely mentions network', () => {
    expect(
      isTransientSwapInitError(
        new TypeError("Cannot read properties of undefined (reading 'network')"),
      ),
    ).toBe(false)
    expect(
      isTransientSwapInitError(new TypeError('networkInfo is not a function')),
    ).toBe(false)
  })

  it('is false for non-Error values', () => {
    expect(isTransientSwapInitError('boom')).toBe(false)
    expect(isTransientSwapInitError(null)).toBe(false)
    expect(isTransientSwapInitError(undefined)).toBe(false)
  })
})
