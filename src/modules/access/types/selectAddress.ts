import type EvmTrezorWallet from "@/providers/ethereum/evmTrezorWallet"

export interface SelectAddress {
  address: string
  index: number
  balance: string
  walletInstance?: EvmTrezorWallet
}
