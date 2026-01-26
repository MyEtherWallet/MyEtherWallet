import { type EIP712TypedData } from '@1inch/limit-order-sdk'
import { type BlockchainProviderConnector } from '@1inch/fusion-sdk'
import type BaseEvmWallet from '@/providers/ethereum/baseEvmWallet'
import type { PublicClient } from 'viem'

export type EthereumProvider = { request(...args: unknown[]): Promise<unknown> }

export class Web3ProviderConnector implements BlockchainProviderConnector {
  constructor(
    protected readonly wallet: BaseEvmWallet,
    protected readonly publicClient: PublicClient,
  ) {}

  signTypedData(
    walletAddress: string,
    typedData: EIP712TypedData,
  ): Promise<string> {
    return this.wallet.SignTypedMessage(typedData) as Promise<string>
  }

  async ethCall(contractAddress: string, callData: string): Promise<string> {
    return (
      await this.publicClient.call({
        to: contractAddress as `0x${string}`,
        data: callData as `0x${string}`,
      })
    ).data as string
  }
}
