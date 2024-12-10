import type { WalletInterface } from '../common/walletInterface'
import {
  ProviderName,
  WalletType,
  type BalanceResponse,
  type EthereumProvider,
  type HexPrefixedString,
  type PostTransactionResponse,
  type PreTransactionResponse,
} from '../types'
import {
  SupportedTXType,
  type PostEthereumTransaction,
  type PreEthereumTransaction,
} from './types'
import { FeeMarketEIP1559Transaction, LegacyTransaction } from '@ethereumjs/tx'
import { commonGenerator } from './utils'
import { Hardfork } from '@ethereumjs/common'
import {
  hexToBigInt,
  bytesToHex,
  hashPersonalMessage,
  ecsign,
  toRpcSig,
  privateToAddress,
  toChecksumAddress,
} from '@ethereumjs/util'
import type { Connector } from '@wagmi/vue'

class RainbowWallet implements WalletInterface {
  chainId: string
  connecter: Connector
  constructor(connector: Connector, chainId: string) {
    this.chainId = chainId
    this.connecter = connector
  }
  disconnect(): Promise<boolean> {
    return this.connecter
      .disconnect()
      .then(() => true)
      .catch(() => false)
  }
  connect(): Promise<boolean> {
    return this.connecter
      .connect()
      .then(res => {
        return res.accounts.length > 0
      })
      .catch(err => {
        console.error(err)
        return false
      })
  }
  getSignableTransaction(
    tx: PreEthereumTransaction,
  ): Promise<PreTransactionResponse> {
    console.log('getSignableTransaction', tx)
    throw new Error('Method not implemented.')
  }
  async SignTransaction(
    tx: PostEthereumTransaction,
  ): Promise<PostTransactionResponse> {
    const client: EthereumProvider = await this.connecter.getProvider()
    client.request({})
  }
  SignMessage(options: {
    message: `0x${string}`
    options: unknown
  }): Promise<HexPrefixedString> {
    throw new Error('Method not implemented.')
  }
  getAddress(): string {
    throw new Error('Method not implemented.')
  }

  getWalletType(): WalletType {
    return WalletType.PRIVATE_KEY
  }
  getProvider(): ProviderName {
    return ProviderName.Ethereum
  }
  getBalance(): Promise<BalanceResponse> {
    throw new Error('Method not implemented.')
  }
}

export default RainbowWallet
