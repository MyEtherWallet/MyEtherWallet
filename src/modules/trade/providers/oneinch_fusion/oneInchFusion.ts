import {
  Address,
  FusionSDK,
  NativeOrdersFactory,
  NetworkEnum,
  type OrderParams,
  type QuoteParams,
} from '@1inch/fusion-sdk'

import type {
  OrderStatusOutputType,
  QuoteInputType,
  QuoteOutputType,
} from './oneInchTypes'
import {
  createPublicClient,
  erc20Abi,
  type PublicClient,
  type Chain,
  webSocket,
  serializeTransaction,
  encodeFunctionData,
} from 'viem'
import {
  NATIVE_ADDRESS,
  ONEINCH_APPROVAL_ADDRESS,
  SUPPORTED_CHAINS,
} from './configs'
import { Web3ProviderConnector } from './oneInchProvider'
import { IsolatedAxiosConnector } from './oneInchHttpConnector'
import type { AxiosError } from 'axios'
import { isAxiosNetworkError } from '@/modules/trade/common/transientRpcError'
// NOTE: getQuote no longer reports to Sentry directly — reporting is centralized
// in the caller (useTradeQuote) so expected 4xx client errors can be skipped.
import type { WalletInterface } from '@/providers/common/walletInterface'
import type {
  GetWebSwapOndoAssetsResponse,
  GetWebSwapOndoSupportingAssetsResponse,
  GetWebTokenInfo,
} from '@/mew_api/types'
import { prepareTransactionRequest } from 'viem/actions'
import { isSignableWallet } from '@/utils/walletUtils'
import { isExpectedTradeError } from '@/modules/trade/common/expectedTradeError'
import { getAPIPath } from '@/utils/constructAPIPath'
import i18n from '@/i18n'
export type HardcodedTokenInfo = {
  address: string
  cgId: string
  name: string
  symbol: string
  decimals: number
  logoURI: string
  price: number
}

/** Error body shape returned by the Fusion API on 4xx. */
type ErrorBody = {
  error?: string
  description?: string
  statusCode?: number
  code?: string
}

/** Fusion error codes that have localized user-facing copy. */
const FUSION_ERROR_COPY: Record<string, string> = {
  INSUFFICIENT_AMOUNT: 'trade.error.insufficient-amount',
  // Reached while the Ondo status still reports the session that just ended:
  // 1inch knows the market is shut before our own status catches up.
  MARKET_CLOSED: 'trade.error.market-closed',
}

/**
 * User-facing message from a Fusion API error, or null when the error carries
 * no response body (network failures, wallet errors, non-axios throws).
 * Prefers localized copy for known machine-readable codes; falls back to
 * 1inch's own `description`, which is English-only but specific.
 */
export const fusionErrorMessage = (e: unknown): string | null => {
  const data =
    e && typeof e === 'object' && 'response' in e
      ? ((e as AxiosError).response?.data as ErrorBody | undefined)
      : undefined
  const localized = data?.code ? FUSION_ERROR_COPY[data.code] : undefined
  if (localized) return i18n.global.t(localized)
  return data?.description || null
}

const HARDCODED_ETH_TOKENS: Array<{ address: string; cgId: string }> = []
const getFusionParams = (config: QuoteInputType): QuoteParams | OrderParams => {
  const { fromTokenAddress, toTokenAddress, amount, fromAddress } = config
  return {
    amount,
    fromTokenAddress,
    toTokenAddress,
    enableEstimate: false,
    source: 'myetherwallet',
    walletAddress: fromAddress as string,
    isPermit2: false,
  }
}

class OneInchFusion {
  private web3Provider: Web3ProviderConnector
  private sdk: FusionSDK
  private publicClient: PublicClient
  private chain: Chain
  private wallet: WalletInterface

  public static getSupportedChainNames() {
    return SUPPORTED_CHAINS.map(sc => sc.chainName)
  }

  public static async getTradableAssets(): Promise<GetWebSwapOndoAssetsResponse> {
    return fetch(getAPIPath(`/v1/web/swap/ondo/assets`)).then(
      res => res.json() as Promise<GetWebSwapOndoAssetsResponse>,
    )
  }

  public static async getAdditionalBuyAssets(): Promise<GetWebSwapOndoSupportingAssetsResponse> {
    return fetch(getAPIPath(`/v1/web/swap/ondo/supporting-assets`)).then(
      res => res.json() as Promise<GetWebSwapOndoSupportingAssetsResponse>,
    )
  }

  public static async getHardcodedTokensInfo(): Promise<HardcodedTokenInfo[]> {
    const results = await Promise.all(
      HARDCODED_ETH_TOKENS.map(async token => {
        const res = await fetch(
          getAPIPath(`/v1/web/pages/token-info/coins/${token.cgId}`),
        )
        const data = (await res.json()) as GetWebTokenInfo
        const ethChain = data.chainBalances.find(
          c => c.chainName === 'ETHEREUM',
        )
        const decimals =
          ethChain?.result.ok && ethChain.result.value.decimals != null
            ? ethChain.result.value.decimals
            : 18
        return {
          address: token.address,
          cgId: token.cgId,
          name: data.name,
          symbol: data.symbol.toUpperCase(),
          decimals,
          logoURI: data.iconUrl ?? '',
          price: data.currentPrice ?? 0,
        }
      }),
    )
    return results
  }

  constructor(wallet: WalletInterface, chainId: number) {
    const chainConfig = SUPPORTED_CHAINS.find(c => c.chainId === chainId)
    if (!chainConfig)
      throw new Error(i18n.global.t('trade.error.fusion-network-not-supported'))
    this.wallet = wallet
    this.publicClient = createPublicClient({
      transport: webSocket(chainConfig.node),
    })
    this.web3Provider = new Web3ProviderConnector(wallet, this.publicClient)
    this.chain = chainConfig.chain
    this.sdk = new FusionSDK({
      network: chainId === 1 ? NetworkEnum.ETHEREUM : NetworkEnum.BINANCE,
      url: 'https://fusion.1inch.io',
      blockchainProvider: this.web3Provider,
      // Keeps 1inch traffic off the global axios instance, where Ledger's
      // interceptor would rewrite the error and strip `response` — see the
      // connector for the full story.
      httpProvider: new IsolatedAxiosConnector(),
    })
  }

  async getOrderStatus(hash: string): Promise<OrderStatusOutputType> {
    return this.sdk.getOrderStatus(hash).then(res => {
      let status = res.status as string
      if (status === 'fulfilled') status = 'filled'
      const creationDate = Math.floor(new Date(res.createdAt).getTime() / 1000)
      const retValue: OrderStatusOutputType = {
        status,
        cancelTx: res.cancelTx,
        createdAt: creationDate,
        duration: res.auctionDuration,
        fills: res.fills,
      }
      if (status === 'filled') {
        retValue.finalToAmount = BigInt(res.fills[0]!.filledAuctionTakerAmount)
      }
      return retValue
    })
  }

  async getQuote(config: QuoteInputType): Promise<QuoteOutputType> {
    try {
      const quote = await this.sdk.getQuote(getFusionParams(config))
      const preset = quote.presets[quote.recommendedPreset]!
      return {
        startAmount: preset.auctionStartAmount,
        endAmount: preset.auctionEndAmount,
        avgAmount: (preset.auctionStartAmount + preset.auctionEndAmount) / 2n,
        auctionDurationSeconds: Number(preset.auctionDuration),
        slippage: quote.slippage,
        tokenFee: preset.tokenFee,
        marketReturn: quote.marketReturn,
        usdPrices: quote.prices.usd,
      }
    } catch (e: unknown) {
      const status = (e as AxiosError).response?.status
      const fusionCode = (
        (e as AxiosError).response?.data as ErrorBody | undefined
      )?.code
      const response = fusionErrorMessage(e)
      const rawMessage =
        e instanceof Error ? e.message : typeof e === 'string' ? e : ''

      // 1inch returns 4xx (e.g. 400 Bad Request) for expected, user-facing quote
      // failures: amount below minimum, illiquid/unsupported pair, invalid params.
      // Flag those so the single caller (useTradeQuote) can skip Sentry reporting
      // — reporting is centralized there to avoid double-capture. Genuine failures
      // (5xx / network / no response) stay unflagged and are reported by the caller.
      const error = new Error(
        response ||
          rawMessage ||
          i18n.global.t('trade.error.failed-fetch-quote-1inch'),
      ) as Error & {
        expectedClientError?: boolean
        transientNetworkError?: boolean
        fusionCode?: string
      }
      error.expectedClientError =
        typeof status === 'number' && status >= 400 && status < 500
      error.fusionCode = fusionCode
      // A transient axios "Network Error" (the 1inch request never completed —
      // no response received) is environmental noise, already surfaced to the
      // user; flag it so the caller skips Sentry reporting.
      error.transientNetworkError = isAxiosNetworkError(e)
      throw error
    }
  }

  async submitOrder(config: QuoteInputType) {
    try {
      const preparedOrder = await this.sdk.createOrder(
        getFusionParams(config) as OrderParams,
      )
      if (config.fromTokenAddress !== NATIVE_ADDRESS) {
        const info = await this.sdk.submitOrder(
          preparedOrder.order,
          preparedOrder.quoteId,
        )
        return {
          hash: info.orderHash,
        }
      } else {
        const info = await this.sdk.submitNativeOrder(
          preparedOrder.order,
          new Address(config.fromAddress),
          preparedOrder.quoteId,
        )
        const factory = NativeOrdersFactory.default(
          this.chain.id === 1 ? NetworkEnum.ETHEREUM : NetworkEnum.BINANCE,
        )
        const call = factory.create(
          new Address(config.fromAddress),
          preparedOrder.order.build(),
        )
        const tx = await prepareTransactionRequest(this.publicClient, {
          data: call.data as `0x${string}`,
          to: call.to.toString() as `0x${string}`,
          account: config.fromAddress as `0x${string}`,
          value: call.value,
          chain: this.chain,
        })
        const serialized = serializeTransaction(
          tx as Parameters<typeof serializeTransaction>[0],
        )
        let hash = ''
        if (isSignableWallet(this.wallet)) {
          if (!this.wallet.SignTransaction) {
            throw new Error('The connected wallet cannot sign transactions')
          }
          const signedTx = await this.wallet.SignTransaction(serialized)
          hash = await this.publicClient.sendRawTransaction({
            serializedTransaction: signedTx.signed,
          })
        } else {
          if (!this.wallet.SendTransaction) {
            throw new Error('The connected wallet cannot send transactions')
          }
          hash = await this.wallet.SendTransaction(serialized)
        }
        return this.publicClient
          .waitForTransactionReceipt({ hash: hash as `0x${string}` })
          .then(res => {
            if (res.status === 'success')
              return {
                hash: info.orderHash,
              }
            else
              throw new Error(
                i18n.global.t('trade.error.native-transaction-failed'),
              )
          })
      }
    } catch (e: unknown) {
      // Preserve the most specific message available and the wallet/RPC
      // `code`, then flag expected client errors —
      // user rejection (EIP-1193 4001) and 1inch 4xx (expired quote / illiquid
      // pair / invalid order) — so the caller (confirmTrade) can surface them
      // to the user while skipping Sentry capture. The previous catch re-threw
      // a bare Error that dropped `code`, collapsing user cancellations into
      // opaque "Failed to submit order to 1inch" noise in Sentry.
      // Narrow to a non-null object first: the SDK/wallet may throw `null` or
      // `undefined`, and reading `.details` / `.code` off those would raise a
      // TypeError that escapes as fresh Sentry noise — the opposite of intent.
      const errObj =
        typeof e === 'object' && e !== null
          ? (e as Record<string, unknown>)
          : undefined
      // The API's own message first: axios errors carry a generic "Request
      // failed with status code N" in `.message`, while the useful text lives
      // in the response body.
      const errorMessage =
        fusionErrorMessage(e) ??
        (e instanceof Error && e.message
          ? e.message
          : errObj && typeof errObj.details === 'string'
            ? errObj.details
            : typeof e === 'string'
              ? e
              : i18n.global.t('trade.error.failed-submit-order-1inch'))
      const error = new Error(errorMessage) as Error & {
        code?: number
        expectedClientError?: boolean
      }
      if (errObj && typeof errObj.code === 'number') error.code = errObj.code
      error.expectedClientError = isExpectedTradeError(e)
      throw error
    }
  }

  async isApprovalRequired(
    fromAddress: string,
    tokenAddress: string,
    amount: bigint,
  ): Promise<boolean> {
    if (tokenAddress === NATIVE_ADDRESS) return false
    const tokeAllowanceData = (await this.publicClient.readContract({
      abi: erc20Abi,
      address: tokenAddress as `0x${string}`,
      functionName: 'allowance',
      args: [fromAddress as `0x${string}`, ONEINCH_APPROVAL_ADDRESS],
    })) as bigint
    if (tokeAllowanceData < amount) return true
    return false
  }

  async setApproval(fromAddress: string, tokenAddress: string) {
    const tx = await prepareTransactionRequest(this.publicClient, {
      data: encodeFunctionData({
        abi: erc20Abi,
        functionName: 'approve',
        args: [
          ONEINCH_APPROVAL_ADDRESS,
          BigInt(
            '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
          ),
        ],
      }) as `0x${string}`,
      to: tokenAddress as `0x${string}`,
      account: fromAddress as `0x${string}`,
      chain: this.chain,
    })
    const serialized = serializeTransaction(
      tx as Parameters<typeof serializeTransaction>[0],
    )
    let hash = ''
    if (isSignableWallet(this.wallet)) {
      if (!this.wallet.SignTransaction) {
        throw new Error('The connected wallet cannot sign transactions')
      }
      const signedTx = await this.wallet.SignTransaction(serialized)
      hash = await this.publicClient.sendRawTransaction({
        serializedTransaction: signedTx.signed,
      })
    } else {
      if (!this.wallet.SendTransaction) {
        throw new Error('The connected wallet cannot send transactions')
      }
      hash = await this.wallet.SendTransaction(serialized)
    }
    return this.publicClient
      .waitForTransactionReceipt({ hash: hash as `0x${string}` })
      .then(res => {
        return res.transactionHash
      })
  }
}

export default OneInchFusion
