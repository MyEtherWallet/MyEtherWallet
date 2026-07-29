import { describe, it, expect } from 'vitest'
import { InvalidAddressError } from 'viem'
import {
  isExtensionOrProviderError,
  isInvalidWalletAddressError,
  isTrezorHandshakeError,
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

describe('isTrezorHandshakeError', () => {
  it('is true for the Trezor Connect "handshake failed" Error', () => {
    // The exact production trigger: the Trezor Connect popup/iframe fails to
    // handshake with connect.trezor.io and @trezor/connect throws a plain Error.
    expect(isTrezorHandshakeError(new Error('handshake failed'))).toBe(true)
  })

  it('is true for the serialized production payload (plain object with message)', () => {
    expect(isTrezorHandshakeError({ message: 'handshake failed' })).toBe(true)
  })

  it('matches regardless of surrounding text / casing', () => {
    expect(
      isTrezorHandshakeError(new Error('TrezorConnect: Handshake failed')),
    ).toBe(true)
  })

  it('is false for a genuine app error', () => {
    expect(
      isTrezorHandshakeError(
        new TypeError("Cannot read properties of undefined (reading 'x')"),
      ),
    ).toBe(false)
    expect(isTrezorHandshakeError(new Error('popup failed to open'))).toBe(false)
  })

  it('is false for non-object inputs', () => {
    expect(isTrezorHandshakeError(null)).toBe(false)
    expect(isTrezorHandshakeError(undefined)).toBe(false)
    expect(isTrezorHandshakeError('handshake failed')).toBe(false)
  })
})
