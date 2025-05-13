import type {
  EthereumTransactionWithFeeType,
  NativeEthereumTransaction,
  PostEthereumTransaction,
} from '../ethereum/types'

export type HexPrefixedString = `0x${string}`

export enum ProviderName {
  Ethereum = 'ethereum',
}

export enum GasPriceType {
  ECONOMY = 'ECONOMY',
  REGULAR = 'REGULAR',
  FAST = 'FAST',
  FASTEST = 'FASTEST',
}

export interface GasFeeInfoType {
  nativeValue: HexPrefixedString
  fiatValue: string
  nativeSymbol: string
  fiatSymbol: string
}

export interface GasFeeType {
  [GasPriceType.ECONOMY]: GasFeeInfoType
  [GasPriceType.REGULAR]: GasFeeInfoType
  [GasPriceType.FAST]: GasFeeInfoType
  [GasPriceType.FASTEST]: GasFeeInfoType
}

export type PreTransaction = EthereumTransactionWithFeeType

export type PostTransaction = PostEthereumTransaction

export interface GasFeeResponse {
  transactionId: string
  fees: GasFeeType
}
export interface PreTransactionResponse {
  id: string
  serialized: HexPrefixedString
}

export interface PostTransactionResponse {
  id: string
  transaction: NativeEthereumTransaction
  signed: HexPrefixedString
}

export enum WalletType {
  PRIVATE_KEY = 'PRIVATE_KEY',
  MNEMONIC = 'MNEMONIC',
  WAGMI = 'WAGMI',
}

export interface BalanceResponse {
  nativeValue: HexPrefixedString
  fiatValue: string
  nativeSymbol: string
  fiatSymbol: string
}

interface ProviderError {
  message: string
  code: number
  data?: unknown
}

export interface EthereumRequest {
  method: string
  params?: Array<unknown>
}

export interface EthereumResponse {
  result?: unknown
  error?: ProviderError
}

export interface EthereumProvider {
  request: (request: EthereumRequest) => Promise<EthereumResponse>
}
