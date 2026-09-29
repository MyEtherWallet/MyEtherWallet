import {
  Address,
  FusionSDK,
  NativeOrdersFactory,
  NativeOrdersImpl,
  NetworkEnum,
  type OrderParams,
  type QuoteParams,
} from '@1inch/fusion-sdk'
import {
  NativeOrderUnsubmittedError,
  type NativeOrderRecoveryParams,
  type SubmitOrderHooks,
  type SubmitOrderResult,
} from './nativeOrderError'

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
import {
  isExpectedTradeError,
  REPORTABLE_CLIENT_STATUSES,
} from '@/modules/trade/common/expectedTradeError'
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

type ErrorBody = {
  error?: string
  description?: string
  statusCode?: number
  code?: string
}

const FUSION_ERROR_COPY: Record<string, string> = {
  INSUFFICIENT_AMOUNT: 'trade.error.insufficient-amount',
  MARKET_CLOSED: 'trade.error.market-closed',
}

export const fusionErrorMessage = (e: unknown): string | null => {
  const data =
    e && typeof e === 'object' && 'response' in e
      ? ((e as AxiosError).response?.data as ErrorBody | undefined)
      : undefined
  const localized = data?.code ? FUSION_ERROR_COPY[data.code] : undefined
  if (localized) return i18n.global.t(localized)
  return data?.description || null
}

export {
  NativeOrderUnsubmittedError,
  type NativeOrderRecoveryParams,
  type SubmitOrderHooks,
  type SubmitOrderResult,
}

const isRetryableRelayerError = (e: unknown): boolean => {
  if (isAxiosNetworkError(e)) return true
  const status = (e as AxiosError)?.response?.status
  return typeof status === 'number' && status >= 500
}

const sleep = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms))

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
  private httpConnector: IsolatedAxiosConnector
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
    this.httpConnector = new IsolatedAxiosConnector()
    this.sdk = new FusionSDK({
      network: chainId === 1 ? NetworkEnum.ETHEREUM : NetworkEnum.BINANCE,
      url: 'https://fusion.1inch.io',
      blockchainProvider: this.web3Provider,
      httpProvider: this.httpConnector,
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
      // The SDK's Quote drops `priceImpactPercent`; read it from the raw body
      // captured by the connector, only if that body matches this quote.
      const raw = this.httpConnector.lastQuoteResponse
      const priceImpact =
        raw &&
        raw.marketAmount === quote.marketReturn.toString() &&
        typeof raw.priceImpactPercent === 'number'
          ? raw.priceImpactPercent
          : undefined
      return {
        startAmount: preset.auctionStartAmount,
        endAmount: preset.auctionEndAmount,
        avgAmount: (preset.auctionStartAmount + preset.auctionEndAmount) / 2n,
        auctionDurationSeconds: Number(preset.auctionDuration),
        slippage: quote.slippage,
        tokenFee: preset.tokenFee,
        marketReturn: quote.marketReturn,
        priceImpact,
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
      // stay unflagged and are reported by the caller: 5xx / network / no
      // response, and the reportable 4xxs (401 credential, 403 block, 429
      // throttle) — those are a broken trade path, not user-correctable input,
      // and flagging them also mislabeled every pair as unavailable during an
      // outage (isPairUnavailableError builds on this flag).
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
        typeof status === 'number' &&
        status >= 400 &&
        status < 500 &&
        !REPORTABLE_CLIENT_STATUSES.has(status)
      error.fusionCode = fusionCode
      // A transient axios "Network Error" (the 1inch request never completed —
      // no response received) is environmental noise, already surfaced to the
      // user; flag it so the caller skips Sentry reporting.
      error.transientNetworkError = isAxiosNetworkError(e)
      throw error
    }
  }

  /**
   * Delays between relayer submission attempts for a native order whose
   * deposit is already in flight. Exposed so tests can zero them.
   */
  static RELAYER_RETRY_DELAYS_MS: number[] = [1000, 2000]

  async submitOrder(
    config: QuoteInputType,
    hooks: SubmitOrderHooks = {},
  ): Promise<SubmitOrderResult> {
    try {
      const preparedOrder = await this.sdk.createOrder(
        getFusionParams(config) as OrderParams,
      )
      if (config.fromTokenAddress.toLowerCase() !== NATIVE_ADDRESS) {
        const info = await this.sdk.submitOrder(
          preparedOrder.order,
          preparedOrder.quoteId,
        )
        return {
          hash: info.orderHash,
        }
      }

      // Native (ETH/BNB) order. The order's `maker` is a per-order proxy that
      // must be funded through the factory's `create` call; 1inch keeps the
      // order "unpublished" until that transaction mines. The deposit is
      // therefore broadcast FIRST: if the user rejects the wallet prompt, or the
      // send fails, nothing has reached the relayer and there is no phantom
      // order. Only once the deposit is in flight is the order handed to the
      // relayer. The native signature is deterministic (no wallet prompt), so
      // this ordering costs the user nothing.
      const maker = new Address(config.fromAddress)
      const nativeOrder = preparedOrder.order.build()
      // Prefer the factory the quoter bound this order to; the SDK constant is
      // only a fallback for an older quoter response.
      const factory = preparedOrder.nativeOrderFactory
        ? new NativeOrdersFactory(preparedOrder.nativeOrderFactory)
        : NativeOrdersFactory.default(this.networkEnum())
      const depositCall = factory.create(maker, nativeOrder)
      const depositTxHash = await this.signAndSend(
        config.fromAddress,
        depositCall,
      )
      hooks.onDepositSent?.(depositTxHash)

      let orderHash: string
      try {
        const info = await this.submitNativeOrderWithRetry(
          preparedOrder.order,
          maker,
          preparedOrder.quoteId,
        )
        orderHash = info.orderHash
      } catch (relayerError) {
        // The ETH is on its way to the proxy but 1inch has no order for it. The
        // caller must keep these details so the user can reclaim the funds.
        throw new NativeOrderUnsubmittedError({
          orderHash: preparedOrder.hash,
          depositTxHash,
          proxyAddress: nativeOrder.maker,
          nativeOrder,
          cause: relayerError,
        })
      }

      const receipt = await this.publicClient.waitForTransactionReceipt({
        hash: depositTxHash as `0x${string}`,
      })
      if (receipt.status !== 'success') {
        // The order is on the relayer but its proxy was never funded; it cannot
        // be filled and will expire on its own, so nothing else to clean up.
        throw new Error(i18n.global.t('trade.error.native-transaction-failed'))
      }
      return { hash: orderHash, depositTxHash }
    } catch (e: unknown) {
      // Already carries everything the caller needs; do not flatten it.
      if (e instanceof NativeOrderUnsubmittedError) throw e
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
    const hash = await this.signAndSend(fromAddress, {
      to: tokenAddress,
      data: encodeFunctionData({
        abi: erc20Abi,
        functionName: 'approve',
        args: [
          ONEINCH_APPROVAL_ADDRESS,
          BigInt(
            '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
          ),
        ],
      }),
    })
    return this.publicClient
      .waitForTransactionReceipt({ hash: hash as `0x${string}` })
      .then(res => {
        return res.transactionHash
      })
  }

  /**
   * Reclaims the ETH of a native order whose deposit landed but which 1inch
   * never accepted (see `NativeOrderUnsubmittedError`). Calls `cancelOrder` on
   * the order's proxy, which refunds the maker. Resolves with the cancel
   * transaction hash once it has mined successfully.
   */
  async cancelNativeOrder(params: NativeOrderRecoveryParams): Promise<string> {
    const impl = new NativeOrdersImpl(new Address(params.proxyAddress))
    const call = impl.cancel(
      new Address(params.fromAddress),
      params.nativeOrder,
    )
    const hash = await this.signAndSend(params.fromAddress, call)
    const receipt = await this.publicClient.waitForTransactionReceipt({
      hash: hash as `0x${string}`,
    })
    if (receipt.status !== 'success') {
      throw new Error(i18n.global.t('trade.error.recover-funds-failed'))
    }
    return receipt.transactionHash
  }

  private networkEnum(): NetworkEnum {
    return this.chain.id === 1 ? NetworkEnum.ETHEREUM : NetworkEnum.BINANCE
  }

  /**
   * Hands a native order to the relayer, retrying transient failures (network
   * errors, 5xx). A 4xx is final: the relayer has judged the order itself.
   */
  private async submitNativeOrderWithRetry(
    order: Parameters<FusionSDK['submitNativeOrder']>[0],
    maker: Address,
    quoteId: string,
  ) {
    const delays = OneInchFusion.RELAYER_RETRY_DELAYS_MS
    for (let attempt = 0; ; attempt++) {
      try {
        return await this.sdk.submitNativeOrder(order, maker, quoteId)
      } catch (e) {
        if (attempt >= delays.length || !isRetryableRelayerError(e)) throw e
        await sleep(delays[attempt]!)
      }
    }
  }

  /**
   * Prepares, signs (or hands to the wallet) and broadcasts a call from
   * `fromAddress`. Resolves with the transaction hash as soon as it is
   * broadcast; callers decide whether to wait for the receipt.
   */
  private async signAndSend(
    fromAddress: string,
    call: { to: string | Address; data: string; value?: bigint },
  ): Promise<string> {
    const tx = await prepareTransactionRequest(this.publicClient, {
      data: call.data as `0x${string}`,
      to: call.to.toString() as `0x${string}`,
      account: fromAddress as `0x${string}`,
      value: call.value,
      chain: this.chain,
    })
    const serialized = serializeTransaction(
      tx as Parameters<typeof serializeTransaction>[0],
    )
    if (isSignableWallet(this.wallet)) {
      if (!this.wallet.SignTransaction) {
        throw new Error('The connected wallet cannot sign transactions')
      }
      const signedTx = await this.wallet.SignTransaction(serialized)
      return this.publicClient.sendRawTransaction({
        serializedTransaction: signedTx.signed,
      })
    }
    if (!this.wallet.SendTransaction) {
      throw new Error('The connected wallet cannot send transactions')
    }
    return this.wallet.SendTransaction(serialized)
  }
}

export default OneInchFusion
