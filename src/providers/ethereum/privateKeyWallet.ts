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
  hexToBytes,
} from '@ethereumjs/util'
import BaseEvmWallet from './baseEvmWallet'
import { type PostSignedTransaction } from './types'
import { WalletType, type HexPrefixedString } from '../types'

import { useWalletStore } from '@/stores/walletStore'
import { useRouter } from 'vue-router'
import { ROUTES_MAIN } from '@/router/routeNames'

class PrivateKeyWallet extends BaseEvmWallet {
  private privKey: Uint8Array

  constructor(privateKey: Uint8Array, chainId: string) {
    super(chainId)
    this.privKey = privateKey
  }

  /**
   *
   * @param serializedTx
   * currently making library figure out tx type
   * TODO: switch to using the type from the API
   */
  override SignTransaction(
    serializedTx: HexPrefixedString,
  ): Promise<PostSignedTransaction> {
    try {
      const common = commonGenerator(BigInt(this.chainId), Hardfork.London)
      const tx = FeeMarketEIP1559Transaction.fromSerializedTx(
        hexToBytes(serializedTx),
        { common },
      )
      const signedTx = tx.sign(this.privKey)
      return Promise.resolve({
        signed: bytesToHex(signedTx.serialize()),
      })
      // on fail, assume legacy tx
    } catch {
      const common = commonGenerator(BigInt(this.chainId), Hardfork.Berlin)
      const tx = LegacyTransaction.fromSerializedTx(hexToBytes(serializedTx), {
        common,
      })
      const signedTx = tx.sign(this.privKey)
      return Promise.resolve({
        signed: bytesToHex(signedTx.serialize()),
      })
    }
  }

  override getWalletType(): WalletType {
    return WalletType.PRIVATE_KEY
  }
  override SignMessage(options: {
    message: `0x${string}`
    options: unknown
  }): Promise<HexPrefixedString> {
    const msgHash = hashPersonalMessage(Buffer.from(options.message, 'utf8'))
    const sig = ecsign(msgHash, this.privKey)
    return Promise.resolve(toRpcSig(sig.v, sig.r, sig.s) as HexPrefixedString)
  }
  override getAddress(): Promise<string> {
    return Promise.resolve(
      toChecksumAddress(bytesToHex(privateToAddress(this.privKey))),
    )
  }
  override disconnect(): Promise<boolean> {
    const walletStore = useWalletStore()
    const router = useRouter()
    walletStore.removeWallet()
    router.push({ name: ROUTES_MAIN.HOME.NAME })
    return Promise.resolve(true)
  }
}

export default PrivateKeyWallet
