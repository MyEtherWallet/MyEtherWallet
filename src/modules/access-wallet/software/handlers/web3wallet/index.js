import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import WalletInterface from '@/modules/access-wallet/common/WalletInterface';
import Web3 from 'web3';
import { getBufferFromHex } from '@/modules/access-wallet/common/helpers';
import errorHandler from './errorHandler';
import metamask from '@/assets/images/icons/wallets/metamask.svg';
import { CustomRequestManager } from '@/utils/web3-provider/providers/given-provider';
class Web3Wallet extends WalletInterface {
  static get errorHandler() {
    return errorHandler;
  }
  constructor(address) {
    super(address, true, WALLET_TYPES.WEB3_WALLET);
    this.errorHandler = errorHandler;
    if (!window.ethereum) throw new Error('No Web3 instance found');
    this.web3 = new Web3(new CustomRequestManager(window.ethereum));
    const isMetamask = window.ethereum
      ? window.ethereum.isMetaMask
      : window.web3
      ? window.web3.isMetaMask
      : false;
    this.meta = {
      name: 'Web3 Wallet',
      img: {
        type: isMetamask ? 'img' : 'mew-icon',
        value: isMetamask ? metamask : 'wallet'
      }
    };
  }
  signTransaction(tx) {
    tx.from = this.getAddressString();
    return this.web3.eth.sendTransaction(tx);
  }
  signMessage(msg) {
    return new Promise(resolve => {
      this.web3.eth.personal
        .sign(msg, this.getAddressString())
        .then(hex => {
          resolve(getBufferFromHex(hex));
        })
        .catch(errorHandler);
    });
  }
}
export default Web3Wallet;
