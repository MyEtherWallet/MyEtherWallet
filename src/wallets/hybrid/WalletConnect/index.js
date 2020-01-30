import WalletConnect from '@walletconnect/browser';
import WalletConnectQRCodeModal from '@walletconnect/qrcode-modal';
import store from '@/store';
import { Transaction } from 'ethereumjs-tx';
import { WALLET_CONNECT as walletConnectType } from '../../bip44/walletTypes';
import {
  getSignTransactionObject,
  sanitizeHex,
  getBufferFromHex,
  calculateChainIdFromV
} from '../../utils';
import errorHandler from './errorHandler';
import commonGenerator from '@/helpers/commonGenerator';
import { Misc } from '@/helpers';
import HybridWalletInterface from '../walletInterface';

const BRIDGE_URL = 'https://bridge.walletconnect.org';
const IS_HARDWARE = true;

class WalletConnectWallet {
  constructor() {
    this.identifier = walletConnectType;
    this.isHardware = IS_HARDWARE;
    this.walletConnect = new WalletConnect({
      bridge: BRIDGE_URL
    });
  }
  init() {
    return new Promise(resolve => {
      console.log(Transaction);
      const txSigner = tx => {
        const from = tx.from;
        const networkId = tx.chainId;
        tx = new Transaction(tx, {
          common: commonGenerator(store.state.main.network)
        });
        console.log(tx);
        const txJSON = tx.toJSON(true);
        txJSON.from = from;
        return new Promise((resolve, reject) => {
          this.walletConnect
            .signTransaction(txJSON)
            .then(signed => {
              console.log(signed);
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
        console.log(this.walletConnect);
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
      if (!this.walletConnect.connected) {
        this.walletConnect.createSession().then(() => {
          const uri = this.walletConnect.uri;
          // eslint-disable-next-line security/detect-non-literal-fs-filename
          WalletConnectQRCodeModal.open(uri, () => {
            throw new Error('QR Code Modal closed');
          });
        });
      } else {
        resolve(
          new HybridWalletInterface(
            sanitizeHex(this.walletConnect.accounts[0]),
            this.isHardware,
            this.identifier,
            txSigner,
            msgSigner,
            this.walletConnect,
            errorHandler
          )
        );
      }
      this.walletConnect.on('connect', (error, payload) => {
        if (error) {
          throw error;
        }
        WalletConnectQRCodeModal.close();
        const { accounts, chainId } = payload.params[0];
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
        console.log(accounts, chainId, 'onConnect');
      });
    });
  }
  subscribeToEvents() {
    this.walletConnect.on('session_update', (error, payload) => {
      if (error) {
        throw error;
      }
      const { accounts, chainId } = payload.params[0];
      console.log(accounts, chainId, 'onUpdate');
    });

    this.walletConnect.on('disconnect', (error, payload) => {
      if (error) {
        throw error;
      }
      console.log(payload, 'onDisconnect');
    });
  }
}
const createWallet = async () => {
  const walletConnectWallet = new WalletConnectWallet();
  const _tWallet = await walletConnectWallet.init();
  walletConnectWallet.subscribeToEvents();
  return _tWallet;
};
createWallet.errorHandler = errorHandler;

export default createWallet;
