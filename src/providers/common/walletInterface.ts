import type {
  BalanceResponse,
  GasFeeResponse,
  HexPrefixedString,
  ProviderName,
  WalletType,
} from '../types'
import {
  type PreEthereumTransaction,
  type EthereumSignableTransactionParams,
  type EthereumSignableTransactionResult,
  type PostSignedTransaction
} from '@/providers/ethereum/types'

export interface WalletInterface {
  connect: () => Promise<boolean>
  disconnect: () => Promise<boolean>
  getSignableTransaction: (
    tx: EthereumSignableTransactionParams,
  ) => Promise<EthereumSignableTransactionResult>
  getGasFee: (tx: PreEthereumTransaction) => Promise<GasFeeResponse>
  SignTransaction: (serializedTx: HexPrefixedString) => Promise<PostSignedTransaction>
  SignMessage: (options: {
    message: `0x${string}`
    options: unknown
  }) => Promise<HexPrefixedString>
  getAddress: () => string
  getWalletType: () => WalletType
  getProvider: () => ProviderName
  getBalance: () => Promise<BalanceResponse>
}
