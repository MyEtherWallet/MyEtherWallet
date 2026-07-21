import { describe, it, expect, beforeEach } from 'vitest'
import i18n from '@/i18n'
import { getLocalizedWalletError } from '@/utils/walletUtils'

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
})
