import { MnemonicWallet } from '@/modules/wallets/utils/software';
import WalletInterface from '@/modules/wallets/utils/WalletInterface';
import { WALLET_TYPES } from '@/modules/access-wallet/hardware/handlers/configs/configWalletTypes';
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
        WALLET_TYPES.KEYSTORE,
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
    this.walletInstance = new WalletInterface(
      privateKey,
      false,
      WALLET_TYPES.PRIV_KEY
    );
  }

  /**
   * Mnemonic Methods
   */
  unlockMnemonicWallet(phrase, password = '') {
    return (this.walletInstance = new MnemonicWallet(phrase, password).then(
      wallet => {
        console.error('wallet', wallet);
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
