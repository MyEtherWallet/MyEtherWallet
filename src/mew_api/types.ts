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
export type EVMTxResponse = components['schemas']['BroadcastEvmTransactionResponse']