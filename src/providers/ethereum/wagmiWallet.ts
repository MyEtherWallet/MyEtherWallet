
import {
  WalletType,
  type HexPrefixedString,
} from '../types'

import type { Connector } from 'wagmi'
import BaseEvmWallet from './BaseEVMWallet'

class WagmiWallet extends BaseEvmWallet {
  connector: Connector
  constructor(connector: Connector, chainId: string) {
    super(chainId)
    this.connector = connector
  }
  override disconnect(): Promise<boolean> {
    return this.connector
      .disconnect()
      .then(() => {
        super.disconnect()
        return true
      })
      .catch(() => false)
  }
  override connect(): Promise<boolean> {
    return this.connector
      .connect()
      .then(res => {
        return res.accounts.length > 0
      })
      .catch(err => {
        throw new Error(err)
      })
  }

  override SignMessage(options: {
    message: `0x${string}`
    options: unknown
  }): Promise<HexPrefixedString> {
    console.log(options)
    throw new Error('Method not implemented.')
  }
  override async getAddress(): Promise<string> {
    const addressArray = await this.connector?.getAccounts()
    return addressArray[0]
  }

  override getWalletType(): WalletType {
    return WalletType.WAGMI
  }

}

export default WagmiWallet
