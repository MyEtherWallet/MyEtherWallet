import { MnemonicWallet } from '@/modules/wallets/utils/software';
import WalletInterface from '@/modules/wallets/utils/WalletInterface';
import {
  PRIV_KEY as privKeyType,
  KEYSTORE as keyStoreType
} from '@/modules/wallets/utils/bip44/walletTypes';
import { unlockKeystore } from '@/modules/wallets/utils/helpers.js';

export default class AccessWallet {
  constructor() {
    this.walletInstance = null;
  }

  /**
   * Return wallet instance
   */
  getWalletInstance() {
    return this.walletInstance;
  }

  /**
   * Keystore Method
   */
  unlockKeystoreWallet(file, password) {
    return unlockKeystore(file, password).then(res => {
      // not sure what res is for now
      const obj = {
        file: file,
        name: res.getV3Filename()
      };
      this.walletInstance = new WalletInterface(
        Buffer.from(res.privateKey),
        false,
        keyStoreType,
        '',
        JSON.stringify(obj)
      );
      return this.walletInstance;
    });
  }

  /**
   * PrivateKey Method
   */
  unlockPrivateKeyWallet(privateKey) {
    this.walletInstance = new WalletInterface(privateKey, false, privKeyType);
  }

  /**
   * Mnemonic Method
   */
  unlockMnemonicWallet(phrase, password = '') {
    MnemonicWallet(phrase, password).then(wallet => {
      this.walletInstance = wallet;
      // this.setWalletRoute([wallet]);
      // this.hwWalletInstance = wallet;
      // this.btnCall('mnemonicPath');
    });
  }
}
