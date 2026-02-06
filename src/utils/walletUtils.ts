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
