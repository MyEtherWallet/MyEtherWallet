import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { commonGenerator } from './utils'
import {
  WalletType,
  type HexPrefixedString,
} from '../types'
import {
  hexToBytes
} from '@ethereumjs/util'
import BaseEvmWallet from './baseEvmWallet'
import { Hardfork } from '@ethereumjs/common'
import { fromHex, toHex } from 'viem'
import type { Provider as Eip6963Provider } from '@/stores/providerStore.ts'

class Web3InjectedWallet extends BaseEvmWallet {
  provider: Eip6963Provider
  address: HexPrefixedString

  constructor(provider: Eip6963Provider, chainId: string) {
    super(chainId)

    this.provider = provider
    this.address = '0x'
  }

  override async connect(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const providerChain = await this.provider.provider.request({
          method: 'eth_chainId'
        }) as HexPrefixedString

        const account = await this.provider.provider.request({
          method: 'eth_requestAccounts',
        })

        if (account.length > 0) {
          // Check if the current chainId matches the provider's chainId
          // If not, switch the chain
          if (fromHex(providerChain, 'number') !== Number(this.chainId)) {
            this.provider.provider.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: toHex(Number(this.chainId)) }],
            })
              .then(() => {
                this.address = account[0] as HexPrefixedString
                resolve(true)
              })
          } else {
            this.address = account[0] as HexPrefixedString
            resolve(true)
          }
        } else {
          resolve(false)
        }

      } catch (err) {
        reject(err)
      }

    })
  }

  override async SendTransaction(serializedTx: HexPrefixedString): Promise<HexPrefixedString> {
    const tx = FeeMarketEIP1559Transaction.fromSerializedTx(
      hexToBytes(serializedTx),
      { common: commonGenerator(BigInt(this.chainId), Hardfork.London) })
    const txObj = tx.toJSON();
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override SignMessage(options: {
    message: `0x${string}`
    options: unknown
  }): Promise<HexPrefixedString> {
    throw new Error('Method not implemented.')
  }
  override async getAddress(): Promise<HexPrefixedString> {
    return new Promise((resolve) => {
      resolve(this.address)
    })
  }

  override getWalletType(): WalletType {
    return WalletType.INJECTED
  }

}

export default Web3InjectedWallet
