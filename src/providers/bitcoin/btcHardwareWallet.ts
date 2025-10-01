
import { WalletType, type HexPrefixedString } from '../types'

import type { PathType } from '@/stores/derivationStore'
// import type { NetworkNames } from '@enkryptcom/types'
import { HWwalletType } from '@enkryptcom/types'
import HWwallet from '@enkryptcom/hw-wallets'
import BaseBtcWallet from './baseBitcoinWallet'
import { hexToBuffer } from '@/utils/hexToBuffer'

import { bitcoinInfo, bitcoinTestInfo, dogecoinInfo, litecoinInfo, type InfoTemplate } from "../common/btcInfo";

const INFO_MAP: Record<string, InfoTemplate> = {
  "BITCOIN": bitcoinInfo,
  "BITCOIN_TEST": bitcoinTestInfo,
  "DOGECOIN": dogecoinInfo,
  "LITECOIN": litecoinInfo
};


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
  // override async SignTransaction(
  //   serializedTx: HexPrefixedString,
  // ): Promise<PostSignedTransaction> {
  //   try {
  //     const common = commonGenerator(BigInt(this.chainId), Hardfork.London)
  //     const tx = FeeMarketEIP1559Transaction.fromSerializedTx(
  //       hexToBytes(serializedTx),
  //       { common },
  //     )
  //     const walletSig = (await this.hwWalletInstance.signTransaction({
  //       transaction: tx,
  //       networkName: this.networkName as NetworkNames,
  //       pathIndex: this.index,
  //       pathType: {
  //         basePath: this.path.basePath ?? '',
  //         path: this.path.path,
  //       },
  //       wallet: this.walletType,
  //     })) as HexPrefixedString
  //     const rpcSig = fromRpcSig(walletSig)
  //     const signedTx = tx.addSignature(
  //       BigInt(rpcSig.v),
  //       rpcSig.r,
  //       rpcSig.s,
  //       true,
  //     )
  //     return Promise.resolve({
  //       signed: bytesToHex(signedTx.serialize()) as HexPrefixedString,
  //     })
  //   } catch (e) {
  //     return Promise.reject(e)
  //   }
  // }

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
    const { address } = INFO_MAP[this.walletType].paymentType({ ...INFO_MAP[this.walletType], pubkey: hexToBuffer(this.address) })
    return Promise.resolve(address?.toString() as HexPrefixedString)
  }
}
