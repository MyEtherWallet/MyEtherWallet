import { bytesToHex } from 'web3-utils'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { commonGenerator } from './utils'
import { Hardfork } from '@ethereumjs/common'
import { fromRpcSig, hexToBytes } from '@ethereumjs/util'
import { type PostSignedTransaction } from './types'

import BaseEvmWallet from './baseEvmWallet'
import { WalletType, type HexPrefixedString } from '../types'

import type { PathType } from '@/stores/derivationStore'
import type { NetworkNames } from '@enkryptcom/types'
import { HWwalletType } from '@enkryptcom/types'
import HWwallet from '@enkryptcom/hw-wallets'

export default class EvmHardwareWallet extends BaseEvmWallet {
  private address: HexPrefixedString
  private networkName: string
  private index: string
  private path: PathType
  private walletType: HWwalletType
  private hwWalletInstance: HWwallet

  constructor(
    chainId: string,
    address: HexPrefixedString,
    networkName: string,
    index: string,
    path: PathType,
    walletType: HWwalletType,
    hwWalletInstance: HWwallet,
  ) {
    super(chainId)
    this.address = address
    this.networkName = networkName
    this.index = index
    this.path = path
    this.walletType = walletType
    this.hwWalletInstance = hwWalletInstance as HWwallet
  }

  /**
   *
   * @param serializedTx
   * currently making library figure out tx type
   * TODO: switch to using the type from the API
   */
  override async SignTransaction(
    serializedTx: HexPrefixedString,
  ): Promise<PostSignedTransaction> {
    try {
      const common = commonGenerator(BigInt(this.chainId), Hardfork.London)
      const tx = FeeMarketEIP1559Transaction.fromSerializedTx(
        hexToBytes(serializedTx),
        { common },
      )
      const walletSig = (await this.hwWalletInstance.signTransaction({
        transaction: tx,
        networkName: this.networkName as NetworkNames,
        pathIndex: this.index,
        pathType: {
          basePath: this.path.basePath ?? '',
          path: this.path.path,
        },
        wallet: this.walletType,
      })) as HexPrefixedString
      const rpcSig = fromRpcSig(walletSig)
      const signedTx = tx.addSignature(
        BigInt(rpcSig.v),
        rpcSig.r,
        rpcSig.s,
        true,
      )
      return Promise.resolve({
        signed: bytesToHex(signedTx.serialize()) as HexPrefixedString,
      })
    } catch (e) {
      return Promise.reject(e)
    }
  }

  override getWalletType(): WalletType {
    switch (this.walletType) {
      case HWwalletType.trezor:
        return WalletType.TREZOR
      case HWwalletType.ledger:
        return WalletType.LEDGER
      default:
        throw new Error(`Unsupported hardware wallet type: ${this.walletType}`)
    }
  }

  override getAddress(): Promise<HexPrefixedString> {
    return Promise.resolve(this.address)
  }
}
