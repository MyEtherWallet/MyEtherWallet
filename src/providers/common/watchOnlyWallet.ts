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
  QuotesResponse,
  QuotesRequestBody,
  EthereumSignableTransactionResponse,
  GetEvmMultiTransactionEstimateRequest,
  Chain,
  BitcoinQuotesRequestBody,
  BitcoinQuotesResponse,
  ChainType,
} from '@/mew_api/types'
import { fetchWithRetry } from '@/mew_api/fetchWithRetry'
import { isAddress } from '@/utils/addressUtils'
import type { Provider } from '@/stores/providerStore'
import type { HWManager } from '@/providers/hw/types'

class WatchOnlyWallet implements WalletInterface {
  address: string
  chain: Chain
  walletType: WalletType
  chainType: ChainType
  walletName: string

  constructor(
    address: string,
    chain: Chain,
    walletType: WalletType,
    chainType: ChainType,
    walletName: string,
  ) {
    this.address = address
    this.chain = chain
    this.walletType = walletType
    this.chainType = chainType
    this.walletName = walletName
  }
  updateChainId: (chainId: string) => void = () => {}
  getWalletInstance?: (() => HWManager | null) | undefined
  getProviderInstance?:
    | (() => Provider | NonNullable<typeof window.unisat> | null)
    | undefined
  /**
   * Get gas fee for a transaction. Wraps the request to the MEW API. Wrap in try catch to handle errors.
   * @param tx  - Transaction details
   * @returns Promise resolving to QuotesResponse containing gas fee information
   */
  getBtcGasFee = (
    tx: BitcoinQuotesRequestBody,
  ): Promise<BitcoinQuotesResponse> => {
    return fetchWithRetry<BitcoinQuotesResponse>(
      `/v2/btc/${this.getProvider()}/quotes?noInjectErrors=false`,
      {
        method: 'POST',
        body: JSON.stringify(tx),
      },
    )
  }

  /**
   * Get gas fee for a transaction. Wraps the request to the MEW API. Wrap in try catch to handle errors.
   * @param tx  - Transaction details
   * @returns Promise resolving to QuotesResponse containing gas fee information
   */
  getGasFee = (tx: QuotesRequestBody): Promise<QuotesResponse> => {
    return fetchWithRetry<QuotesResponse>(
      `/v1/evm/chains/${this.chain.chainID}/quotes?noInjectErrors=false`,
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
      `/v1/evm/chains/${this.chain.chainID}/multi-quotes?noInjectErrors=false`,
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
        `/v1/evm/chains/${this.chain.chainID}/multi-quotes/${feeObj.quoteId}/unsigned?noInjectErrors=false&priority=${feeObj.priority}`,
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
      `/v1/evm/chains/${this.chain.chainID}/quotes/${feeObj.quoteId}/unsigned?noInjectErrors=false&priority=${feeObj.priority}`,
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
    message: string
    options?: unknown
  }): Promise<HexPrefixedString> {
    throw new Error('Method not implemented: SignMessage')
  }
  getAddress(): Promise<string> {
    return Promise.resolve(this.address)
  }
  getWalletType(): WalletType {
    return this.walletType
  }
  getWalletName(): string {
    return this.walletName
  }
  getProvider(): string {
    const chainStore = useChainsStore()
    const { selectedChain } = storeToRefs(chainStore)
    return selectedChain.value?.name || 'ETHEREUM'
  }

  async getBalance(): Promise<TokenBalancesRaw> {
    const chainStore = useChainsStore()
    const { selectedChain } = storeToRefs(chainStore)
    const emptyResponse: TokenBalancesRaw = {
      result: [],
    }
    if (selectedChain.value?.type !== this.chainType) {
      return emptyResponse
    }
    const address = await this.getAddress()
    // Guard against an address whose format does not match the chain type,
    // e.g. an EVM `0x` address paired with a BITCOIN chain (or vice-versa).
    // Building a balance request in that case yields an invalid endpoint the
    // MEW API 404s on, surfacing as an unhandled rejection (MEW-2043).
    if (this.isAddressChainTypeMismatch(address)) {
      return emptyResponse
    }
    const Endpoint = `/balances/${this.getProvider()}/${address}/?noInjectErrors=false&sparklines=true`
    return fetchWithRetry<TokenBalancesRaw>(Endpoint).catch(() => emptyResponse)
  }

  /**
   * Returns true when the wallet address format is incompatible with its chain
   * type — an EVM `0x` address on a BITCOIN chain, or a non-EVM address on an
   * EVM chain. Reuses the shared EVM address validator to detect the format.
   */
  private isAddressChainTypeMismatch(address: string): boolean {
    const isEvmAddress = isAddress(address, this.chain.name)
    if (this.chainType === 'BITCOIN') {
      return isEvmAddress
    }
    if (this.chainType === 'EVM') {
      return !isEvmAddress
    }
    return false
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  broadcastTransaction(signedTx: HexPrefixedString): Promise<string> {
    throw new Error('Method not implemented: broadcastTransaction')
  }

  connect(): Promise<boolean> {
    return Promise.resolve(true)
  }
  disconnect(): Promise<boolean> {
    return Promise.resolve(true)
  }
}

export default WatchOnlyWallet
