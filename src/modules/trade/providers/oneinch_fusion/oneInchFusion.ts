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
  createWalletClient,
  custom,
  erc20Abi,
  type WalletClient,
  type PublicClient,
  type Chain,
} from 'viem'
import { NATIVE_ADDRESS, ONEINCH_APPROVAL_ADDRESS } from './configs'
import { bsc, mainnet } from 'viem/chains'
import { type EthereumProvider, Web3ProviderConnector } from './oneInchProvider'
import type { AxiosError } from 'axios'

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
  private walletClient: WalletClient
  private publicClient: PublicClient
  private chain: Chain
  constructor(provider: unknown, chainId: number) {
    this.web3Provider = new Web3ProviderConnector(provider as EthereumProvider)
    this.chain = chainId === 1 ? mainnet : bsc
    this.sdk = new FusionSDK({
      network: chainId === 1 ? NetworkEnum.ETHEREUM : NetworkEnum.BINANCE,
      url: 'https://fusion.1inch.io',
      blockchainProvider: this.web3Provider,
    })
    this.walletClient = createWalletClient({
      transport: custom(provider as EthereumProvider),
    })
    this.publicClient = createPublicClient({
      transport: custom(provider as EthereumProvider),
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
      throw new Error(
        response || (e as Error).message || 'Failed to fetch quote from 1inch',
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
        const tx = {
          data: call.data as `0x${string}`,
          to: call.to.toString() as `0x${string}`,
          account: config.fromAddress as `0x${string}`,
          value: call.value,
          chain: this.chain,
        }
        const hash = await this.walletClient.sendTransaction(tx)
        return this.publicClient
          .waitForTransactionReceipt({ hash })
          .then(res => {
            if (res.status === 'success')
              return {
                hash: info.orderHash,
              }
            else throw new Error('Native Transaction Failed')
          })
      }
    } catch (e: unknown) {
      throw new Error((e as Error).message || 'Failed to submit order to 1inch')
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
}

export default OneInchFusion
