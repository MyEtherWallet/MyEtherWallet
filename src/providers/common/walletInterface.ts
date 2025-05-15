import { type TokenBalancesRaw } from '@/mew_api/types'
import type {
  GasFeeResponse,
  HexPrefixedString,
  WalletType,
} from '../types'
import {
  type PreEthereumTransaction,
  type EthereumSignableTransactionParams,
  type EthereumSignableTransactionResult,
  type PostSignedTransaction
} from '@/providers/ethereum/types'

export interface WalletInterface {
  connect?: () => Promise<boolean>
  disconnect: () => Promise<boolean>
  getSignableTransaction: (
    tx: EthereumSignableTransactionParams,
  ) => Promise<EthereumSignableTransactionResult>
  getGasFee: (tx: PreEthereumTransaction) => Promise<GasFeeResponse>
  SignTransaction?: (serializedTx: HexPrefixedString) => Promise<PostSignedTransaction>
  SendTransaction?: (serializedTx: HexPrefixedString) => Promise<HexPrefixedString> // Transaction hash
  SignMessage: (options: {
    message: `0x${string}`
    options: unknown
  }) => Promise<HexPrefixedString>
  getAddress: () => Promise<string>
  getWalletType: () => WalletType
  getProvider: () => string
  getBalance: () => Promise<TokenBalancesRaw[]>
  broadcastTransaction: (signedTx: HexPrefixedString) => Promise<string>
}
