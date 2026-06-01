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
export type HardcodedTokenInfo = {
  address: string
  cgId: string
  name: string
  symbol: string
  decimals: number
  logoURI: string
  price: number
}

const HARDCODED_ETH_TOKENS: Array<{ address: string; cgId: string }> = [
  // {
  //   address: '0x89233399708c18ac6887f90a2b4cd8ba5fedd06e',
  //   cgId: 'abbott-xstock',
  // },
  // {
  //   address: '0xfbf2398df672cee4afcc2a4a733222331c742a6a',
  //   cgId: 'abbvie-xstock',
  // },
  // {
  //   address: '0x05473cea3774d898c7b6dda21e1876d6bca7277b',
  //   cgId: 'abrdn-physical-palladium-shares-xstock',
  // },
  // {
  //   address: '0x8e9e4a8d7f1c65dcb42d9103832b27e75946055d',
  //   cgId: 'abrdn-physical-platinum-shares-xstock',
  // },
  // {
  //   address: '0x03183ce31b1656b72a55fa6056e287f50c35bbeb',
  //   cgId: 'accenture-xstock',
  // },
  // {
  //   address: '0xe92f673ca36c5e2efd2de7628f815f84807e803f',
  //   cgId: 'alphabet-xstock',
  // },
  // {
  //   address: '0x3557ba345b01efa20a1bddc61f573bfd87195081',
  //   cgId: 'amazon-xstock',
  // },
  // {
  //   address: '0x2f9a35ab5ddfbc49927bfdeab98a86c53dc6e763',
  //   cgId: 'amber-xstock',
  // },
  // {
  //   address: '0x3522513e5f146a2006e2901b05f16b2821485e19',
  //   cgId: 'amd-xstock',
  // },
  // {
  //   address: '0x9d275685dc284c8eb1c79f6aba7a63dc75ec890a',
  //   cgId: 'apple-xstock',
  // },
  // {
  //   address: '0x50a1291f69d9d3853def8209cfb1af0b46927be1',
  //   cgId: 'applovin-xstock',
  // },
  // {
  //   address: '0x5d642505fe1a28897eb3baba665f454755d8daa2',
  //   cgId: 'astrazeneca-xstock',
  // },
  // {
  //   address: '0x314938c596f5ce31c3f75307d2979338c346d7f2',
  //   cgId: 'bank-of-america-xstock',
  // },
  // {
  //   address: '0x12992613fdd35abe95dec5a4964331b1ee23b50d',
  //   cgId: 'berkshire-hathaway-xstock',
  // },
  // {
  //   address: '0x22e1991e5f82736a2a990322a46aac0e95826c5b',
  //   cgId: null,
  // }, BTBx, no coingecko data on ETh
  // {
  //   address: '0x60ae7d760a1c7b528c0384bc945fadf1438f47a5',
  //   cgId: 'bitgo-xstock',
  // },
  // {
  //   address: '0xaeb681b69e5094e04d11bcef51a71358a374c3ed',
  //   cgId: 'bitmine-xstock',
  // },
  // {
  //   address: '0x38bac69cbbd28156796e4163b2b6dcb81e336565',
  //   cgId: 'broadcom-xstock',
  // },
  // {
  //   address: '0xad5cdc3340904285b8159089974a99a1a09eb4c0',
  //   cgId: 'chevron-xstock',
  // },
  // {
  //   address: '0xfebded1b0986a8ee107f5ab1a1c5a813491deceb',
  //   cgId: 'circle-xstock',
  // },
  // {
  //   address: '0x053c784cd87b74f42e0c089f98643e79c1a3ff16',
  //   cgId: 'cisco-xstock',
  // },
  // {
  //   address: '0xdcc1a2699441079da889b1f49e12b69cc791129b',
  //   cgId: 'coca-cola-xstock',
  // },
  // {
  //   address: '0x364f210f430ec2448fc68a49203040f6124096f0',
  //   cgId: 'coinbase-xstock',
  // },
  // {
  //   address: '0xbc7170a1280be28513b4e940c681537eb25e39f4',
  //   cgId: 'comcast-xstock',
  // },
  // {
  //   address: '0x6a668332825450acd2e449372057d31b3de16a1e',
  //   cgId: 'core-msci-emerging-markets-xstock',
  // },
  // {
  //   address: '0x214151022c2a5e380ab80cdac31f23ae554a7345',
  //   cgId: 'crowdstrike-xstock',
  // },
  // {
  //   address: '0xdba228936f4079daf9aa906fd48a87f2300405f4',
  //   cgId: 'danaher-xstock',
  // },
  // {
  //   address: '0x521860bb5df5468358875266b89bfe90d990c6e7',
  //   cgId: 'dfdv-xstock',
  // },
  // {
  //   address: '0x19c41ea77b34bbdee61c3a87a75d1abda2ed0be4',
  //   cgId: 'eli-lilly-xstock',
  // },
  // {
  //   address: '0xeedb0273c5af792745180e9ff568cd01550ffa13',
  //   cgId: 'exxon-mobil-xstock',
  // },
  // {
  //   address: '0xe5f6d3b2405abdfe6f660e63202b25d23763160d',
  //   cgId: 'gamestop-xstock',
  // },
  // {
  //   address: '0x89bab39d627a9e34f0dc782c53457e80ee8fb9d9',
  //   cgId: 'global-x-copper-miners-xstock',
  // },
  // {
  //   address: '0x2380f2673c640fb67e2d6b55b44c62f0e0e69da9',
  //   cgId: 'gold-xstock',
  // },
  // {
  //   address: '0x3ee7e9b3a992fd23cd1c363b0e296856b04ab149',
  //   cgId: 'goldman-sachs-xstock',
  // },
  // {
  //   address: '0x766b0cd6ed6d90b5d49d2c36a3761e9728501ba9',
  //   cgId: 'home-depot-xstock',
  // },
  // {
  //   address: '0x62a48560861b0b451654bfffdb5be6e47aa8ff1b',
  //   cgId: 'honeywell-xstock',
  // },
  // {
  //   address: '0xf8a80d1cb9cfd70d03d655d9df42339846f3b3c8',
  //   cgId: 'intel-xstock',
  // },
  // {
  //   address: '0xd9913208647671fe0f48f7f260076b2c6f310aac',
  //   cgId: 'international-business-machines-xstock',
  // },
  // {
  //   address: '0x4833e7f4f0460f4b72a3a5879a6c9841bcc5b58b',
  //   cgId: 'ishares-silver-trust-xstock',
  // },
  // {
  //   address: '0xdb0482cfad4789798623e64b15eeba01b16e917c',
  //   cgId: 'johnson-johnson-xstock',
  // },
  // {
  //   address: '0xd9fc3e075d45254a1d834fea18af8041207dea0a',
  //   cgId: 'jpmorgan-chase-xstock',
  // },
  // {
  //   address: '0x0ebe5fad0998765187fc695b75d4115c27c953a1',
  //   cgId: 'kraq-xstock',
  // },
  // {
  //   address: '0x15059c599c16fd8f70b633ade165502d6402cd49',
  //   cgId: 'linde-xstock',
  // },
  // {
  //   address: '0xeaad46f4146ded5a47b55aa7f6c48c191deaec88',
  //   cgId: 'marvell-xstock',
  // },
  // {
  //   address: '0xb365cd2588065f522d379ad19e903304f6b622c6',
  //   cgId: 'mastercard-xstock',
  // },
  // {
  //   address: '0x80a77a372c1e12accda84299492f404902e2da67',
  //   cgId: 'mcdonald-s-xstock',
  // },
  // {
  //   address: '0x0588e851ec0418d660bee81230d6c678daf21d46',
  //   cgId: 'medtronic-xstock',
  // },
  // {
  //   address: '0x17d8186ed8f68059124190d147174d0f6697dc40',
  //   cgId: 'merck-xstock',
  // },
  // {
  //   address: '0x96702be57cd9777f835117a809c7124fe4ec989a',
  //   cgId: 'meta-xstock',
  // },
  // {
  //   address: '0x5621737f42dae558b81269fcb9e9e70c19aa6b35',
  //   cgId: 'microsoft-xstock',
  // },
  // {
  //   address: '0xae2f842ef90c0d5213259ab82639d5bbf649b08e',
  //   cgId: 'microstrategy-xstock',
  // },
  // {
  //   address: '0xa753a7395cae905cd615da0b82a53e0560f250af',
  //   cgId: 'nasdaq-xstock',
  // },
  // {
  //   address: '0xa6a65ac27e76cd53cb790473e4345c46e5ebf961',
  //   cgId: 'netflix-xstock',
  // },
  // {
  //   address: '0xf9523e369c5f55ad72dbaa75b0a9b92b3d8b147e',
  //   cgId: 'novo-nordisk-xstock',
  // },
  // {
  //   address: '0xc845b2894dbddd03858fd2d643b4ef725fe0849d',
  //   cgId: 'nvidia-xstock',
  // },
  // {
  //   address: '0xbee6b69345f376598fe16abd5592c6f844825e66',
  //   cgId: 'open-xstock',
  // },
  // {
  //   address: '0x548308e91ec9f285c7bff05295badbd56a6e4971',
  //   cgId: 'oracle-xstock',
  // },
  // {
  //   address: '0x6d482cec5f9dd1f05ccee9fd3ff79b246170f8e2',
  //   cgId: 'palantir-xstock',
  // },
  // {
  //   address: '0x36c424a6ec0e264b1616102ad63ed2ad7857413e',
  //   cgId: 'pepsico-xstock',
  // },
  // {
  //   address: '0x1ac765b5bea23184802c7d2d497f7c33f1444a9e',
  //   cgId: 'pfizer-xstock',
  // },
  // {
  //   address: '0x02a6c1789c3b4fdb1a7a3dfa39f90e5d3c94f4f9',
  //   cgId: 'philip-morris-xstock',
  // },
  // {
  //   address: '0xa90424d5d3e770e8644103ab503ed775dd1318fd',
  //   cgId: 'procter-gamble-xstock',
  // },
  // {
  //   address: '0xe1385fdd5ffb10081cd52c56584f25efa9084015',
  //   cgId: 'robinhood-xstock',
  // },
  // {
  //   address: '0xdadfb355c6110eda0908740d52c834d6c2bcddc7',
  //   cgId: 'russell-2000-xstock',
  // },
  // {
  //   address: '0xaa28cb97d7f7e172f54dee950743886d2d65447d',
  //   cgId: null,
  // }, IJRx no coingecko data on Eth
  // {
  //   address: '0x4a4073f2eaf299a1be22254dcd2c41727f6f54a2',
  //   cgId: 'salesforce-xstock',
  // },
  // {
  //   address: '0xf6d87e523512704c29e9b7ca3e9e6226bdce3ea1',
  //   cgId: 'schwab-international-equity-xstock',
  // },
  // {
  //   address: '0x90a2a4c76b5d8c0bc892a69ea28aa775a8f2dd48',
  //   cgId: 'sp500-xstock',
  // },
  // {
  //   address: '0x1aad217b8f78dba5e6693460e8470f8b1a3977f3',
  //   cgId: 'strategy-pp-variable-xstock',
  // },
  // {
  //   address: '0x4cbf89ed7bb30b8a860fa86d3c96e9c72931299b',
  //   cgId: 'tbll-xstock',
  // },
  // {
  //   address: '0x8ad3c73f833d3f9a523ab01476625f269aeb7cf0',
  //   cgId: 'tesla-xstock',
  // },
  // {
  //   address: '0xaf072f109a2c173d822a4fe9af311a1b18f83d19',
  //   cgId: 'thermo-fisher-xstock',
  // },
  // {
  //   address: '0xe95ab205e333443d7970336d5fd827ef9ed97608',
  //   cgId: 'ton-xstock',
  // },
  // {
  //   address: '0xfdddb57878ef9d6f681ec4381dcb626b9e69ac86',
  //   cgId: 'tqqq-xstock',
  // },
  // {
  //   address: '0x167a6375da1efc4a5be0f470e73ecefd66245048',
  //   cgId: 'unitedhealth-xstock',
  // },
  // {
  //   address: '0x6d5edeebbc6a4099eb8bb289eb3b80d799f7b28c',
  //   cgId: 'vanguard-total-world-xstock',
  // },
  // {
  //   address: '0xbd730e618bcd88c82ddee52e10275cf2f88a4777',
  //   cgId: 'vanguard-xstock',
  // },
  // {
  //   address: '0x2363fd1235c1b6d3a5088ddf8df3a0b3a30c5293',
  //   cgId: 'visa-xstock',
  // },
  // {
  //   address: '0x7aefc9965699fbea943e03264d96e50cd4a97b21',
  //   cgId: 'walmart-xstock',
  // },
]
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
    if (!chainConfig) throw new Error('Fusion: network not supported')
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
            else throw new Error('Native Transaction Failed')
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
              : 'Failed to submit order to 1inch'
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
