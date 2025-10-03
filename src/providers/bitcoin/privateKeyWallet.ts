import BaseBtcWallet from "./baseBitcoinWallet";
import type { PostSignedTransaction } from "../common/types";
import { WalletType, type HexPrefixedString } from '../types'
import HDkey from "hdkey";

import { Psbt } from "bitcoinjs-lib";
import { ECPairFactory } from 'ecpair'
import * as tinysecp from 'tiny-secp256k1'
import { INFO_MAP } from "../common/btcInfo";
const ECPair = ECPairFactory(tinysecp)

export default class BitcoinPrivateKeyWallet extends BaseBtcWallet {
  private privateKey: Buffer;

  constructor(chainName: string, hdkeyInstance: HDkey | { privateKey: Buffer }) {
    super(chainName);
    this.privateKey = hdkeyInstance.privateKey!;
  }

  override async SignTransaction(serializedTx: HexPrefixedString): Promise<PostSignedTransaction> {

    const priv = ECPair.fromPrivateKey(this.privateKey, { network: INFO_MAP[this.chainName].network });
    const psbt = Psbt.fromHex(serializedTx, { network: INFO_MAP[this.chainName].network });
    psbt.signAllInputs(priv);
    psbt.finalizeAllInputs();
    const tx = psbt.extractTransaction(false);
    const rsig = tx.toHex();
    return Promise.resolve({
      signed: `0x${rsig}`,
    });

  }

  override getWalletType(): WalletType {
    return WalletType.PRIVATE_KEY;
  }

  override async getAddress(): Promise<string> {
    const priv = ECPair.fromPrivateKey(this.privateKey, { network: INFO_MAP[this.chainName].network });
    const publicKey = priv.publicKey;
    const { address } = INFO_MAP[this.chainName].paymentType({ ...INFO_MAP[this.chainName], pubkey: publicKey },)
    return address!;
  }

}