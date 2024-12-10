import type {
  BalanceResponse,
  HexPrefixedString,
  PostTransaction,
  PostTransactionResponse,
  PreTransaction,
  PreTransactionResponse,
  ProviderName,
  WalletType,
} from '../types'

export interface WalletInterface {
  connect: () => Promise<boolean>
  disconnect: () => Promise<boolean>
  getSignableTransaction: (
    tx: PreTransaction,
  ) => Promise<PreTransactionResponse>
  SignTransaction: (tx: PostTransaction) => Promise<PostTransactionResponse>
  SignMessage: (options: {
    message: `0x${string}`
    options: unknown
  }) => Promise<HexPrefixedString>
  getAddress: () => string
  getWalletType: () => WalletType
  getProvider: () => ProviderName
  getBalance: () => Promise<BalanceResponse>
}
