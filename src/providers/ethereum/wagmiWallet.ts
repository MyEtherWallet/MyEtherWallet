import type { WalletInterface } from '../common/walletInterface'
import {
  WalletType,
  type EthereumProvider,
  type GasFeeResponse,
  type HexPrefixedString,
  type PostTransactionResponse,
  type PreTransactionResponse,
} from '../types'

import { useChainsStore } from '@/stores/chainsStore'
import { storeToRefs } from 'pinia'
import {
  type PostEthereumTransaction,
  type PreEthereumTransaction,
} from './types'
import type { Connector } from 'wagmi'
import { type TokenBalancesRaw } from '@/mew_api/types'
import { useFetchMewApi } from '@/composables/useFetchMewApi'

class WagmiWallet implements WalletInterface {
  chainId: string
  connector: Connector
  constructor(connector: Connector, chainId: string) {
    this.chainId = chainId
    this.connector = connector
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
        return res.accounts.length > 0
      })
      .catch(err => {
        throw new Error(err)
      })
  }
  getGasFee(tx: PreEthereumTransaction): Promise<GasFeeResponse> {
    const { data, onFetchResponse } = useFetchMewApi(`/evm/${this.chainId}/transactions/quote`, 'POST', tx)
    return new Promise((resolve) => {
      onFetchResponse(() => {
        resolve(data.value as GasFeeResponse)
      })
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
  async getAddress(): Promise<string> {
    const addressArray = await this.connector?.getAccounts()
    return addressArray[0]
  }

  getWalletType(): WalletType {
    return WalletType.WAGMI
  }
  getProvider(): string {
    const chainStore = useChainsStore()
    const { selectedChain } = storeToRefs(chainStore)
    return selectedChain.value?.name || 'ETHEREUM'
  }
  async getBalance(): Promise<TokenBalancesRaw[]> {
    const address = await this.getAddress()
    const balanceEndpoint = `/balances/${this.getProvider()}/${address}/?noInjectErrors=false`
    const { data, onFetchResponse } = useFetchMewApi<TokenBalancesRaw[]>(
      balanceEndpoint,
    )
    return new Promise((resolve) => {
      onFetchResponse(() => {
        resolve(data.value?.result || [])
      })
    })
  }
}

export default WagmiWallet
