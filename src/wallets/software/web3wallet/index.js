import { WEB3_WALLET as web3WalletType } from '../../bip44/walletTypes';
import WalletInterface from '@/wallets/WalletInterface';
import Web3 from 'web3';
import { getBufferFromHex } from '../../utils';

class Web3Wallet extends WalletInterface {
  constructor(address) {
    super(address, true, web3WalletType);
    this.web3 = window.web3.currentProvider
      ? new Web3(window.web3.currentProvider)
      : null;
    if (!this.web3) throw new Error('No Web3 instance found');
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
        .catch(reject);
    });
  }
}
export default Web3Wallet;
