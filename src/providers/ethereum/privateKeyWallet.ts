import type { WalletInterface } from '../common/walletInterface'
import {
  ProviderName,
  WalletType,
  type BalanceResponse,
  type GasFeeResponse,
  type HexPrefixedString,
} from '../types'
import {
  type EthereumSignableTransactionParams,
  type EthereumSignableTransactionResult,
  type PostSignedTransaction,
  type PreEthereumTransaction,
} from './types'
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

class PrivateKeyWallet implements WalletInterface {
  privKey: Uint8Array
  chainId: string
  constructor(privateKey: Uint8Array, chainId: string) {
    this.privKey = privateKey
    this.chainId = chainId
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
    feeObj: EthereumSignableTransactionParams,
  ): Promise<EthereumSignableTransactionResult> {
    const { data, onFetchResponse } = useFetchMewApi(`/evm/${this.chainId}/transactions/construct`, 'POST', feeObj)
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
  getAddress(): string {
    return toChecksumAddress(bytesToHex(privateToAddress(this.privKey)))
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
  connect(): Promise<boolean> {
    return Promise.resolve(true)
  }
  disconnect(): Promise<boolean> {
    return Promise.resolve(true)
  }
}

export default PrivateKeyWallet
