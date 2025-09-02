import { type components } from './schema'

/** --------------------------
 * GET Balances
 --------------------------*/
export type TokenBalancesRaw =
  components['schemas']['GetBalancesByChainNameAndAddressResponse']
export type TokenBalanceRaw =
  components['schemas']['GetBalancesByChainNameAndAddressResponse']['result'][0]
export interface TokenBalance extends TokenBalanceRaw {
  name: string
  symbol: string
  balanceWei: string
}
/** --------------------------
 * GET Chains
 --------------------------*/
export type ChainsRaw = components['schemas']['GetChainMetadataListResponse']
export type Chain = components['schemas']['ChainMetadata']

/** --------------------------
 * POST Tx
  --------------------------*/
export type EVMTxResponse =
  components['schemas']['BroadcastEvmTransactionResponse']

/** --------------------------
 * GET Gas Fees
 * --------------------------*/
export type FeePriority = components['schemas']['FeePriority']
export type GasFeeInfo = components['schemas']['EvmGasFeeInfo']
export type EvmGasFees = components['schemas']['EvmGasFees']

//Estimates
export type EstimatesResponse =
  components['schemas']['GetEvmTransactionEstimateResponse']
export type EstimatesRequestBody =
  components['schemas']['GetEvmTransactionEstimateRequest']

// multi-transaction estimates
export type GetEvmMultiTransactionEstimateRequest =
  components['schemas']['GetEvmMultiTransactionEstimateRequest']
export type EvmTransactionAction = components['schemas']['EvmTransactionAction']

// mutli quotes
export type GetUnsignedEvmMultiTransactionResponse =
  components['schemas']['GetUnsignedEvmMultiTransactionResponse']

//Quotes
export type QuotesResponse =
  components['schemas']['GetEvmTransactionQuoteResponse']
export type QuotesRequestBody =
  components['schemas']['GetEvmTransactionQuoteRequest']

// Signable Transactions
export type EthereumSignableTransactionResponse =
  components['schemas']['GetUnsignedEvmTransactionResponse']


// Explore page
export type WebTokensTableSort = components['schemas']['WebTokensTableSort']
export type GetWebTokensTableResponse = components['schemas']['GetWebTokensTableResponse']
export type GetWebTopGainersSuccessResponse = components['schemas']['GetWebTopGainersSuccessResponse']
export type GetWebTrendingTokensResponse = components['schemas']['GetWebTrendingTokensResponse']