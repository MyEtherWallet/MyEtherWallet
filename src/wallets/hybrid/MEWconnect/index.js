import MEWconnect from '@myetherwallet/mewconnect-web-client';
import ethTx from 'ethereumjs-tx';
import WalletInterface from '@/wallets/WalletInterface';
import { MEW_CONNECT as mewConnectType } from '../../bip44/walletTypes';
import { getSignTransactionObject, sanitizeHex } from '../../utils';
import * as ethUtil from 'ethereumjs-util';

class MEWconnectWalletInterface extends WalletInterface {
  constructor(pubkey, isHardware, identifier, txSigner, msgSigner, mewConnect) {
    super(pubkey, true, identifier);
    this.txSigner = txSigner;
    this.msgSigner = msgSigner;
    this.isHardware = isHardware;
    this.mewConnect = mewConnect;
  }
  on(event, listener) {
    this.mewConnect.on(event, listener);
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
    this.isHardware = true;
    this.mewConnect = new MEWconnect.Initiator();
  }
  async init(url = 'https://connect.mewapi.io') {
    const txSigner = async tx => {
      return new Promise(resolve => {
        this.mewConnect.sendRtcMessage('signTx', JSON.stringify(tx));
        this.mewConnect.on('signTx', result => {
          tx = new ethTx(sanitizeHex(result));
          resolve(getSignTransactionObject(tx));
        });
      });
    };
    const msgSigner = async msg => {
      return new Promise(resolve => {
        const msgHash = ethUtil.hashPersonalMessage(ethUtil.toBuffer(msg));
        this.mewConnect.sendRtcMessage('signMessage', {
          hash: msgHash.toString('hex'),
          text: msg
        });
        this.mewConnect.on('signMessage', data => {
          resolve(data.sig);
        });
      });
    };
    const address = await signalerConnect(url, this.mewConnect);
    return new MEWconnectWalletInterface(
      sanitizeHex(address),
      this.isHardware,
      this.identifier,
      txSigner.bind(this),
      msgSigner.bind(this),
      this
    );
  }
  on(event, listener) {
    this.mewConnect.on(event, listener);
  }
}
const createWallet = () => {
  return new MEWconnectWallet();
};
const signalerConnect = async (url, mewConnect) => {
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
