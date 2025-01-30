import type { GasPriceType, HexPrefixedString } from '../types'
import { FeeMarketEIP1559Transaction, LegacyTransaction } from '@ethereumjs/tx'

export type NativeEthereumTransaction =
  | LegacyTransaction
  | FeeMarketEIP1559Transaction

export enum SupportedTXType {
  LEGACY = '0x0',
  EIP1559 = '0x2',
}

export interface APIRequest {
  id: string
  network: string
}

export interface PreEthereumTransaction extends APIRequest {
  to: HexPrefixedString
  from: HexPrefixedString
  value: HexPrefixedString
  data: HexPrefixedString
  chainId: HexPrefixedString
}

export interface EthereumTransactionWithFeeType extends PreEthereumTransaction {
  gasFee: GasPriceType
}

export interface PostEthereumTransaction extends PreEthereumTransaction {
  gasPriceType: GasPriceType
  gasPrice?: HexPrefixedString
  gasLimit: HexPrefixedString
  maxPriorityFeePerGas: HexPrefixedString
  maxFeePerGas: HexPrefixedString
  nonce: HexPrefixedString
  type: HexPrefixedString
}
