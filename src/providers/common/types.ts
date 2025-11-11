import type { GasPriceType, HexPrefixedString } from '../types'
import { FeeMarketEIP1559Transaction, LegacyTransaction } from '@ethereumjs/tx'
import type { QuotesRequestBody, FeePriority } from '@/mew_api/types'
export type NativeEthereumTransaction =
  | LegacyTransaction
  | FeeMarketEIP1559Transaction

export enum SupportedTXType {
  LEGACY = '0x0',
  EIP1559 = '0x2',
}

export interface APIRequest {
  id: string
  chainId: HexPrefixedString
}

export interface SignableTransactionParams {
  priority: FeePriority
  quoteId: string
}
export interface PostSignedTransaction {
  signed: HexPrefixedString
}

export interface PostEthereumTransaction extends QuotesRequestBody, APIRequest {
  gasPriceType: GasPriceType
  gasPrice?: HexPrefixedString
  gasLimit: HexPrefixedString
  maxPriorityFeePerGas: HexPrefixedString
  maxFeePerGas: HexPrefixedString
  nonce: HexPrefixedString
  type: HexPrefixedString
}
