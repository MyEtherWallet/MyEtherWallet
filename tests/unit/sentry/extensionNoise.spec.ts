import { describe, it, expect } from 'vitest'
import { InvalidAddressError } from 'viem'
import {
  isExtensionOrProviderError,
  isInvalidWalletAddressError,
  isRainbowKitNotFoundError,
} from '@/sentry/extensionNoise'

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

describe('isInvalidWalletAddressError', () => {
  it('is true for a real viem InvalidAddressError instance', () => {
    // The exact production trigger: a wallet returns a malformed account
    // address from eth_requestAccounts and viem's getAddress throws.
    const err = new InvalidAddressError({
      address: '87ee29ce5319f07638605abc5f053e40d4e1b1d94e',
    })
    expect(isInvalidWalletAddressError(err)).toBe(true)
  })

  it('is true for the serialized production payload (plain object with name)', () => {
    // Sentry hands beforeSend the original exception, but be robust to a
    // serialized plain object carrying only the viem error name.
    expect(
      isInvalidWalletAddressError({
        name: 'InvalidAddressError',
        message: 'Address "87ee29ce…94e" is invalid.',
      }),
    ).toBe(true)
  })

  it('is false for a genuine app error', () => {
    expect(
      isInvalidWalletAddressError(
        new TypeError("Cannot read properties of undefined (reading 'x')"),
      ),
    ).toBe(false)
    expect(isInvalidWalletAddressError(new Error('boom'))).toBe(false)
    expect(
      isInvalidWalletAddressError({ name: 'SomeOtherError', message: 'x' }),
    ).toBe(false)
  })

  it('is false for non-object inputs', () => {
    expect(isInvalidWalletAddressError(null)).toBe(false)
    expect(isInvalidWalletAddressError(undefined)).toBe(false)
    expect(isInvalidWalletAddressError('InvalidAddressError')).toBe(false)
  })
})

describe('isRainbowKitNotFoundError', () => {
  it('is true for the Error-object rejection from the injected script', () => {
    expect(isRainbowKitNotFoundError(new Error('not found rainbowkit'))).toBe(
      true,
    )
    expect(
      isRainbowKitNotFoundError({ message: 'not found rainbowkit' }),
    ).toBe(true)
  })

  it('is true for a bare-string rejection', () => {
    expect(isRainbowKitNotFoundError('not found rainbowkit')).toBe(true)
    // Some handlers prefix the Error name onto the serialized value.
    expect(isRainbowKitNotFoundError('Error: not found rainbowkit')).toBe(true)
  })

  it('is false for our bundled rainbowkit "Connector not found" error', () => {
    expect(isRainbowKitNotFoundError(new Error('Connector not found'))).toBe(
      false,
    )
  })

  it('is false for genuine app errors and non-matching inputs', () => {
    expect(
      isRainbowKitNotFoundError(
        new TypeError("Cannot read properties of undefined (reading 'x')"),
      ),
    ).toBe(false)
    expect(isRainbowKitNotFoundError(null)).toBe(false)
    expect(isRainbowKitNotFoundError(undefined)).toBe(false)
    expect(isRainbowKitNotFoundError({ message: 42 })).toBe(false)
    expect(isRainbowKitNotFoundError('something else')).toBe(false)
  })
})
