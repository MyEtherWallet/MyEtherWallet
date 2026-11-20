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
 * Detects EIP-1193 code 4001 and common rejection message patterns. Some
 * wallets (Enkrypt's Bitcoin provider) reject with a bare string instead of an
 * error object (APP-MEW-WEB-1Z).
 */
export const isUserRejectionError = (error: unknown): boolean => {
  const err = error as { code?: number; message?: string }
  const message =
    (typeof error === 'string' ? error : err?.message)?.toLowerCase() ?? ''
  return (
    err?.code === 4001 ||
    message.includes('rejected') ||
    message.includes('denied') ||
    message.includes('cancelled') ||
    message.includes('canceled')
  )
}

export const isInsufficientFundsError = (error: unknown): boolean => {
  const message = (error as { message?: string })?.message?.toLowerCase() ?? ''
  return (
    message.includes('insufficient funds') ||
    message.includes('gas required exceeds allowance')
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
  if (isBlindSigningDisabledError(raw)) {
    return t('common.error.ledger_blind_signing')
  }
  // USB interface already claimed — Ledger Live, another tab, or a transport of
  // ours that was never released (WebUSB: "Unable to claim interface", or
  // "Access denied" from `USBDevice.open()`)
  if (
    message.includes('unable to claim interface') ||
    message.includes('claiminterface') ||
    message.includes('interface is in use') ||
    /usbdevice.*access denied/.test(message)
  ) {
    return t('common.error.ledger_interface_busy')
  }
  // Transient Trezor connect state (APP-MEW-WEB-P5)
  if (isTransientTrezorError(raw)) {
    return t('common.error.trezor_read_failed')
  }
  if (isDeviceInterfaceBusyError(raw)) {
    return t('common.error.ledger_device_busy')
  }
  return undefined
}

export const isBlindSigningDisabledError = (error: unknown): boolean => {
  const message = (
    error instanceof Error ? error.message : String(error ?? '')
  ).toLowerCase()
  return message.includes('blind signing') || message.includes('contract data')
}

/**
 * Map a known wallet rejection during connect (extension / wallet SDK, e.g.
 * Rabby, Coinbase, Enkrypt) to a localized message. These are expected
 * wallet-side conditions, not app bugs, so callers show the message and skip
 * Sentry.
 *
 * Returns `undefined` for unrecognized errors so callers keep the generic
 * message and report them.
 */
export const getLocalizedWalletConnectError = (
  error: unknown,
): string | undefined => {
  const rawMessage = (error as { message?: unknown } | null)?.message
  if (typeof rawMessage !== 'string') return undefined
  const message = rawMessage.toLowerCase()
  const { t } = i18n.global
  // Rabby: "Already processing unlock/connect. Please wait."
  if (message.includes('already processing')) {
    return t('access_wallet.toast.connect_request_pending')
  }
  // Enkrypt: "Enkrypt: Geo restricted https://www.myetherwallet.com/blocked"
  if (message.includes('geo restricted')) {
    return t('access_wallet.toast.wallet_region_restricted')
  }
  // Coinbase Wallet SDK
  if (message.includes('popup window was blocked')) {
    return t('access_wallet.toast.wallet_popup_blocked')
  }
  if (message.includes('user logged out')) {
    return t('access_wallet.toast.wallet_logged_out')
  }
  // "Open your wallet to finish updating it, then reconnect."
  if (message.includes('finish updating')) {
    return t('access_wallet.toast.wallet_update_pending')
  }
  return undefined
}

/**
 * Wallets reject with plain `{ code, message }` objects, which Sentry groups
 * under one generic "Object captured as exception" issue. Wrap them in an
 * `Error` so each wallet error gets its own issue.
 */
export const toReportableWalletError = (error: unknown): unknown => {
  if (error instanceof Error || !error || typeof error !== 'object') {
    return error
  }
  const { code, message } = error as { code?: unknown; message?: unknown }
  if (typeof message !== 'string') return error
  return new Error(code === undefined ? message : `${code}: ${message}`)
}

export const isDeviceInterfaceBusyError = (error: unknown): boolean => {
  const message = (
    error instanceof Error ? error.message : String(error ?? '')
  ).toLowerCase()
  return /claim\s*interface/.test(message)
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
