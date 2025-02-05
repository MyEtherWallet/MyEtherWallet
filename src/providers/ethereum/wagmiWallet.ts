import type { WalletInterface } from '../common/walletInterface'
import {
  ProviderName,
  WalletType,
  type BalanceResponse,
  type EthereumProvider,
  type GasFeeResponse,
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
  connector: Connector
  address: string | null

  constructor(connector: Connector, chainId: string) {
    this.chainId = chainId
    this.connector = connector
    this.address = null
  }
  disconnect(): Promise<boolean> {
    return this.connector
      .disconnect()
      .then(() => true)
      .catch(() => false)
  }
  connect(): Promise<boolean> {
    return this.connector
      .connect()
      .then(res => {
        if (res.accounts.length > 0) {
          this.address = res.accounts[0]
          return true
        }
        return false
      })
      .catch(err => {
        console.error(err)
        return false
      })
  }
  getGasFee(tx: PreEthereumTransaction): Promise<GasFeeResponse> {
    console.log('getGasFee', tx)
    throw new Error('Method not implemented.')
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
      (await this.connector.getProvider()) as EthereumProvider
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
    if (!this.address) {
      throw new Error('Wallet not connected')
    }
    return this.address
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
