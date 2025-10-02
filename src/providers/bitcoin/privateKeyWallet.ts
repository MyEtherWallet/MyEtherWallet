
import { bufferToHex } from "@/modules/access/common/helpers";
import { getPublicKey, signAsync, verify } from "@noble/secp256k1"
import { hexToBytes, bytesToHex } from "web3-utils";
import { hexToBuffer } from "@/utils/hexToBuffer";
import BaseBtcWallet from "./baseBitcoinWallet";
import type { PostSignedTransaction } from "../common/types";
import { WalletType, type HexPrefixedString } from '../types'
import HDkey from "hdkey";

import { INFO_MAP } from "../common/btcInfo";


export default class BitcoinPrivateKeyWallet extends BaseBtcWallet {
  private privateKey: Buffer;

  constructor(chainName: string, hdkeyInstance: HDkey | { privateKey: Buffer }) {
    super(chainName);
    this.privateKey = hdkeyInstance.privateKey!;
  }


  private _verify(message: string, signature: string): boolean {
    const publicKey = getPublicKey(this.privateKey);
    return verify(hexToBytes(signature), hexToBytes(message), publicKey);
  }

  override async SignTransaction(serializedTx: HexPrefixedString): Promise<PostSignedTransaction> {
    const msgHash = hexToBytes(serializedTx);
    const rsig = await signAsync(msgHash, hexToBytes(bufferToHex(this.privateKey)), { prehash: false });
    if (!this._verify(bytesToHex(msgHash), bytesToHex(rsig))) {
      throw new Error('Signature verification failed');
    }
    return Promise.resolve({
      signed: bytesToHex(rsig) as HexPrefixedString,
    });

  }

  override getWalletType(): WalletType {
    return WalletType.PRIVATE_KEY;
  }

  override async getAddress(): Promise<string> {
    const { address } = INFO_MAP[this.chainName].paymentType({ ...INFO_MAP[this.chainName], pubkey: hexToBuffer(bytesToHex(getPublicKey(this.privateKey, true))) },)
    return address!;
  }

}