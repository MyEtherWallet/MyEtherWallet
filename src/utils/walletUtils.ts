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
