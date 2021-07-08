import MEWconnect from '@myetherwallet/mewconnect-web-client';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import {
  sanitizeHex,
  getSignTransactionObject,
  calculateChainIdFromV
} from '@/modules/access-wallet/common/helpers';
import errorHandler from './errorHandler';
import HybridWalletInterface from '../walletInterface';
import mewwallet from '@/assets/images/icons/wallets/mewwallet.svg';
import store from '@/core/store';
import { Transaction } from 'ethereumjs-tx';
import commonGenerator from '@/core/helpers/commonGenerator';
const IS_HARDWARE = true;
class MEWconnectWallet {
  constructor() {
    this.identifier = WALLET_TYPES.MEW_CONNECT;
    this.isHardware = IS_HARDWARE;
    this.meta = {
      name: 'MEW Wallet',
      img: {
        type: 'img',
        value: mewwallet
      }
    };
  }
  async init() {
    const connection = new MEWconnect.Initiator({ newPopupCreator: true });
    this.mewConnect = await connection.createWalletOnly(
      store.getters['global/network']
    );
    this.mewConnect.disconnect = () => {
      this.mewConnect.mewConnect.disconnectRTC();
    };
    this.mewConnect.mewConnect.on('RtcClosedEvent', () => {
      if (this.mewConnect.mewConnect.getConnectonState()) {
        store.dispatch('wallet/removeWallet');
      }
    });
    const txSigner = async tx => {
      let tokenInfo;
      if (
        tx.data.slice(0, 10) === '0xa9059cbb' ||
        tx.data.slice(0, 10) === '0x095ea7b3'
      ) {
        tokenInfo = store.getters['external/contractToToken'](tx.to);
        if (tokenInfo) {
          tx.currency = {
            symbol: tokenInfo.symbol,
            decimals: tokenInfo.decimals,
            address: tokenInfo.contract
          };
        }
      }
      const networkId = tx.chainId;
      return new Promise((resolve, reject) => {
        if (!tx.gasLimit) {
          tx.gasLimit = tx.gas;
        }
        this.mewConnect.mewConnect.sendRtcMessage('signTx', JSON.stringify(tx));
        this.mewConnect.mewConnect.once('signTx', result => {
          this.mewConnect.mewConnect.removeAllListeners('reject');
          tx = new Transaction(sanitizeHex(result), {
            common: commonGenerator(store.getters['global/network'])
          });
          const signedChainId = calculateChainIdFromV(tx.v);
          if (signedChainId !== networkId)
            return reject(
              new Error(
                'Invalid networkId signature returned. Expected: ' +
                  networkId +
                  ', Got: ' +
                  signedChainId,
                'InvalidNetworkId'
              )
            );
          resolve(getSignTransactionObject(tx));
        });
        this.mewConnect.mewConnect.once('reject', () => {
          this.mewConnect.mewConnect.removeAllListeners('signTx');
          reject({ reject: true });
        });
      });
    };
    const msgSigner = this.mewConnect.msgSigner;
    const address = '0x' + this.mewConnect.publicKey.toString('hex');

    return new HybridWalletInterface(
      sanitizeHex(address),
      this.isHardware,
      this.identifier,
      txSigner,
      msgSigner,
      this.mewConnect,
      errorHandler,
      this.meta
    );
  }
}
const createWallet = async () => {
  const _MEWconnectWallet = new MEWconnectWallet();
  const _tWallet = await _MEWconnectWallet.init();
  return _tWallet;
};
createWallet.errorHandler = errorHandler;
export default createWallet;
