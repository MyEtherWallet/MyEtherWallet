import WalletConnect from '@walletconnect/client';
import WalletConnectQRCodeModal from '@walletconnect/qrcode-modal';
import store from '@/core/store';
import { Transaction } from '@ethereumjs/tx';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import {
  sanitizeHex,
  getBufferFromHex
} from '@/modules/access-wallet/common/helpers';
import errorHandler from './errorHandler';
import commonGenerator from '@/core/helpers/commonGenerator';
import toBuffer from '@/core/helpers/toBuffer';
import HybridWalletInterface from '../walletInterface';
import PromiEvent from 'web3-core-promievent';

const BRIDGE_URL = 'https://bridge.walletconnect.org';
const IS_HARDWARE = false;
import walletconnect from '@/assets/images/icons/wallets/walletconnect.svg';
class WalletConnectWallet {
  constructor() {
    this.identifier = WALLET_TYPES.WALLET_CONNECT;
    this.isHardware = IS_HARDWARE;
    const walletConnect = new WalletConnect({
      bridge: BRIDGE_URL,
      qrcodeModal: WalletConnectQRCodeModal
    });

    if (
      walletConnect &&
      walletConnect.connected &&
      walletConnect._sessionStorage
    ) {
      walletConnect._sessionStorage.removeSession();
      walletConnect.killSession(); // remove any leftover connections
    }
    this.walletConnect = walletConnect;
    this.walletConnect.on('disconnect', () => {
      store.dispatch('wallet/removeWallet');
    });

    this.walletConnect.disconnect = () => {
      this.walletConnect.killSession();
    };
    this.meta = {
      name: 'Wallet Connect',
      img: {
        type: 'img',
        value: walletconnect
      }
    };
  }
  init() {
    return new Promise((resolve, reject) => {
      const txSigner = tx => {
        const from = tx.from;
        tx = new Transaction(tx, {
          common: commonGenerator(store.getters['global/network'])
        });
        const txJSON = tx.toJSON();
        txJSON.from = from;
        const prom = PromiEvent(false);
        this.walletConnect
          .sendTransaction(txJSON)
          .then(hash => {
            prom.eventEmitter.emit('transactionHash', hash);
            store.state.wallet.web3.eth.sendTransaction.method._confirmTransaction(
              prom,
              hash,
              { params: [txJSON] }
            );
          })
          .catch(err => {
            prom.reject(err);
          });
        return prom.eventEmitter;
      };
      const msgSigner = msg => {
        return new Promise((resolve, reject) => {
          const msgParams = [
            '0x' + toBuffer(msg).toString('hex'),
            sanitizeHex(this.walletConnect.accounts[0])
          ];
          this.walletConnect
            .signPersonalMessage(msgParams)
            .then(result => {
              resolve(getBufferFromHex(sanitizeHex(result)));
            })
            .catch(reject);
        });
      };
      this.walletConnect
        .createSession()
        .then(() => {
          const uri = this.walletConnect.uri;
          // eslint-disable-next-line security/detect-non-literal-fs-filename
          this.walletConnect._qrcodeModal.open(uri, () => {
            reject(new Error('QR Code Modal closed'));
          });
        })
        .catch(reject);
      this.walletConnect.on('connect', (error, payload) => {
        if (error) {
          return reject(error);
        }
        this.walletConnect._qrcodeModal.close();
        const { accounts } = payload.params[0];
        resolve(
          new HybridWalletInterface(
            sanitizeHex(accounts[0]),
            this.isHardware,
            this.identifier,
            txSigner,
            msgSigner,
            this.walletConnect,
            errorHandler,
            this.meta
          )
        );
      });
    });
  }
}
const createWallet = async () => {
  const walletConnectWallet = new WalletConnectWallet();
  const _tWallet = await walletConnectWallet.init();
  return _tWallet;
};
createWallet.errorHandler = errorHandler;

export default createWallet;
