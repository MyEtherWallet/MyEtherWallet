import type { WalletInterface } from '@/providers/common/walletInterface'
import { WalletType } from '@/providers/types'

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
