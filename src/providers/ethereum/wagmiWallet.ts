import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { commonGenerator } from './utils'
import { WalletType, type HexPrefixedString } from '../types'
import { hexToBytes } from '@ethereumjs/util'
import type { Config, Connector } from '@wagmi/core'
import BaseEvmWallet from './baseEvmWallet'
import { Hardfork } from '@ethereumjs/common'
import { sendTransaction, signMessage } from '@wagmi/core'
import { fromHex, stringToHex } from 'viem'
import { type SendTransactionParameters } from '@wagmi/core'

class WagmiWallet extends BaseEvmWallet {
  connector: Connector
  address: HexPrefixedString
  config: Config
  constructor(connector: Connector, chainId: string, config: Config) {
    super(chainId)

    this.connector = connector
    this.config = config
    this.address = '0x'
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
        if (res.accounts.length > 0) {
          this.address = res.accounts[0]
          return true
        }
        return false
      })
      .catch(err => {
        throw new Error(err)
      })
  }

  override async SendTransaction(
    serializedTx: HexPrefixedString,
  ): Promise<HexPrefixedString> {
    const tx = FeeMarketEIP1559Transaction.fromSerializedTx(
      hexToBytes(serializedTx),
      { common: commonGenerator(BigInt(this.chainId), Hardfork.London) },
    )
    const txObj = tx.toJSON()
    const parseTx = {
      ...txObj,
      accessList:
        txObj.accessList?.map(item => ({
          address: item.address as `0x${string}`,
          storageKeys: item.storageKeys as readonly `0x${string}`[],
        })) ?? undefined,
      maxFeePerGas: fromHex(txObj.maxFeePerGas ?? '0x0', 'bigint'),
      maxPriorityFeePerGas: fromHex(
        txObj.maxPriorityFeePerGas ?? '0x0',
        'bigint',
      ),
      nonce: fromHex(txObj.nonce ?? '0x0', 'number'),
      chainId: fromHex(txObj.chainId ?? '0x0', 'number'),
      value: fromHex(txObj.value ?? '0x0', 'bigint'),
      type: 'eip1559' as const,
    }
    const from = await this.getAddress()
    const params = {
      connector: this.connector,
      account: from,
      ...parseTx,
    } as SendTransactionParameters
    return sendTransaction(
      this.config,
      params as SendTransactionParameters<typeof this.config>,
    ).then((res: HexPrefixedString) => {
      return res
    })
  }


  override async SignMessage(options: {
    message: string
    options?: unknown
  }): Promise<HexPrefixedString> {
    try {
      const message = await signMessage(this.config, {
        connector: this.connector,
        account: this.address,
        message: stringToHex(options.message),
      })
      return Promise.resolve(message)
    } catch (e) {
      return Promise.reject(e)
    }
  }
  override async getAddress(): Promise<HexPrefixedString> {
    const addressArray = await this.connector?.getAccounts()
    return addressArray[0]
  }

  override getWalletType(): WalletType {
    return WalletType.WAGMI
  }
}

export default WagmiWallet
