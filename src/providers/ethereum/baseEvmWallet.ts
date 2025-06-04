import type { WalletInterface } from '../common/walletInterface'
import { useChainsStore } from '@/stores/chainsStore'
import { storeToRefs } from 'pinia'
import { type TokenBalancesRaw } from '@/mew_api/types'
import {
  WalletType,
  type GasFeeResponse,
  type HexPrefixedString,
} from '../types'
import {
  type EthereumSignableTransactionParams,
  type EthereumSignableTransactionResult,
  type PostSignedTransaction,
  type PreEthereumTransaction,
} from './types'
import { type EVMTxResponse } from '@/mew_api/types'

import { useFetchMewApi } from '@/composables/useFetchMewApi'

class BaseEvmWallet implements WalletInterface {
  chainId: string
  constructor(chainId: string) {
    this.chainId = chainId
  }
  getGasFee(tx: PreEthereumTransaction): Promise<GasFeeResponse> {
    const { data, onFetchResponse } = useFetchMewApi(`/v1/evm/${this.chainId}/quotes`, 'POST', tx)
    return new Promise((resolve) => {
      onFetchResponse(() => {
        resolve(data.value as GasFeeResponse)
      })
    })
  }
  getSignableTransaction(
    feeObj: EthereumSignableTransactionParams,
  ): Promise<EthereumSignableTransactionResult> {
    const { data, onFetchResponse } = useFetchMewApi(`/v1/evm/${this.chainId}/quotes/${feeObj.quoteId}/unsigned?noInjectErrors=false&priority=${feeObj.priority}`)
    return new Promise((resolve) => {
      onFetchResponse(() => {
        resolve(data.value as EthereumSignableTransactionResult)
      })
    })
  }

  /**
   * 
   * @param serializedTx 
   * currently making library figure out tx type
   * TODO: switch to using the type from the API
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  SignTransaction(serializedTx: HexPrefixedString): Promise<PostSignedTransaction> {
    throw new Error('Method not implemented: SignTransaction')
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  SendTransaction(serializedTx: HexPrefixedString): Promise<HexPrefixedString> {
    throw new Error('Method not implemented: SignTransaction')
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  SignMessage(options: {
    message: `0x${string}`
    options: unknown
  }): Promise<HexPrefixedString> {
    throw new Error('Method not implemented: SignMessage')
  }
  getAddress(): Promise<string> {
    throw new Error('Method not implemented: getAddress')
  }
  getWalletType(): WalletType {
    throw new Error('Method not implemented: getWalletType')
  }
  getProvider(): string {
    const chainStore = useChainsStore()
    const { selectedChain } = storeToRefs(chainStore)
    return selectedChain.value?.name || 'ETHEREUM'
  }
  async getBalance(): Promise<TokenBalancesRaw> {
    const address = await this.getAddress()
    const balanceEndpoint = `/balances/${this.getProvider()}/${address}/?noInjectErrors=false`
    const { data, onFetchResponse } = useFetchMewApi<TokenBalancesRaw>(
      balanceEndpoint,
    )
    return new Promise((resolve) => {
      onFetchResponse(() => {
        resolve({ result: data.value?.result ?? [] })
      })
    })
  }
  broadcastTransaction(signedTx: HexPrefixedString): Promise<string> {
    console.log('called')
    const url = `/v1/evm/${this.chainId}/broadcasts/?noInjectErrors=false`
    const { data, onFetchResponse } = useFetchMewApi<EVMTxResponse>(
      url,
      'POST',
      {
        signedTransaction: signedTx,
      },
      {
        _noRetry: true,
      }
    )
    console.log('even gets here?')
    return new Promise((resolve) => {
      console.log('AAAAAAA')
      onFetchResponse(() => {
        console.log('gets here?', data.value)
        resolve(data.value?.txHash || '')
      })
    })
  }
  connect(): Promise<boolean> {
    return Promise.resolve(true)
  }
  disconnect(): Promise<boolean> {
    throw new Error('Method not implemented: getWalletType')
  }
}

export default BaseEvmWallet
