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
  type PostEthereumTransaction,
  type PreEthereumTransaction,
} from './types'
import type { Connector } from 'wagmi'

class WagmiWallet implements WalletInterface {
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
    console.log(tx)
    const client: EthereumProvider =
      (await this.connecter.getProvider()) as EthereumProvider
    client.request({ method: 'eth_accounts' }).then(console.log)
    throw new Error('Method not implemented.')
  }
  SignMessage(options: {
    message: `0x${string}`
    options: unknown
  }): Promise<HexPrefixedString> {
    console.log(options)
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

export default WagmiWallet
