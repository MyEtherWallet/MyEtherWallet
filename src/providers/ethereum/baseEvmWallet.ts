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

import { FeeMarketEIP1559Transaction, LegacyTransaction } from '@ethereumjs/tx'
import { commonGenerator } from './utils'
import { Hardfork } from '@ethereumjs/common'
import {
  bytesToHex,
  hashPersonalMessage,
  ecsign,
  toRpcSig,
  privateToAddress,
  toChecksumAddress,
  hexToBytes
} from '@ethereumjs/util'

import { useFetchMewApi } from '@/composables/useFetchMewApi'

class BaseEvmWallet implements WalletInterface {
  privKey: Uint8Array
  chainId: string
  constructor(privateKey: Uint8Array, chainId: string) {
    this.privKey = privateKey
    this.chainId = chainId
  }
  getGasFee(tx: PreEthereumTransaction): Promise<GasFeeResponse> {
    const { data, onFetchResponse } = useFetchMewApi(`/v1/evm/${this.chainId}/transactions/quote`, 'POST', tx)
    return new Promise((resolve) => {
      onFetchResponse(() => {
        resolve(data.value as GasFeeResponse)
      })
    })
  }
  getSignableTransaction(
    feeObj: EthereumSignableTransactionParams,
  ): Promise<EthereumSignableTransactionResult> {
    const { data, onFetchResponse } = useFetchMewApi(`/v1/evm/${this.chainId}/transactions/construct`, 'POST', feeObj)
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
  SignTransaction(
    serializedTx: HexPrefixedString,
  ): Promise<PostSignedTransaction> {

    try {
      const common = commonGenerator(BigInt(this.chainId), Hardfork.London)
      const tx = FeeMarketEIP1559Transaction.fromSerializedTx(hexToBytes(serializedTx), { common })
      const signedTx = tx.sign(this.privKey);
      return Promise.resolve({
        signed: bytesToHex(signedTx.serialize())
      })
      // on fail, assume legacy tx
    } catch {
      const common = commonGenerator(BigInt(this.chainId), Hardfork.Berlin)
      const tx = LegacyTransaction.fromSerializedTx(hexToBytes(serializedTx), { common })
      const signedTx = tx.sign(this.privKey)
      return Promise.resolve({
        signed: bytesToHex(signedTx.serialize())
      })
    }

  }
  SignMessage(options: {
    message: `0x${string}`
    options: unknown
  }): Promise<HexPrefixedString> {
    const msgHash = hashPersonalMessage(Buffer.from(options.message, 'utf8'))
    const sig = ecsign(msgHash, this.privKey)
    return Promise.resolve(toRpcSig(sig.v, sig.r, sig.s) as HexPrefixedString)
  }
  getAddress(): Promise<string> {
    return Promise.resolve(toChecksumAddress(bytesToHex(privateToAddress(this.privKey))))
  }
  getWalletType(): WalletType {
    return WalletType.PRIVATE_KEY
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
  broadcastTransaction(signedTx: HexPrefixedString): Promise<string> {
    const url = `/v1/evm/${this.chainId}/transactions/broadcast/?noInjectErrors=false`
    const { onFetchResponse } = useFetchMewApi<EVMTxResponse>(
      url,
      'POST',
      {
        signedTransaction: signedTx,
      },
    )

    return new Promise((resolve) => {
      onFetchResponse(() => {
        resolve(data.value?.result || '')
      })
    })
  }
  connect(): Promise<boolean> {
    return Promise.resolve(true)
  }
  disconnect(): Promise<boolean> {
    return Promise.resolve(true)
  }
}

export default BaseEvmWallet
