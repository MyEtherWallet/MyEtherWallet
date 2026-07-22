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
import type { AxiosError } from 'axios'
import type BaseEvmWallet from '@/providers/ethereum/baseEvmWallet'
import type {
  GetWebSwapOndoAssetsResponse,
  GetWebSwapOndoSupportingAssetsResponse,
  GetWebTokenInfo,
} from '@/mew_api/types'
import { prepareTransactionRequest } from 'viem/actions'
import { isSignableWallet } from '@/utils/walletUtils'
import { getAPIPath } from '@/utils/constructAPIPath'
import { captureException } from '@sentry/vue'
import { SENTRY_MODULE_TAGS } from '@/sentry/constants'
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
  private wallet: BaseEvmWallet

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

  constructor(wallet: BaseEvmWallet, chainId: number) {
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
      return {
        startAmount: quote.presets[quote.recommendedPreset]!.auctionStartAmount,
        endAmount: quote.presets[quote.recommendedPreset]!.auctionEndAmount,
        avgAmount:
          (quote.presets[quote.recommendedPreset]!.auctionStartAmount +
            quote.presets[quote.recommendedPreset]!.auctionEndAmount) /
          2n,
      }
    } catch (e: unknown) {
      const response =
        ((e as AxiosError).response?.data as any)?.description || null

      captureException(e, {
        ...SENTRY_MODULE_TAGS.TRADE,
        extra: {
          title: 'TRADE: Error fetching quote from 1inch',
        },
      })
      throw new Error(
        response ||
          (e as Error).message ||
          i18n.global.t('trade.error.failed-fetch-quote-1inch'),
      )
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
        const serialized = serializeTransaction(tx as any)
        let hash = ''
        if (isSignableWallet(this.wallet)) {
          const signedTx = await this.wallet.SignTransaction(serialized)
          hash = await this.publicClient.sendRawTransaction({
            serializedTransaction: signedTx.signed,
          })
        } else {
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
      const errorMessage =
        e instanceof Error && e.message
          ? e.message.toLowerCase()
          : (e as any).details
            ? (e as any).details
            : typeof e === 'string'
              ? e
              : i18n.global.t('trade.error.failed-submit-order-1inch')
      throw new Error(errorMessage)
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
    const serialized = serializeTransaction(tx as any)
    let hash = ''
    if (isSignableWallet(this.wallet)) {
      const signedTx = await this.wallet.SignTransaction(serialized)
      hash = await this.publicClient.sendRawTransaction({
        serializedTransaction: signedTx.signed,
      })
    } else {
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
