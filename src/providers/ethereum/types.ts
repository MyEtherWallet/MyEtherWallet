import type { GasPriceType, HexPrefixedString } from '../types'
import { FeeMarketEIP1559Transaction, LegacyTransaction } from '@ethereumjs/tx'

export type NativeEthereumTransaction =
  | LegacyTransaction
  | FeeMarketEIP1559Transaction

export enum SupportedTXType {
  LEGACY = '0x0',
  EIP1559 = '0x2',
}

export interface PreEthereumTransaction {
  id: string
  to: HexPrefixedString
  from: HexPrefixedString
  value: HexPrefixedString
  data: HexPrefixedString
  chainId: HexPrefixedString
  type: HexPrefixedString
}

export interface PostEthereumTransaction extends PreEthereumTransaction {
  gasPriceType: GasPriceType
  gasPrice?: HexPrefixedString
  gasLimit: HexPrefixedString
  maxPriorityFeePerGas: HexPrefixedString
  maxFeePerGas: HexPrefixedString
  nonce: HexPrefixedString
}
