import MEWconnect from '@myetherwallet/mewconnect-web-client';
import store from '@/store';
import ethTx from 'ethereumjs-tx';
import WalletInterface from '@/wallets/WalletInterface';
import { MEW_CONNECT as mewConnectType } from '../../bip44/walletTypes';
import {
  getSignTransactionObject,
  sanitizeHex,
  getBufferFromHex,
  calculateChainIdFromV
} from '../../utils';
import { hashPersonalMessage, toBuffer } from 'ethereumjs-util';
import errorHandler from './errorHandler';

const SIGNALER_URL = 'https://connect.mewapi.io';
const IS_HARDWARE = true;

// TODO: add listener and ui notification on RtcConnectedEvent and RtcClosedEvent
class MEWconnectWalletInterface extends WalletInterface {
  constructor(pubkey, isHardware, identifier, txSigner, msgSigner, mewConnect) {
    super(pubkey, true, identifier);
    this.errorHandler = errorHandler;
    this.txSigner = txSigner;
    this.msgSigner = msgSigner;
    this.isHardware = isHardware;
    this.mewConnect = mewConnect;
  }
  getConnection() {
    return this.mewConnect;
  }
  signTransaction(txParams) {
    return super.signTransaction(txParams, this.txSigner);
  }
  signMessage(msg) {
    return super.signMessage(msg, this.msgSigner);
  }
}

class MEWconnectWallet {
  constructor() {
    this.identifier = mewConnectType;
    this.isHardware = IS_HARDWARE;
    this.mewConnect = new MEWconnect.Initiator();
  }
  async init(qrcode) {
    this.mewConnect.on('codeDisplay', qrcode);
    const txSigner = async tx => {
      let tokenInfo;
      if (tx.data.slice(0, 10) === '0xa9059cbb') {
        tokenInfo = store.getters.network.type.tokens.find(
          entry => entry.address.toLowerCase() === tx.to.toLowerCase()
        );
        if (tokenInfo) {
          tx.currency = {
            symbol: tokenInfo.symbol,
            decimals: tokenInfo.decimals,
            address: tokenInfo.address
          };
        }
      }
      const networkId = tx.chainId;
      return new Promise(resolve => {
        this.mewConnect.sendRtcMessage('signTx', JSON.stringify(tx));
        this.mewConnect.once('signTx', result => {
          tx = new ethTx(sanitizeHex(result));
          const signedChainId = calculateChainIdFromV(tx.v);
          if (signedChainId !== networkId)
            throw new Error(
              'Invalid networkId signature returned. Expected: ' +
                networkId +
                ', Got: ' +
                signedChainId,
              'InvalidNetworkId'
            );
          resolve(getSignTransactionObject(tx));
        });
      });
    };
    const msgSigner = async msg => {
      return new Promise(resolve => {
        const msgHash = hashPersonalMessage(toBuffer(msg));
        this.mewConnect.sendRtcMessage('signMessage', {
          hash: msgHash.toString('hex'),
          text: msg
        });
        this.mewConnect.once('signMessage', data => {
          resolve(getBufferFromHex(sanitizeHex(data.sig)));
        });
      });
    };

    const mewConnect = () => {
      return this.mewConnect;
    };
    const address = await signalerConnect(SIGNALER_URL, this.mewConnect);

    return new MEWconnectWalletInterface(
      sanitizeHex(address),
      this.isHardware,
      this.identifier,
      txSigner,
      msgSigner,
      mewConnect // <- using this.mewConnect here was causing a circular reference and data clone error
    );
  }
}
const createWallet = async qrcode => {
  const _MEWconnectWallet = new MEWconnectWallet();
  const _tWallet = await _MEWconnectWallet.init(qrcode);
  return _tWallet;
};
createWallet.errorHandler = errorHandler;
const signalerConnect = (url, mewConnect) => {
  return new Promise(resolve => {
    mewConnect.initiatorStart(url);
    mewConnect.on('RtcConnectedEvent', () => {
      mewConnect.sendRtcMessage('address', '');
      mewConnect.once('address', data => {
        resolve(data.address);
      });
    });
  });
};

export default createWallet;
