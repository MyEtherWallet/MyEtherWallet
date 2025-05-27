import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { hexToBytes } from '@ethereumjs/util'
import { commonGenerator } from './utils'
import { Hardfork } from '@ethereumjs/common'
import { NetworkNames } from '@enkryptcom/types'
import HWwalletManager from '@enkryptcom/hw-wallets'
import BaseEvmWallet from './baseEvmWallet'
import { chainToEnum } from './trezorSupportedEnum'
import { WalletType, type HexPrefixedString } from '../types'
import type { PostSignedTransaction } from './types'
export class TrezorWallet extends BaseEvmWallet {
  networkName: string
  // trezorEthereum: HWwalletManager
  constructor(chainId: string) {
    super(chainId)
    this.networkName = chainToEnum[chainId] || NetworkNames.Ethereum
    // this.trezorEthereum = new HWwalletManager()
  }

  // override async getAddress(): Promise<string> {
  //   const { address } = await this.trezorEthereum.getAddress()
  //   return address
  // }

  // override connect(): Promise<boolean> {
  //   return this.trezorEthereum
  //     .init()
  //     .then(() => {
  //       return true
  //     })
  //     .catch(() => false)
  // }

  // override getWalletType(): WalletType {
  //   return WalletType.TREZOR
  // }

  // override SignTransaction(serializedTx: HexPrefixedString): Promise<PostSignedTransaction> {
  //   const common = commonGenerator(BigInt(this.chainId), Hardfork.London)
  //   const tx = FeeMarketEIP1559Transaction.fromSerializedTx(hexToBytes(serializedTx), { common })

  //   return this.trezorEthereum
  //     .signTransaction(tx)
  //     .then((res: PostSignedTransaction) => res.signed)
  // }
}