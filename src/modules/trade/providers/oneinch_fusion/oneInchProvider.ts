import { type EIP712TypedData } from '@1inch/limit-order-sdk'
import { type BlockchainProviderConnector } from '@1inch/fusion-sdk'

export type EthereumProvider = { request(...args: unknown[]): Promise<unknown> }


export class Web3ProviderConnector implements BlockchainProviderConnector {
    constructor(protected readonly web3Provider: EthereumProvider) { }

    signTypedData(
        walletAddress: string,
        typedData: EIP712TypedData
    ): Promise<string> {
        return this.web3Provider.request({
            method: "eth_signTypedData_v4", params: [walletAddress,
                JSON.stringify(typedData)]
        }) as Promise<string>
    }

    ethCall(contractAddress: string, callData: string): Promise<string> {
        return this.web3Provider.request({
            method: "eth_call", params: [{
                to: contractAddress,
                data: callData
            }]
        }) as Promise<string>
    }
}