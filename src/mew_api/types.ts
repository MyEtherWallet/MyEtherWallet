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

//Estimates
export type EstimatesResponse =
  components['schemas']['GetEvmTransactionEstimateResponse']
export type EstimatesRequestBody =
  components['schemas']['GetEvmTransactionEstimateRequest']
//Quotes
export type QuotesResponse =
  components['schemas']['GetEvmTransactionQuoteResponse']
export type QuotesRequestBody =
  components['schemas']['GetEvmTransactionQuoteRequest']
