
import BaseEvmWallet from './baseEvmWallet'
import { WalletType, type HexPrefixedString } from '../types'

import type { PathType } from '@/stores/derivationStore'
import type { HWwalletType } from '@enkryptcom/types'

class EvmTrezorWallet extends BaseEvmWallet {
  private address: HexPrefixedString
  private networkName: string
  private index: string
  private path: PathType
  private walletType: HWwalletType

  constructor(chainId: string, address: HexPrefixedString, networkName: string, index: string, path: PathType, walletType: HWwalletType) {
    super(chainId)
    this.address = address
    this.networkName = networkName
    this.index = index
    this.path = path
    this.walletType = walletType
  }

  override getWalletType(): WalletType {
    return WalletType.TREZOR
  }

  override getAddress(): Promise<HexPrefixedString> {
    return Promise.resolve(this.address)
  }
}

export default EvmTrezorWallet
