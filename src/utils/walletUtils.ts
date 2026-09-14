import type { WalletInterface } from '@/providers/common/walletInterface'
import { WalletType } from '@/providers/types'
import i18n from '@/i18n'

export const isSignableWallet = (wallet: WalletInterface) => {
  const type = wallet.getWalletType()
  return (
    type === WalletType.LEDGER ||
    type === WalletType.TREZOR ||
    type === WalletType.PRIVATE_KEY ||
    type === WalletType.MNEMONIC
  )
}

/**
 * Whether the current browser can safely initiate a Trezor connection.
 *
 * `@enkryptcom/hw-wallets` `getTrezorConnect` references the bare `chrome`
 * global (`if (chrome && chrome.runtime && ...)`). On non-Chromium browsers
 * such as iOS Safari the `chrome` global does not exist, so that reference
 * throws `ReferenceError: Can't find variable: chrome` before it can fall back
 * to `@trezor/connect-web`. Gate the Trezor connect entry point on this
 * capability so unsupported browsers fail gracefully with a friendly message
 * instead of an uncaught ReferenceError. See MEW-2041.
 */
export const isTrezorSupported = (): boolean =>
  typeof (globalThis as { chrome?: unknown }).chrome !== 'undefined'

/**
 * Checks if an error is a user rejection (e.g. user cancelled transaction in wallet).
 * Detects EIP-1193 code 4001 and common rejection message patterns.
 */
export const isUserRejectionError = (error: unknown): boolean => {
  const err = error as { code?: number; message?: string }
  const message = err?.message?.toLowerCase() ?? ''
  return (
    err?.code === 4001 ||
    message.includes('rejected') ||
    message.includes('denied') ||
    message.includes('cancelled') ||
    message.includes('canceled')
  )
}

/**
 * Map a raw hardware-wallet (Ledger) error message to a friendly, localized
 * string. Hardware SDKs surface low-level messages such as
 * `ledger device: locked device (0x5515)` that get shown verbatim in toasts;
 * this translates the common, user-actionable ones.
 *
 * Returns `undefined` for unrecognized errors so callers can fall back to the
 * raw message.
 */
export const getLocalizedWalletError = (
  raw?: string | null,
): string | undefined => {
  if (!raw) return undefined
  const message = raw.toLowerCase()
  const { t } = i18n.global
  // User rejected / denied the action on the device
  if (message.includes('0x6985') || message.includes('denied by the user')) {
    return t('common.error.user_canceled_request')
  }
  // Ledger device is locked (APDU status 0x5515)
  if (message.includes('0x5515') || message.includes('locked device')) {
    return t('common.error.ledger_locked')
  }
  // Ethereum app not open / wrong app on the Ledger (0x6511, 0x6e00, 0x6e01)
  if (
    message.includes('0x6511') ||
    message.includes('0x6e00') ||
    message.includes('0x6e01') ||
    message.includes('cla_not_supported')
  ) {
    return t('common.error.ledger_app_not_open')
  }
  // Transient Trezor connect state (APP-MEW-WEB-P5)
  if (isTransientTrezorError(raw)) {
    return t('common.error.trezor_read_failed')
  }
  return undefined
}

/**
 * A transient Trezor Connect failure: the popup/iframe returned `success`
 * with an empty payload, so `@enkryptcom/hw-wallets` runs an unguarded
 * conversion on the missing field and throws a cryptic TypeError (or "popup
 * failed to open"). Retrying usually succeeds, so this is safe to surface as a
 * friendly "reconnect" message rather than reporting it as noise.
 *
 * Known empty-payload shapes:
 *  - signMessage:     `Buffer.from(undefined)` → "The first argument must be
 *    one of type string, Buffer, ..." (MEW-2080).
 *  - signTransaction: `BigInt(result.payload.v)` where `v` is undefined →
 *    "Cannot convert undefined to a BigInt" (APP-MEW-WEB-56 / MEW-2198).
 */
export const isTransientTrezorError = (error: unknown): boolean => {
  const message = (
    error instanceof Error ? error.message : String(error ?? '')
  ).toLowerCase()
  return (
    message.includes('popup failed to open') ||
    message.includes('the first argument must be one of type string, buffer') ||
    message.includes('cannot convert undefined to a bigint')
  )
}
