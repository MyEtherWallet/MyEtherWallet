import type { GetTradableAssetsResponse } from '@/mew_api/types'

export interface TradableAsset {
  symbol: string
  name: string
  contract: string
  decimals: number
  chainId: number
  logo?: string
}

export interface TradeQuoteInput {
  fromTokenAddress: string
  toTokenAddress: string
  amount: string
  fromAddress: string
  fromTokenDecimals: number
  toTokenDecimals: number
}

export interface TradeQuoteOutput {
  startAmount: bigint
  endAmount?: bigint
  avgAmount?: bigint
  fee?: bigint
  feeDecimals?: number
}

export interface TradeOrderStatus {
  status: string
  fills: { txHash: string }[]
  createdAt: number
  duration: number
  cancelTx?: string | null
  finalToAmount?: bigint
}

export type { GetTradableAssetsResponse }
