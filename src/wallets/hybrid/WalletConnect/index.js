import WalletConnect from '@walletconnect/browser';
import WalletConnectQRCodeModal from '@walletconnect/qrcode-modal';
import store from '@/store';
import { Transaction } from 'ethereumjs-tx';
import { WALLET_CONNECT as walletConnectType } from '../../bip44/walletTypes';
import { sanitizeHex, getBufferFromHex } from '../../utils';
import errorHandler from './errorHandler';
import commonGenerator from '@/helpers/commonGenerator';
import { Misc } from '@/helpers';
import HybridWalletInterface from '../walletInterface';
import PromiEvent from 'web3-core-promievent';

const BRIDGE_URL = 'https://bridge.walletconnect.org';
const IS_HARDWARE = true;

class WalletConnectWallet {
  constructor() {
    this.identifier = walletConnectType;
    this.isHardware = IS_HARDWARE;
    const tempConnection = new WalletConnect({ bridge: BRIDGE_URL });
    tempConnection._storage.removeSession();
    tempConnection.killSession(); // remove any leftover connections
    this.walletConnect = new WalletConnect({
      bridge: BRIDGE_URL
    });
    this.isKilled = true;
    this.walletConnect.on('disconnect', () => {
      if (!this.isKilled) {
        store._vm.$eventHub.$emit('mewConnectDisconnected');
        store.dispatch('main/clearWallet');
      }
    });

    this.walletConnect.disconnect = () => {
      this.isKilled = true;
      this.walletConnect.killSession();
    };
  }
  init() {
    return new Promise((resolve, reject) => {
      const txSigner = tx => {
        const from = tx.from;
        tx = new Transaction(tx, {
          common: commonGenerator(store.state.main.network)
        });
        const txJSON = tx.toJSON(true);
        txJSON.from = from;
        const prom = PromiEvent(false);
        this.walletConnect
          .sendTransaction(txJSON)
          .then(hash => {
            prom.eventEmitter.emit('transactionHash', hash);
            store.state.main.web3.eth.sendTransaction.method._confirmTransaction(
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
            '0x' + Misc.toBuffer(msg).toString('hex'),
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
          WalletConnectQRCodeModal.open(uri, () => {
            reject(new Error('QR Code Modal closed'));
          });
        })
        .catch(reject);
      this.walletConnect.on('connect', (error, payload) => {
        if (error) {
          return reject(error);
        }
        this.isKilled = false;
        WalletConnectQRCodeModal.close();
        const { accounts } = payload.params[0];
        resolve(
          new HybridWalletInterface(
            sanitizeHex(accounts[0]),
            this.isHardware,
            this.identifier,
            txSigner,
            msgSigner,
            this.walletConnect,
            errorHandler
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
