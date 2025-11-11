import HWwallet from '@enkryptcom/hw-wallets'
import type { HexPrefixedString, WalletType } from '../types'
import {
  type SignableTransactionParams,
  type PostSignedTransaction,
} from '@/providers/common/types'
import type {
  QuotesResponse,
  QuotesRequestBody,
  TokenBalancesRaw,
  EthereumSignableTransactionResponse,
  GetEvmMultiTransactionEstimateRequest,
  GetUnsignedEvmMultiTransactionResponse,
  BitcoinQuotesRequestBody,
  BitcoinQuotesResponse,
  BitcoinSignableTransactionResponse,
} from '@/mew_api/types'

import type { Provider as Eip6963Provider } from '@/stores/providerStore.ts'

export interface WalletInterface {
  connect?: () => Promise<boolean>
  SignTransaction?: (
    serializedTx: HexPrefixedString,
  ) => Promise<PostSignedTransaction>
  SendTransaction?: (
    serializedTx: HexPrefixedString,
  ) => Promise<HexPrefixedString> // Transaction hash
  disconnect: () => Promise<boolean> // handles disconnecting or logging out from wallet
  getSignableTransaction: (
    tx: SignableTransactionParams,
  ) => Promise<EthereumSignableTransactionResponse | BitcoinSignableTransactionResponse>
  getGasFee?: (tx: QuotesRequestBody) => Promise<QuotesResponse>
  getBtcGasFee?: (tx: BitcoinQuotesRequestBody) => Promise<BitcoinQuotesResponse>
  SignMessage: (options: {
    message: `0x${string}`
    options: unknown
  }) => Promise<HexPrefixedString>
  getAddress: () => Promise<string>
  getWalletType: () => WalletType
  getProvider: () => string
  getBalance: () => Promise<TokenBalancesRaw>
  broadcastTransaction: (signedTx: HexPrefixedString) => Promise<string>
  // multiple tx handler
  getMultipleGasFees?: (
    txs: GetEvmMultiTransactionEstimateRequest,
  ) => Promise<QuotesResponse>
  getMultipleSignableTransactions?: (
    feeObj: SignableTransactionParams,
  ) => Promise<GetUnsignedEvmMultiTransactionResponse>
  updateChainId: (chainId: string) => void
  getWalletInstance?: () => HWwallet | null
  getProviderInstance?: () => Eip6963Provider | NonNullable<typeof window.unisat> | null
}
