import MEWconnect from '@myetherwallet/mewconnect-web-client';
import store from '@/store';
import { Transaction } from 'ethereumjs-tx';
import { MEW_CONNECT as mewConnectType } from '../../bip44/walletTypes';
import {
  getSignTransactionObject,
  sanitizeHex,
  getBufferFromHex,
  calculateChainIdFromV
} from '../../utils';
// import { hashPersonalMessage } from 'ethereumjs-util';
import errorHandler from './errorHandler';
import commonGenerator from '@/helpers/commonGenerator';
import toBuffer from '@/helpers/toBuffer';
import HybridWalletInterface from '../walletInterface';

const IS_HARDWARE = true;
// let thisAddress = null;
// import { EventBus } from '@/plugins/eventBus';
// import WalletLink from 'walletlink';

class MEWconnectWallet {
  constructor() {
    this.identifier = mewConnectType;
    this.isHardware = IS_HARDWARE;
    this.MEWconnect = new MEWconnect.Provider();
    this.connection = this.MEWconnect.makeWeb3Provider();
    // this.connection._relay.storage.clear();
    // this.connection.disconnect = () => {
    //   // this.connection._relay.storage.clear();
    // };
  }
  init() {
    return new Promise((resolve, reject) => {
      const txSigner = tx => {
        const networkId = tx.chainId;
        tx = new Transaction(tx, {
          common: commonGenerator(store.state.wallet.network)
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
              errorHandler
            )
          );
        })
        .catch(reject);
    });
  }
}
const createWallet = async () => {
  const meWconnectWallet = new MEWconnectWallet();
  const _tWallet = await meWconnectWallet.init();
  return _tWallet;
};
createWallet.errorHandler = errorHandler;

export default createWallet;
