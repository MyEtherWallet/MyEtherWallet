import { describe, it, expect, beforeEach } from 'vitest'
import i18n from '@/i18n'
import {
  getLocalizedWalletConnectError,
  getLocalizedWalletError,
  isTransientTrezorError,
  toReportableWalletError,
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

  it('maps a claimed USB interface (Ledger Live / another tab / unreleased transport) to a localized message', () => {
    expect(
      getLocalizedWalletError(
        "Failed to execute 'claimInterface' on 'USBDevice': Unable to claim interface.",
      ),
    ).toBe(
      'Another app or browser tab (e.g. Ledger Live) is using your Ledger. Close it, reconnect the device, and try again.',
    )
    expect(
      getLocalizedWalletError(
        'Ledger is in use by another application or browser tab (Unable to claim interface)',
      ),
    ).toBe(
      'Another app or browser tab (e.g. Ledger Live) is using your Ledger. Close it, reconnect the device, and try again.',
    )
  })

  it('maps the device picker listen timeout to a localized message', () => {
    expect(getLocalizedWalletError('No Ledger device found (timeout)')).toBe(
      'No Ledger was detected. Connect and unlock your device, then try again.',
    )
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

/**
 * APP-MEW-WEB-1R4 — wallet rejections during connect are expected conditions,
 * not app bugs: they are shown localized and kept out of Sentry.
 */
describe('getLocalizedWalletConnectError (APP-MEW-WEB-1R4)', () => {
  beforeEach(() => {
    i18n.global.locale.value = 'en'
  })

  it('maps known wallet rejections to localized messages', () => {
    const cases: [unknown, string][] = [
      [
        { code: -32001, message: 'Already processing unlock. Please wait.' },
        'Request to connect already pending, please check your wallet extension',
      ],
      [
        { code: -32001, message: 'Already processing connect. Please wait.' },
        'Request to connect already pending, please check your wallet extension',
      ],
      [
        {
          code: 8546,
          message:
            'Enkrypt: Geo restricted https://www.myetherwallet.com/blocked',
        },
        "This wallet isn't available in your region.",
      ],
      [
        { code: -32603, message: 'Popup window was blocked' },
        'Your browser blocked the wallet popup. Allow popups for this site and try again.',
      ],
      [
        { code: 4100, message: 'User logged out.' },
        "You're signed out of your wallet. Sign in and try again.",
      ],
      [
        {
          code: -32603,
          message: 'Open your wallet to finish updating it, then reconnect.',
        },
        'Your wallet needs to finish updating. Open it, complete the update, and try again.',
      ],
    ]
    for (const [walletError, expected] of cases) {
      expect(getLocalizedWalletConnectError(walletError)).toBe(expected)
    }
  })

  it('localizes to the active locale', () => {
    i18n.global.locale.value = 'es'
    expect(
      getLocalizedWalletConnectError({
        code: 4100,
        message: 'User logged out.',
      }),
    ).toBe(
      'Cerraste sesión en tu billetera. Inicia sesión e inténtalo de nuevo.',
    )
  })

  it('returns undefined for unrecognized errors so they are still reported', () => {
    expect(
      getLocalizedWalletConnectError({
        code: -32603,
        message: 'Internal error',
      }),
    ).toBeUndefined()
    expect(getLocalizedWalletConnectError(new Error('boom'))).toBeUndefined()
    expect(getLocalizedWalletConnectError('some string')).toBeUndefined()
    expect(getLocalizedWalletConnectError(null)).toBeUndefined()
    expect(getLocalizedWalletConnectError(undefined)).toBeUndefined()
  })
})

describe('toReportableWalletError', () => {
  it('wraps a plain { code, message } rejection in an Error', () => {
    const reportable = toReportableWalletError({
      code: -32603,
      message: 'Internal error',
    })
    expect(reportable).toBeInstanceOf(Error)
    expect((reportable as Error).message).toBe('-32603: Internal error')
  })

  it('uses the message alone when there is no code', () => {
    const reportable = toReportableWalletError({ message: 'Something failed' })
    expect((reportable as Error).message).toBe('Something failed')
  })

  it('returns Errors and non-objects untouched', () => {
    const error = new Error('boom')
    expect(toReportableWalletError(error)).toBe(error)
    expect(toReportableWalletError('raw string')).toBe('raw string')
    expect(toReportableWalletError(null)).toBeNull()
    const noMessage = { code: 1 }
    expect(toReportableWalletError(noMessage)).toBe(noMessage)
  })
})
