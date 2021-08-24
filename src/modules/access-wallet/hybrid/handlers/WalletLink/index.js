import WalletLink from 'walletlink';

import store from '@/core/store';
import { Transaction } from 'ethereumjs-tx';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import {
  getSignTransactionObject,
  sanitizeHex,
  getBufferFromHex,
  calculateChainIdFromV
} from '@/modules/access-wallet/common/helpers';
import errorHandler from './errorHandler';
import commonGenerator from '@/core/helpers/commonGenerator';
import toBuffer from '@/core/helpers/toBuffer';
import HybridWalletInterface from '../walletInterface';
import walletlink from '@/assets/images/icons/wallets/walletlink.png';

const IS_HARDWARE = false;
const APP_NAME = 'MEW';
const APP_LOGO = 'https://www.myetherwallet.com/img/icons/icon192.png';
class WalletLinkWallet {
  constructor() {
    this.identifier = WALLET_TYPES.WALLET_LINK;
    this.isHardware = IS_HARDWARE;
    this.walletLink = new WalletLink({
      appName: APP_NAME,
      appLogoUrl: APP_LOGO
    });
    this.connection = this.walletLink.makeWeb3Provider(
      'realrpcurlnotrequired',
      0
    );
    this.connection.disconnect = () => {
      this.connection?._storage.clear && this.connection?._storage.clear();
    };
    this.meta = {
      name: 'WalletLink',
      img: {
        type: 'img',
        value: walletlink
      }
    };
  }
  init() {
    return new Promise((resolve, reject) => {
      const txSigner = tx => {
        const networkId = tx.chainId;
        tx = new Transaction(tx, {
          common: commonGenerator(store.getters['global/network'])
        });
        const txJSON = tx.toJSON(true);
        return new Promise((resolve, reject) => {
          this.connection
            .send('eth_signTransaction', txJSON)
            .then(signed => {
              const _tx = new Transaction(signed);
              const signedChainId = calculateChainIdFromV(_tx.v);
              if (signedChainId !== networkId)
                throw new Error(
                  'Invalid networkId signature returned. Expected: ' +
                    networkId +
                    ', Got: ' +
                    signedChainId,
                  'InvalidNetworkId'
                );
              resolve(getSignTransactionObject(_tx));
            })
            .catch(reject);
        });
      };
      const msgSigner = msg => {
        return new Promise((resolve, reject) => {
          this.connection
            .send('personal_sign', [
              '0x' + toBuffer(msg).toString('hex'),
              this.connection.selectedAddress
            ])
            .then(result => {
              resolve(getBufferFromHex(sanitizeHex(result)));
            })
            .catch(reject);
        });
      };
      this.connection
        .enable()
        .then(accounts => {
          resolve(
            new HybridWalletInterface(
              sanitizeHex(accounts[0]),
              this.isHardware,
              this.identifier,
              txSigner,
              msgSigner,
              this.connection,
              errorHandler,
              this.meta
            )
          );
        })
        .catch(reject);
    });
  }
}
const createWallet = async () => {
  const walletLinkWallet = new WalletLinkWallet();
  const _tWallet = await walletLinkWallet.init();
  console.log(_tWallet);
  return _tWallet;
};
createWallet.errorHandler = errorHandler;

export default createWallet;
