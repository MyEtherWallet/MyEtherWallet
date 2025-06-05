import type EvmTrezorWallet from "@/providers/ethereum/evmHardwareWallet"

export interface SelectAddress {
  address: string
  index: number
  balance: string
  walletInstance?: EvmTrezorWallet
}
