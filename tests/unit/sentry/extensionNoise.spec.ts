import { describe, it, expect } from 'vitest'
import { isExtensionOrProviderError } from '@/sentry/extensionNoise'

describe('isExtensionOrProviderError', () => {
  it('is true for the EIP-1193 4900 "disconnected" rejection from an extension', () => {
    // The exact production payload (serialized plain object, no parsed frames).
    expect(
      isExtensionOrProviderError({
        code: 4900,
        message: 'The provider is disconnected from all chains.',
        stack:
          'Error: The provider is disconnected from all chains.\n    at s (chrome-extension://acmacodkjbdgmoleebolmdjonilkdbch/background.js:2:7674223)',
      }),
    ).toBe(true)
  })

  it('is true for benign EIP-1193 provider codes regardless of stack', () => {
    expect(isExtensionOrProviderError({ code: 4001 })).toBe(true) // user rejected
    expect(isExtensionOrProviderError({ code: 4901 })).toBe(true) // chain disconnected
    expect(isExtensionOrProviderError({ code: -32002 })).toBe(true) // request pending
  })

  it('is true when the stack points at any browser extension scheme', () => {
    expect(
      isExtensionOrProviderError({
        // no benign code → forces the chrome-extension stack branch
        message: 'boom',
        stack: 'Error\n    at s (chrome-extension://abc/background.js:1:1)',
      }),
    ).toBe(true)
    expect(
      isExtensionOrProviderError({
        message: 'boom',
        stack: 'Error\n    at moz-extension://abc/background.js:1:1',
      }),
    ).toBe(true)
    expect(
      isExtensionOrProviderError({
        message: 'boom',
        stack: 'Error\n    at safari-web-extension://abc/x.js:1:1',
      }),
    ).toBe(true)
  })

  it('is false for a genuine app error (no extension stack, non-provider code)', () => {
    expect(
      isExtensionOrProviderError({
        message: "Cannot read properties of undefined (reading 'x')",
        stack:
          'TypeError: ...\n    at https://app.myetherwallet.com/assets/index-abc.js:1:1',
      }),
    ).toBe(false)
  })

  it('is false for non-benign provider-looking codes (e.g. -32603 internal)', () => {
    expect(isExtensionOrProviderError({ code: -32603, message: 'Internal' })).toBe(
      false,
    )
  })

  it('is false for non-object inputs', () => {
    expect(isExtensionOrProviderError(null)).toBe(false)
    expect(isExtensionOrProviderError(undefined)).toBe(false)
    expect(isExtensionOrProviderError('chrome-extension://x')).toBe(false)
    expect(isExtensionOrProviderError(new Error('plain'))).toBe(false)
  })
})
