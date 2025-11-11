import type { WalletInterface } from '../common/walletInterface'
import { useChainsStore } from '@/stores/chainsStore'
import { storeToRefs } from 'pinia'
import {
  type TokenBalancesRaw,
  type GetUnsignedEvmMultiTransactionResponse,
} from '@/mew_api/types'
import { WalletType, type HexPrefixedString } from '../types'
import {
  type SignableTransactionParams,
  type PostSignedTransaction,
} from '../common/types'
import type {
  EVMTxResponse,
  QuotesResponse,
  QuotesRequestBody,
  EthereumSignableTransactionResponse,
  GetEvmMultiTransactionEstimateRequest,
} from '@/mew_api/types'
import { fetchWithRetry } from '@/mew_api/fetchWithRetry'

class BaseEvmWallet implements WalletInterface {
  chainId: string
  constructor(chainId: string) {
    this.chainId = chainId
  }

  /**
   * Get gas fee for a transaction. Wraps the request to the MEW API. Wrap in try catch to handle errors.
   * @param tx  - Transaction details
   * @returns Promise resolving to QuotesResponse containing gas fee information
   */
  getGasFee = (tx: QuotesRequestBody): Promise<QuotesResponse> => {
    return fetchWithRetry<QuotesResponse>(
      `/v1/evm/chains/${this.chainId}/quotes?noInjectErrors=false`,
      {
        method: 'POST',
        body: JSON.stringify(tx),
      },
    )
  }

  /**
   * Gets gas fee for multiple transactions. ie token transactions where an approval may be required
   * @param txs - Array of transactions to estimate gas fees for
   * @returns A QuotesResponse containing gas fee estimates for each provided transaction
   */

  getMultipleGasFees = (txs: GetEvmMultiTransactionEstimateRequest) => {
    return fetchWithRetry<QuotesResponse>(
      `/v1/evm/chains/${this.chainId}/multi-quotes?noInjectErrors=false`,
      {
        method: 'POST',
        body: JSON.stringify(txs),
      },
    )
  }

  /**
   * Get multiple unsigned transactions using the MEW API.
   * @param feeObj - Object containing quoteId and priority for the transaction
   * @returns Promise resolving to EthereumSignableTransactionResponse containing the unsigned transaction
   *
   */
  getMultipleSignableTransactions = async (
    feeObj: SignableTransactionParams,
  ): Promise<GetUnsignedEvmMultiTransactionResponse> => {
    const response =
      await fetchWithRetry<GetUnsignedEvmMultiTransactionResponse>(
        `/v1/evm/chains/${this.chainId}/multi-quotes/${feeObj.quoteId}/unsigned?noInjectErrors=false&priority=${feeObj.priority}`,
      )
    return response
  }

  /**
   * Get a signable transaction from the MEW API.
   * @param feeObj - Object containing quoteId and priority for the transaction
   * @returns Promise resolving to EthereumSignableTransactionResponse containing the unsigned transaction
   */
  getSignableTransaction = async (
    feeObj: SignableTransactionParams,
  ): Promise<EthereumSignableTransactionResponse> => {
    return fetchWithRetry<EthereumSignableTransactionResponse>(
      `/v1/evm/chains/${this.chainId}/quotes/${feeObj.quoteId}/unsigned?noInjectErrors=false&priority=${feeObj.priority}`,
    )
  }

  /**
   *
   * @param serializedTx
   * currently making library figure out tx type
   * TODO: switch to using the type from the API
   */
  SignTransaction(
    serializedTx: HexPrefixedString,
  ): Promise<PostSignedTransaction> {
    throw new Error(
      `'Method not implemented: SignTransaction', ${serializedTx}`,
    )
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  SendTransaction(serializedTx: HexPrefixedString): Promise<HexPrefixedString> {
    throw new Error('Method not implemented: SignTransaction')
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  SignMessage(options: {
    message: `0x${string}`
    options: unknown
  }): Promise<HexPrefixedString> {
    throw new Error('Method not implemented: SignMessage')
  }
  getAddress(): Promise<string> {
    throw new Error('Method not implemented: getAddress')
  }
  getWalletType(): WalletType {
    throw new Error('Method not implemented: getWalletType')
  }
  getProvider(): string {
    const chainStore = useChainsStore()
    const { selectedChain } = storeToRefs(chainStore)
    return selectedChain.value?.name || 'ETHEREUM'
  }

  async getBalance(): Promise<TokenBalancesRaw> {
    const address = await this.getAddress()
    const balanceEndpoint = `/balances/${this.getProvider()}/${address}/?noInjectErrors=false&sparklines=true`
    return fetchWithRetry<TokenBalancesRaw>(balanceEndpoint)
  }

  async broadcastTransaction(signedTx: HexPrefixedString): Promise<string> {
    const url = `/v1/evm/chains/${this.chainId}/broadcasts/?noInjectErrors=false`
    const options = {
      method: 'POST',
      body: JSON.stringify({ signedTransaction: signedTx }),
    }
    const data = await fetchWithRetry<EVMTxResponse>(url, options)
    return data.txHash
  }

  connect(): Promise<boolean> {
    return Promise.resolve(true)
  }
  disconnect(): Promise<boolean> {
    return Promise.resolve(true)
  }
  updateChainId(chainId: string): void {
    this.chainId = chainId
  }
}

export default BaseEvmWallet
