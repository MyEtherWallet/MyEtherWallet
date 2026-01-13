import { FeeMarketEIP1559Transaction, LegacyTransaction } from '@ethereumjs/tx'
import { commonGenerator } from './utils'
import { Hardfork } from '@ethereumjs/common'
import {
  bytesToHex,
  privateToAddress,
  toChecksumAddress,
  hexToBytes,
} from '@ethereumjs/util'
import BaseEvmWallet from './baseEvmWallet'
import { type PostSignedTransaction } from '../common/types'
import { WalletType, type HexPrefixedString } from '../types'
import { privateKeyToAccount } from 'viem/accounts'
import { toHex } from 'viem'

class PrivateKeyWallet extends BaseEvmWallet {
  private privKey: Uint8Array
  private walletType: WalletType

  constructor(privateKey: Uint8Array, chainId: string, walletType?: WalletType) {
    super(chainId)
    this.privKey = privateKey
    this.walletType = walletType || WalletType.PRIVATE_KEY
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
    return this.walletType
  }
  override async SignMessage(options: {
    message: string
    options?: unknown
  }): Promise<HexPrefixedString> {
    const account = privateKeyToAccount(bytesToHex(this.privKey))
    const sig = await account.signMessage({ message: { raw: toHex(options.message) as HexPrefixedString } })

    return Promise.resolve(sig)
  }
  override getAddress(): Promise<string> {
    return Promise.resolve(
      toChecksumAddress(bytesToHex(privateToAddress(this.privKey))),
    )
  }
}

export default PrivateKeyWallet
