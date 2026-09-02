import { describe, it, expect, beforeEach } from 'vitest'
import i18n from '@/i18n'
import {
  getLocalizedWalletError,
  isTransientTrezorError,
} from '@/utils/walletUtils'

/**
 * MEW-2049 — hardware-wallet (Ledger) errors must be shown localized.
 *
 * The raw SDK message `ledger device: locked device (0x5515)` was surfaced
 * verbatim in the "transaction failed to send" toast; this maps the common,
 * user-actionable hardware errors to localized strings.
 */
describe('getLocalizedWalletError (MEW-2049)', () => {
  beforeEach(() => {
    i18n.global.locale.value = 'en'
  })

  it('maps a locked Ledger (the ticket case) to a localized message', () => {
    expect(
      getLocalizedWalletError('Ledger device: Locked device (0x5515)'),
    ).toBe('Your Ledger is locked. Unlock it and try again.')
    // by status word alone
    expect(getLocalizedWalletError('0x5515')).toBe(
      'Your Ledger is locked. Unlock it and try again.',
    )
  })

  it('maps app-not-open status words to a localized message', () => {
    for (const code of ['0x6511', '0x6e00', '0x6e01', 'CLA_NOT_SUPPORTED']) {
      expect(getLocalizedWalletError(`ledger error ${code}`)).toBe(
        'Open the Ethereum app on your Ledger and try again.',
      )
    }
  })

  it('maps on-device rejection to the shared cancel message', () => {
    expect(getLocalizedWalletError('Ledger device: 0x6985')).toBe(
      'User canceled the request',
    )
    expect(getLocalizedWalletError('Action denied by the user')).toBe(
      'User canceled the request',
    )
  })

  it('localizes into the active locale', () => {
    i18n.global.locale.value = 'es'
    expect(
      getLocalizedWalletError('ledger device: locked device (0x5515)'),
    ).toBe('Tu Ledger está bloqueado. Desbloquéalo e inténtalo de nuevo.')
    i18n.global.locale.value = 'zh'
    expect(
      getLocalizedWalletError('ledger device: locked device (0x5515)'),
    ).toBe('您的 Ledger 已锁定。请解锁后重试。')
  })

  it('returns undefined for unrecognized / empty errors (raw fallback)', () => {
    expect(getLocalizedWalletError('some unrelated rpc error')).toBeUndefined()
    expect(getLocalizedWalletError('')).toBeUndefined()
    expect(getLocalizedWalletError(undefined)).toBeUndefined()
    expect(getLocalizedWalletError(null)).toBeUndefined()
  })

  // APP-MEW-WEB-P5 (MEW-2080) — transient Trezor connect state:
  // @enkryptcom/hw-wallets does an unguarded Buffer.from(undefined) when
  // Trezor Connect returns success with an empty payload.
  it('maps the transient Trezor Buffer/popup errors to a localized message', () => {
    const friendly =
      "Couldn't read your address from Trezor. Reconnect the device and try again."
    expect(
      getLocalizedWalletError(
        'The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type undefined',
      ),
    ).toBe(friendly)
    expect(getLocalizedWalletError('popup failed to open')).toBe(friendly)
  })

  // APP-MEW-WEB-56 (MEW-2198) — signTransaction sibling of the Buffer.from
  // case: @enkryptcom/hw-wallets does an unguarded BigInt(result.payload.v)
  // when Trezor Connect returns success with an empty payload (v undefined).
  it('maps the transient Trezor BigInt signing error to a localized message', () => {
    const friendly =
      "Couldn't read your address from Trezor. Reconnect the device and try again."
    expect(
      getLocalizedWalletError('Cannot convert undefined to a BigInt'),
    ).toBe(friendly)
  })
})

describe('isTransientTrezorError (MEW-2080)', () => {
  it('flags the transient Trezor connect failures', () => {
    expect(
      isTransientTrezorError(
        new TypeError(
          'The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type undefined',
        ),
      ),
    ).toBe(true)
    expect(isTransientTrezorError(new Error('popup failed to open'))).toBe(true)
    expect(isTransientTrezorError('popup failed to open')).toBe(true)
    // APP-MEW-WEB-56 (MEW-2198) — signTransaction empty-payload TypeError
    expect(
      isTransientTrezorError(
        new TypeError('Cannot convert undefined to a BigInt'),
      ),
    ).toBe(true)
  })

  it('does not flag unrelated errors', () => {
    expect(isTransientTrezorError(new Error('Ledger locked 0x5515'))).toBe(
      false,
    )
    expect(isTransientTrezorError('some unrelated rpc error')).toBe(false)
    expect(isTransientTrezorError(undefined)).toBe(false)
    expect(isTransientTrezorError(null)).toBe(false)
  })
})
