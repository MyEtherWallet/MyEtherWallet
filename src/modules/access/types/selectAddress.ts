import type EvmTrezorWallet from '@/providers/ethereum/evmHardwareWallet'
import type BitcoinHardwareWallet from '@/providers/bitcoin/btcHardwareWallet'

export interface SelectAddress {
  address: string
  index: number
  balance: string
  walletInstance?: EvmTrezorWallet | BitcoinHardwareWallet
}
