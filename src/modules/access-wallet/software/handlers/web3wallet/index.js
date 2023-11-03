import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import WalletInterface from '@/modules/access-wallet/common/WalletInterface';
import Web3 from 'web3';
import { getBufferFromHex } from '@/modules/access-wallet/common/helpers';
import errorHandler from './errorHandler';
import metamask from '@/assets/images/icons/wallets/metamask.svg';
import enkrypt from '@/assets/images/icons/enkrypt/icon-enkrypt-colored.svg';
import { CustomRequestManager } from '@/utils/web3-provider/providers/given-provider';
import store from '@/core/store';
class Web3Wallet extends WalletInterface {
  static get errorHandler() {
    return errorHandler;
  }
  constructor(address) {
    super(address, true, WALLET_TYPES.WEB3_WALLET);
    this.errorHandler = errorHandler;
    if (!window.ethereum) throw new Error('No Web3 instance found');
    const isEIP6963 = store.state.external.selectedEIP6963Info;
    const provider = isEIP6963
      ? store.state.external.selectedEIP6963Provider
      : window.ethereum;
    this.web3 = new Web3(new CustomRequestManager(provider));
    const isMetamask = provider?.isMetaMask && !provider?.isEnkrypt;
    const isEnkrypt = provider?.isMetaMask && provider?.isEnkrypt;

    this.meta = {
      name: isEIP6963 ? isEIP6963.name : 'Web3 Wallet',
      img: {
        type: isEIP6963 || isMetamask || isEnkrypt ? 'img' : 'mew-icon',
        value: isEIP6963
          ? isEIP6963.icon
          : isMetamask
          ? metamask
          : isEnkrypt
          ? enkrypt
          : 'wallet'
      }
    };
  }
  signTransaction(tx) {
    tx.from = this.getAddressString();
    return this.web3.eth.sendTransaction(tx);
  }
  signMessage(msg) {
    return new Promise((resolve, reject) => {
      this.web3.eth.personal
        .sign(msg, this.getAddressString())
        .then(hex => {
          resolve(getBufferFromHex(hex));
        })
        .catch(err => {
          errorHandler(err);
          reject(err);
        });
    });
  }
}
export default Web3Wallet;
