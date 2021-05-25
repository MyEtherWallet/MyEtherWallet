import { WALLET_TYPES } from '../../../../access-wallet/hardware/handlers/configs/configWalletTypes';
import WalletInterface from '@/modules/wallets/utils/WalletInterface.js';
import { mapState } from 'vuex';
import vuexStore from '@/core/store';
import { getBufferFromHex } from '@/modules/access-wallet/hardware/handlers/helpers/helperHex';
import errorHandler from './errorHandler';

class Web3Wallet extends WalletInterface {
  static get errorHandler() {
    return errorHandler;
  }
  constructor(address) {
    super(address, true, WALLET_TYPES.WEB3_WALLET);
    this.$store = vuexStore;
    Object.assign(this, mapState('wallet', ['web3']));
    this.errorHandler = errorHandler;
  }
  signTransaction(tx) {
    tx.from = this.getAddressString();
    return this.web3().eth.sendTransaction(tx).catch(errorHandler);
  }
  signMessage(msg) {
    return new Promise(resolve => {
      this.web3()
        .eth.personal.sign(msg, this.getAddressString())
        .then(hex => {
          resolve(getBufferFromHex(hex));
        })
        .catch(errorHandler);
    });
  }
}
export default Web3Wallet;
