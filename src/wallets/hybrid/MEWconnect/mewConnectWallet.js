import MewConnect from '@myetherwallet/mewconnect-web-client';
import * as ethUtil from 'ethereumjs-util';
import EthereumjsTx from 'ethereumjs-tx';

export default class MewConnectWallet {
  constructor(options) {
    this.isHardwareWallet = true;
    this.identifier = 'MEWconnect';
    this.brand = 'MEW';
    this.type = 'hardware';
    this.isHardwareWallet = true;
    this.wallet = null;

    options = options || {};

    this.id = 0;
    this.hdk = null;
    this.numWallets = 0;

    this.defaultOptions = {
      path: "m/44'/60'/0'/0" // trezor default derivation path
    };
    const currentOptions = {
      ...this.defaultOptions,
      ...options
    };

    this.signalerUrl =
      currentOptions.signalerUrl || 'https://connect.mewapi.io';
    this.networkId = 1;

    this.mewConnect = MewConnect.Client.init(null, null);

    this.getAccounts = this.getAccounts.bind(this);
    this.getMultipleAccounts = this.getMultipleAccounts.bind(this);
    this.signTransaction = this.signTransaction.bind(this);
    this.signMessage = this.signMessage.bind(this);

    this.mewConnect.on('RtcConnectedEvent', this.requestAddress.bind(this));
  }

  registerListener(event, listener) {
    this.mewConnect.on(event, listener);
  }

  requestAddress() {
    this.mewConnect.sendRtcMessage('address', '');
  }

  // ============== (Start) EthereumJs-wallet interface methods ======================
  getAddress() {
    if (this.wallet) {
      return this.wallet.address;
    }
    return null;
  }

  getAddressString() {
    if (this.wallet) {
      return ethUtil.toChecksumAddress(this.getAddress());
    }
    return null;
  }

  // ============== (End) EthereumJs-wallet interface methods ======================

  // ============== (Start) Utility methods ======================
  get isHardware() {
    return this.isHardwareWallet;
  }

  // Implementation required
  static async unlock() {
    return new MewConnectWallet();
  }

  // ============== (End) Required Utility methods ======================

  // ============== (Start) wallet usage methods ======================
  // Implementation required
  async getAccounts() {
    return this.wallet.address;
  }

  // Implementation required (if only a single account exists, it should be returned)
  async getMultipleAccounts() {
    return this.wallet.address;
  }

  // todo: figure out why this isn't receiving the response from the app.  (check out the article about using wireshark to debug webrtc)
  signMessage(msgData) {
    return new Promise((resolve, reject) => {
      try {
        const thisMessage = msgData.data ? msgData.data : msgData;
        this.mewConnect.sendRtcMessage('signMessage', thisMessage);
        this.mewConnect.on('signMessage', data => {
          const signedMsg = JSON.parse(data);
          resolve(signedMsg);
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e); // todo replace with actual error handler
        reject(Error('Failed to sign message'));
      }
    });
  }

  // Implementation required
  signTransaction(txData) {
    return new Promise(resolve => {
      this.mewConnect.sendRtcMessage('signTx', JSON.stringify(txData));
      this.mewConnect.on('signTx', data => {
        const rawTransaction = `0x${data}`;
        const tx = new EthereumjsTx(rawTransaction);
        resolve({
          rawTx: JSON.stringify(txData),
          messageHash: tx.hash(),
          v: tx.v,
          r: tx.r,
          s: tx.s,
          rawTransaction: rawTransaction
        });
      });
    });
  }

  // ============== (Start) Internally used methods ======================

  createWallet(address) {
    const wallet = {};
    wallet.address = address;
    wallet.privKey = undefined;
    wallet.pubKey = undefined;
    wallet.path = undefined;
    wallet.hwType = this.identifier;
    wallet.hwTransport = undefined;
    wallet.type = this.brand;
    return wallet;
  }

  signalerConnect(url) {
    return new Promise(resolve => {
      if (!url) {
        this.mewConnect.initiatorStart(this.signalerUrl);
      } else {
        this.mewConnect.initiatorStart(url);
      }
      this.mewConnect.once('address', data => {
        this.wallet = this.createWallet(data.address);
        resolve();
      });
    });
  }

  mewConnectDisconnect() {
    this.mewConnect.disconnectRTC();
  }
}
