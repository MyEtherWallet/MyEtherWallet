import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { commonGenerator } from './utils'
import { WalletType, type HexPrefixedString } from '../types'
import { hexToBytes } from '@ethereumjs/util'
import BaseEvmWallet from './baseEvmWallet'
import { Hardfork } from '@ethereumjs/common'
import { fromHex, toHex } from 'viem'
import type { Provider as Eip6963Provider } from '@/stores/providerStore.ts'
import type { EIP712TypedData } from '@1inch/limit-order-sdk'

class Web3InjectedWallet extends BaseEvmWallet {
  provider: Eip6963Provider
  address: HexPrefixedString

  constructor(provider: Eip6963Provider, chainId: string) {
    super(chainId)

    this.provider = provider
    this.address = '0x'
  }

  override async connect(): Promise<boolean> {
    try {
      const providerChain = (await this.provider.provider.request({
        method: 'eth_chainId',
      })) as HexPrefixedString

      const account = (await this.provider.provider.request({
        method: 'eth_requestAccounts',
      })) as HexPrefixedString[]

      if (account.length > 0) {
        // Check if the current chainId matches the provider's chainId
        // If not, switch the chain
        if (fromHex(providerChain, 'number') !== Number(this.chainId)) {
          await this.provider.provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: toHex(Number(this.chainId)) }],
          })
        }
        this.address = account[0]
        return true
      }
      return false
    } catch (err) {
      throw err
    }
  }

  override async SendTransaction(
    serializedTx: HexPrefixedString,
  ): Promise<HexPrefixedString> {
    const tx = FeeMarketEIP1559Transaction.fromSerializedTx(
      hexToBytes(serializedTx),
      { common: commonGenerator(BigInt(this.chainId), Hardfork.London) },
    )
    const txObj = tx.toJSON()
    const params = {
      from: this.address,
      ...txObj,
    }

    const txHash = await this.provider.provider.request({
      method: 'eth_sendTransaction',
      params: [params],
    })
    return txHash as HexPrefixedString
  }

  override async SignTypedMessage(
    typedData: EIP712TypedData,
  ): Promise<HexPrefixedString> {
    const signature = await this.provider.provider.request({
      method: 'eth_signTypedData_v4',
      params: [this.address, JSON.stringify(typedData)],
    })
    return signature as HexPrefixedString
  }

  override async getAddress(): Promise<HexPrefixedString> {
    return this.address
  }

  async getLiveAddress(): Promise<string | null> {
    try {
      const accounts = (await this.provider.provider.request({
        method: 'eth_accounts',
      })) as string[]
      return accounts?.[0] ?? null
    } catch {
      return null
    }
  }

  override getWalletType(): WalletType {
    return WalletType.INJECTED
  }

  override async changeNetwork(chainID: number): Promise<boolean> {
    if (chainID !== Number(this.chainId)) {
      const res = await this.provider.provider
        .request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: toHex(chainID) }],
        })
        .then(() => {
          this.chainId = chainID.toString()
          return true
        })
        .catch(() => false)
      return res
    }
    return true
  }

  getProviderInstance(): Eip6963Provider {
    return this.provider
  }

  updateAddress(newAddress: HexPrefixedString): void {
    this.address = newAddress
  }

  override async SignMessage(options: {
    message: string
    options?: unknown
  }): Promise<HexPrefixedString> {
    const signature = await this.provider.provider.request({
      method: 'personal_sign',
      params: [options.message, this.address],
    })
    return signature as HexPrefixedString
  }
}

export default Web3InjectedWallet
