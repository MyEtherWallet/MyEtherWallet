import { MnemonicWallet } from '@/modules/access-wallet/software/handlers';
import WalletInterface from '@/modules/access-wallet/common/WalletInterface';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import { unlockKeystore } from '@/modules/access-wallet/common/helpers';
import errorHandler from './errorHandler';

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
        WALLET_TYPES.KEYSTORE,
        '',
        JSON.stringify(obj)
      );
      this.walletInstance.errorHandler = errorHandler;
      return this.walletInstance;
    });
  }

  /**
   * PrivateKey Method
   */
  unlockPrivateKeyWallet(privateKey) {
    this.walletInstance = new WalletInterface(
      privateKey,
      false,
      WALLET_TYPES.PRIV_KEY
    );
    this.walletInstance.errorHandler = errorHandler;
  }

  /**
   * Mnemonic Methods
   */
  unlockMnemonicWallet(phrase, password = '') {
    return (this.walletInstance = MnemonicWallet(phrase, password).then(
      wallet => {
        this.walletInstance = wallet;
        return this.walletInstance;
      }
    ));
  }

  async updateMnemonicPath(path) {
    await this.walletInstance.init(path);
    return this.walletInstance;
  }
}
