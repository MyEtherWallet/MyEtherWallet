import { bytesToHex } from 'web3-utils';

import { WalletType, type HexPrefixedString } from '../types'

import type { PathType } from '@/stores/derivationStore'
import { HWwalletType, NetworkNames } from '@enkryptcom/types'
import HWwallet from '@enkryptcom/hw-wallets'
import BaseBtcWallet from './baseBitcoinWallet'
import { hexToBuffer } from '@/utils/hexToBuffer'
import {
  type PostSignedTransaction,
} from '../common/types'

import { INFO_MAP } from "../common/btcInfo";
import { Psbt } from 'bitcoinjs-lib'
import { chainToEnum } from '../ethereum/chainToEnum'
import reverseBytes from '@/utils/reverseBytes'
import { NODE_MAP } from '../common/btcInfo';

export default class BtcHardwareWallet extends BaseBtcWallet {
  private address: HexPrefixedString
  private networkName: string
  private index: string
  private path: PathType
  private walletType: HWwalletType
  private hwWalletInstance: HWwallet

  constructor(
    address: HexPrefixedString,
    networkName: string,
    index: string,
    path: PathType,
    walletType: HWwalletType,
    hwWalletInstance: HWwallet,
  ) {
    super(networkName)
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
      const psbt = Psbt.fromHex(serializedTx, { network: INFO_MAP[this.getProvider()].network });
      const transactionObj: { psbtTx: Psbt; rawTxs: string[] } = { psbtTx: psbt, rawTxs: [] }
      if (this.getWalletType() === WalletType.LEDGER) {
        const fetchTxs = psbt.txInputs.map(async (u) => {
          const txID = bytesToHex(reverseBytes(u.hash)).replace('0x', '')
          const isSS = this.getProvider() === 'DOGECOIN' || this.getProvider() === 'LITECOIN'
          const node = NODE_MAP[this.getProvider()]
          const url = isSS ? `${node}/api/v1/${txID}/raw` : `${node}transaction/${txID}/raw`
          const response = await fetch(url)
          const rawTx = await response.json()
          return rawTx.result as string;
        })
        const txIds = await Promise.all(fetchTxs)
        transactionObj.rawTxs = txIds as string[]
      }
      const walletSigned = (await this.hwWalletInstance.signTransaction({
        transaction: { ...transactionObj },
        networkName: (chainToEnum[this.getProvider()] ?? "BTC") as unknown as NetworkNames,
        pathIndex: this.index,
        pathType: {
          basePath: this.path.basePath ?? '',
          path: this.path.path,
        },
        wallet: this.walletType,
      }))
      return Promise.resolve(
        { signed: `0x${walletSigned}` as HexPrefixedString, }
      )
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
    const { address } = INFO_MAP[this.getProvider()].paymentType({ ...INFO_MAP[this.getProvider()], pubkey: hexToBuffer(this.address) })
    return Promise.resolve(address?.toString() as HexPrefixedString)
  }
}
