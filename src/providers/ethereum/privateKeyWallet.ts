import type { WalletInterface } from '../common/walletInterface'
import {
  ProviderName,
  WalletType,
  type BalanceResponse,
  type GasFeeResponse,
  type HexPrefixedString,
  type PostTransactionResponse,
  type PreTransactionResponse,
} from '../types'
import {
  SupportedTXType,
  type EthereumTransactionWithFeeType,
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

import { useFetchMewApi } from '@/composables/useFetchMewApi'

class PrivateKeyWallet implements WalletInterface {
  privKey: Uint8Array
  chainId: string
  constructor(privateKey: Uint8Array, chainId: string) {
    this.privKey = privateKey
    this.chainId = chainId
  }
  getGasFee(tx: PreEthereumTransaction): Promise<GasFeeResponse> {
    // test data
    console.log(this.chainId)
    const { data, onFetchResponse } = useFetchMewApi(`/evm/${this.chainId}/transactions/quote`, 'POST', tx)
    return new Promise((resolve) => {
      onFetchResponse(() => {
        console.log('onFetchResponse', data.value)
        resolve(data.value as GasFeeResponse)
      })
    })
  }
  getSignableTransaction(
    tx: EthereumTransactionWithFeeType,
  ): Promise<PreTransactionResponse> {
    console.log('getSignableTransaction', tx)
    throw new Error('Method not implemented.')
  }
  SignTransaction(
    tx: PostEthereumTransaction,
  ): Promise<PostTransactionResponse> {
    if (tx.type === SupportedTXType.LEGACY) {
      const common = commonGenerator(hexToBigInt(tx.chainId), Hardfork.Berlin)
      const legacyTx = new LegacyTransaction(tx, {
        common,
      })
      legacyTx.sign(this.privKey)
      return Promise.resolve({
        signed: bytesToHex(legacyTx.serialize()),
        id: tx.id,
        transaction: legacyTx,
      })
    } else if (tx.type === SupportedTXType.EIP1559) {
      const common = commonGenerator(hexToBigInt(tx.chainId), Hardfork.London)
      const modifiedTx: Omit<typeof tx, 'gasPrice'> = {
        ...tx,
      }
      const feeMarketTx = new FeeMarketEIP1559Transaction(modifiedTx, {
        common,
      })
      feeMarketTx.sign(this.privKey)
      return Promise.resolve({
        signed: bytesToHex(feeMarketTx.serialize()),
        id: tx.id,
        transaction: feeMarketTx,
      })
    }
    throw new Error('Unsupported transaction type')
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
