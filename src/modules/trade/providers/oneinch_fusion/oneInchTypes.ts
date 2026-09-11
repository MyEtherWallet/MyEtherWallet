export interface QuoteInputType {
  fromTokenAddress: string
  toTokenAddress: string
  amount: string
  fromAddress: string
  fromTokenDecimals: number
  toTokenDecimals: number
}
export interface QuoteOutputType {
  startAmount: bigint
  endAmount?: bigint
  avgAmount?: bigint
  auctionDurationSeconds?: number
  slippage?: number
  tokenFee?: bigint
  marketReturn?: bigint
  usdPrices?: { fromToken: string; toToken: string }
}

export interface OrderStatusOutputType {
  status: string
  fills: { txHash: string }[]
  createdAt: number
  duration: number
  cancelTx?: string | null
  finalToAmount?: bigint
}
