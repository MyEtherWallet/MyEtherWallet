import type {
  BalanceResponse,
  NonceResponse,
  GasFeeResponse,
  HexPrefixedString,
  PostTransaction,
  PostTransactionResponse,
  PreTransaction,
  PreTransactionResponse,
  ProviderName,
  WalletType,
} from '../types'
import { type PreEthereumTransaction } from '@/providers/ethereum/types'

export interface WalletInterface {
  connect: () => Promise<boolean>
  disconnect: () => Promise<boolean>
  getSignableTransaction: (
    tx: PreTransaction,
  ) => Promise<PreTransactionResponse>
  getGasFee: (tx: PreEthereumTransaction) => Promise<GasFeeResponse>
  SignTransaction: (tx: PostTransaction) => Promise<PostTransactionResponse>
  SignMessage: (options: {
    message: `0x${string}`
    options: unknown
  }) => Promise<HexPrefixedString>
  getAddress: () => string
  getWalletType: () => WalletType
  getProvider: () => ProviderName
  getBalance: () => Promise<BalanceResponse>
  getNonce: () => Promise<NonceResponse>
}
