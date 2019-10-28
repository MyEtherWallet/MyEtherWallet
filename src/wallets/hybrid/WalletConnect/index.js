import WalletConnect from '@walletconnect/browser';
import WalletConnectQRCodeModal from '@walletconnect/qrcode-modal';

import store from '@/store';
import { Transaction } from 'ethereumjs-tx';
import WalletInterface from '@/wallets/WalletInterface';
import { WALLET_CONNECT as walletConnectType } from '../../bip44/walletTypes';
import {
  getSignTransactionObject,
  sanitizeHex,
  getBufferFromHex,
  calculateChainIdFromV
} from '../../utils';
import { hashPersonalMessage, toBuffer } from 'ethereumjs-util';
import errorHandler from './errorHandler';
import commonGenerator from '@/helpers/commonGenerator';

const BRIDGE_URL = 'https://bridge.walletconnect.org';
const IS_HARDWARE = true;

class MEWconnectWalletInterface extends WalletInterface {
  constructor(
    pubkey,
    isHardware,
    identifier,
    txSigner,
    msgSigner,
    walletConnect
  ) {
    super(pubkey, true, identifier);
    this.errorHandler = errorHandler;
    this.txSigner = txSigner;
    this.msgSigner = msgSigner;
    this.isHardware = isHardware;
    this.walletConnect = walletConnect;
  }
  getConnection() {
    return this.walletConnect;
  }
  signTransaction(txParams) {
    return super.signTransaction(txParams, this.txSigner);
  }
  signMessage(msg) {
    return super.signMessage(msg, this.msgSigner);
  }
}

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
      const txSigner = tx => {
        const from = tx.from;
        tx = new Transaction(tx, {
          common: commonGenerator(store.state.network)
        });
        const txJSON = tx.toJSON(true);
        txJSON.from = from;
        return this.walletConnect.sendTransaction(txJSON);
      };
      const msgSigner = msg => {
        return new Promise(resolve => {});
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
          new MEWconnectWalletInterface(
            sanitizeHex(this.walletConnect.accounts[0]),
            this.isHardware,
            this.identifier,
            txSigner,
            msgSigner,
            this.walletConnect
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
          new MEWconnectWalletInterface(
            sanitizeHex(accounts[0]),
            this.isHardware,
            this.identifier,
            txSigner,
            msgSigner,
            this.walletConnect
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
      this.walletConnect;
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
