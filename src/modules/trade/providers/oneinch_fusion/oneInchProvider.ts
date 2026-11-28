import { type EIP712TypedData } from '@1inch/limit-order-sdk'
import { type BlockchainProviderConnector } from '@1inch/fusion-sdk'
import type { WalletInterface } from '@/providers/common/walletInterface'
import type { PublicClient } from 'viem'
import { AbandonedSignError } from '@/utils/signSession'

export type EthereumProvider = { request(...args: unknown[]): Promise<unknown> }

export class Web3ProviderConnector implements BlockchainProviderConnector {
  constructor(
    protected readonly wallet: WalletInterface,
    protected readonly publicClient: PublicClient,
    /** True once the caller closed the modal this signature was for. */
    protected readonly isAbandoned: () => boolean = () => false,
  ) {}

  async signTypedData(
    walletAddress: string,
    typedData: EIP712TypedData,
  ): Promise<string> {
    if (!this.wallet.SignTypedMessage) {
      throw new Error('The connected wallet cannot sign typed messages')
    }
    const signature = await this.wallet.SignTypedMessage(typedData)
    // The SDK posts the order to the relayer as soon as this resolves, so a
    // signature for a closed request has to stop here (MEW-2694).
    if (this.isAbandoned()) throw new AbandonedSignError()
    return signature
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
