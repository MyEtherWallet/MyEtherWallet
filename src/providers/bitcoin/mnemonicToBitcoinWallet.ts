import HDkey from "hdkey";
import { mnemonicToSeed } from "bip39"

import BitcoinPrivateKeyWallet from "./privateKeyWallet";
import { bip84Segwit, bip84SegwitTest, dogecoinPath, litecoinPath, type DerivationPath } from "@/modules/access/common/configs/configPaths";

export default class BitcoinWallet {
  private mnemonic;
  private extraWord?;
  private basePath;
  private chainName;
  constructor(options: { mnemonic: string, basePath: string, chainName: string, extraWord?: string }) {
    this.mnemonic = options.mnemonic;
    this.extraWord = options.extraWord;
    this.basePath = options.basePath;
    this.chainName = options.chainName;
  }

  async getWallet(index: number): Promise<BitcoinPrivateKeyWallet> {
    const seed = await mnemonicToSeed(this.mnemonic, this.extraWord);
    const hdkey = HDkey.fromMasterSeed(seed);
    const derived = hdkey.derive(`${this.basePath}/${index}'`);
    return new BitcoinPrivateKeyWallet(this.chainName, derived);
  }

  static getSupportedPaths(chainName: string): DerivationPath[] {
    if (chainName === "BITCOIN") {
      return [bip84Segwit]
    } else if (chainName === "BITCOIN_TEST") {
      return [bip84SegwitTest]
    } else if (chainName === "DOGECOIN") {
      return [dogecoinPath]
    } else if (chainName === "LITECOIN") {
      return [litecoinPath]
    }
    return [];
  }
}