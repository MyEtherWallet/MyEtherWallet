import type { WalletInterface } from '@/providers/common/walletInterface'
import { WalletType } from '@/providers/types'

export const isHardWareWallet = (wallet: WalletInterface) => {
  const type = wallet.getWalletType()
  return type === WalletType.LEDGER || type === WalletType.TREZOR
}
