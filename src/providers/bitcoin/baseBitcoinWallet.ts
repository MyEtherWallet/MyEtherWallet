import type { WalletInterface } from '../common/walletInterface'
import { useChainsStore } from '@/stores/chainsStore'
import { storeToRefs } from 'pinia'
import { WalletType, type HexPrefixedString } from '../types'
import {
  type SignableTransactionParams,
  type PostSignedTransaction,
} from '../common/types'
import type {
  BitcoinTxResponse as TxResponse,
  BitcoinQuotesResponse,
  BitcoinQuotesRequestBody,
  BitcoinSignableTransactionResponse as SignableTransactionResponse,
  GetEvmMultiTransactionEstimateRequest,
  GetUnsignedEvmMultiTransactionResponse,
  QuotesResponse,
  TokenBalancesRaw,
} from '@/mew_api/types'
import { fetchWithRetry } from '@/mew_api/fetchWithRetry'

class BaseBtcWallet implements WalletInterface {
  chainName: string
  constructor(chainName: string) {
    this.chainName = chainName
  }
  getMultipleGasFees?: ((txs: GetEvmMultiTransactionEstimateRequest) => Promise<QuotesResponse>) | undefined
  getMultipleSignableTransactions?: ((feeObj: SignableTransactionParams) => Promise<GetUnsignedEvmMultiTransactionResponse>) | undefined

  /**
   * Get gas fee for a transaction. Wraps the request to the MEW API. Wrap in try catch to handle errors.
   * @param tx  - Transaction details
   * @returns Promise resolving to QuotesResponse containing gas fee information
   */
  getBtcGasFee = (tx: BitcoinQuotesRequestBody): Promise<BitcoinQuotesResponse> => {
    return fetchWithRetry<BitcoinQuotesResponse>(
      `/v1/btc/chains/${this.chainName}/quotes?noInjectErrors=false`,
      {
        method: 'POST',
        body: JSON.stringify(tx),
      },
    )
  }

  /**
   * Get a signable transaction from the MEW API.
   * @param feeObj - Object containing quoteId and priority for the transaction
   * @returns Promise resolving to SignableTransactionResponse containing the unsigned transaction
   */
  getSignableTransaction = async (
    feeObj: SignableTransactionParams,
  ): Promise<SignableTransactionResponse> => {
    return fetchWithRetry<SignableTransactionResponse>(
      `/v1/btc/chains/${this.chainName}/quotes/${feeObj.quoteId}/unsigned?noInjectErrors=false&priority=${feeObj.priority}`,
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
    return selectedChain.value?.name || 'BITCOIN'
  }

  async getBalance(): Promise<TokenBalancesRaw> {
    const address = await this.getAddress()
    const balanceEndpoint = `/v1/btc/${this.getProvider()}/balances/${address}/?noInjectErrors=false`
    return fetchWithRetry<TokenBalancesRaw>(balanceEndpoint)
  }

  async broadcastTransaction(signedTx: HexPrefixedString): Promise<string> {
    const url = `/v1/btc/chains/${this.chainName}/broadcasts/?noInjectErrors=false`
    const options = {
      method: 'POST',
      body: JSON.stringify({ signedTransaction: signedTx }),
    }
    const data = await fetchWithRetry<TxResponse>(url, options)
    return data.txid
  }

  connect(): Promise<boolean> {
    return Promise.resolve(true)
  }
  disconnect(): Promise<boolean> {
    return Promise.resolve(true)
  }
  updateChainId(chainName: string): void {
    this.chainName = chainName
  }
}

export default BaseBtcWallet
