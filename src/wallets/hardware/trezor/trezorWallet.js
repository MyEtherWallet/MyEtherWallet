import EthereumjsTx from 'ethereumjs-tx';
import * as ethUtil from 'ethereumjs-util';
import * as HDKey from 'hdkey';
import HardwareWalletInterface from '../hardwareWallet-interface';
import { getDerivationPath, paths } from '../trezor/deterministicWalletPaths';

const TrezorConnect = require('./trezorConnect_v4.js').TrezorConnect;

export default class TrezorWallet extends HardwareWalletInterface {
  constructor(options) {
    super();
    this.identifier = 'TrezorOne';
    this.brand = 'trezor';
    this.wallet = null;

    options = options || {};
    this.addressToWalletMap = {};
    this.addressesToIndexMap = {};
    this.walletsRetrieved = [];

    this.id = 0;
    this.hdk = null;
    this.startindex = 0;

    this.defaultOptions = {
      path: this.getDerivationPath().dpath
    };

    const currentOptions = {
      ...this.defaultOptions,
      ...options
    };

    this.path = currentOptions.path;
    this.accountsLength =
      currentOptions.accountsLength || this.defaultAccountsCount;
    this.accountsOffset =
      currentOptions.accountsOffset || this.defaultAccountsOffset;
    this.networkId = currentOptions.networkId || this.defaultNetworkId;

    this.getAccounts = this.getAccounts.bind(this);
    this.getMultipleAccounts = this.getMultipleAccounts.bind(this);
    this.signTransaction = this.signTransaction.bind(this);
    this.signMessage = this.signMessage.bind(this);
  }

  // ============== (Start) Expected Utility methods ======================

  setActiveAddress(address) {
    this.wallet = this.addressToWalletMap[address];
    this.wallet.address = address;
  }

  static async unlock(options) {
    try {
      const wallet = new TrezorWallet(options);
      await wallet.unlockTrezor();
      return wallet;
    } catch (e) {
      return e;
    }
  }

  get compatibleChains() {
    return paths;
  }

  getDerivationPath(networkShortName) {
    return getDerivationPath(networkShortName);
  }

  changeDerivationPath(path) {
    this.path = path;
    this.addressToWalletMap = {};
    return this.unlockTrezor();
  }

  async changeNetwork(network) {
    try {
      const newPath = getDerivationPath(network.type.name);
      await this.changeDerivationPath(newPath);
      await this.getAccounts();
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  // ============== (End) Expected Utility methods ======================

  // ============== (Start) Implementation of required EthereumJs-wallet interface methods =========
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

  // ============== (End) Implementation of required EthereumJs-wallet interface methods ===========

  // ============== (Start) Implementation of wallet usage methods ======================
  getAccounts() {
    const _this = this;
    if (arguments.length > 1 && typeof arguments[2] === 'function') {
      return _this.getMultipleAccounts(arguments[0], arguments[1]);
    }
    return _this._getAccounts();
  }

  getMultipleAccounts(count, offset) {
    // if the particular wallet does not support multiple accounts this should just return the primary account
    return this._getAccounts(count, offset);
  }

  signTransaction(txData) {
    return this.signTxTrezor(txData);
  }

  signMessage(msgData) {
    const thisMessage = msgData.data ? msgData.data : msgData;
    return this.signMessageTrezor(thisMessage);
  }

  // ============== (End) Implementation of wallet usage methods ======================

  // ============== (Start) Internally used methods ======================

  // (Start) Internal setup methods
  trezorCallback(response) {
    return new Promise((resolve, reject) => {
      if (response.success) {
        this.HWWalletCreate(
          response.publicKey,
          response.chainCode,
          'trezor',
          this.path
        );
        resolve();
      } else {
        reject(Error(response.error));
      }
    });
  }

  unlockTrezor() {
    return new Promise(resolve => {
      // trezor is using the path without change level id
      TrezorConnect.getXPubKey(
        this.path,
        response => {
          resolve(this.trezorCallback(response));
        },
        '1.5.2'
      );
    });
  }

  createWallet(priv, pub, path, hwType, hwTransport) {
    const wallet = {};
    if (typeof priv !== 'undefined') {
      wallet.privKey = priv.length === 32 ? priv : Buffer.from(priv, 'hex');
    }
    wallet.pubKey = pub;
    wallet.path = path;
    wallet.hwType = this.identifier;
    wallet.hwTransport = hwTransport;
    wallet.type = this.brand;
    return wallet;
  }

  HWWalletCreate(publicKey, chainCode, walletType, path) {
    this.hdk = new HDKey();
    this.hdk.publicKey = Buffer.from(publicKey, 'hex');
    this.hdk.chainCode = Buffer.from(chainCode, 'hex');
    this.startindex = 0;
    this.path = path;
    this.setHDAddressesHWWallet(
      this.startindex,
      this.accountsLength,
      walletType
    );
  }

  setHDAddressesHWWallet(start, limit) {
    this.walletsRetrieved = [];
    for (let i = start; i < start + limit; i++) {
      const derivedKey = this.hdk.derive('m/' + i);
      const tempWallet = this.createWallet(
        undefined,
        derivedKey.publicKey,
        this.path + '/' + i
      );
      this.addressToWalletMap[
        this._getAddressForWallet(tempWallet)
      ] = tempWallet;
      this.walletsRetrieved.push(tempWallet);
      this.addressesToIndexMap[i] = this._getAddressForWallet(tempWallet);
      this.walletsRetrieved[this.walletsRetrieved.length - 1].type =
        'addressOnly';
    }
    this.id = 0;
    this.startindex = start + limit;
  }

  // (End) Internal setup methods

  // (Start) Internal methods underlying wallet usage methods
  async _getAccounts(count, offset) {
    return new Promise(resolve => {
      const collect = {};
      if (
        this.addressesToIndexMap[offset] &&
        this.addressesToIndexMap[offset + count - 1]
      ) {
        for (let i = offset; i < offset + count; i++) {
          collect[i] = this.addressesToIndexMap[i];
        }
      } else {
        this.setHDAddresses(offset, count);
        for (let i = offset; i < offset + count; i++) {
          collect[i] = this.addressesToIndexMap[i];
        }
      }
      resolve(collect);
    });
  }

  setHDAddresses(start, limit) {
    this.walletsRetrieved = [];
    for (let i = start; i < start + limit; i++) {
      const tempWallet = this.createWallet(
        this.hdk.derive(this.path + '/' + i)._privateKey
      );
      this.addressToWalletMap[
        this._getAddressForWallet(tempWallet)
      ] = tempWallet;
      this.addressesToIndexMap[i] = this._getAddressForWallet(tempWallet);
      this.walletsRetrieved.push(tempWallet);
    }
    this.id = 0;
    this.startindex = start + limit;
  }

  decimalToHex(dec) {
    return new ethUtil.BN(dec).toString(16);
  }

  signTxTrezor(rawTx) {
    return new Promise((resolve, reject) => {
      const trezorConnectSignCallback = result => {
        if (!result.success) {
          reject(Error(result.error));
          return;
        }
        if (result.v <= 1) {
          // for larger chainId, only signature_v returned. simply recalc signature_v
          result.v += 2 * rawTx.chainId + 35;
        }

        rawTx.v = '0x' + this.decimalToHex(result.v);
        rawTx.r = '0x' + result.r;
        rawTx.s = '0x' + result.s;
        const tx = new EthereumjsTx(rawTx);
        resolve({
          tx: {
            ...rawTx,
            hash: tx.hash().toString('hex')
          },
          rawTransaction: `0x${tx.serialize().toString('hex')}`
        });
      };

      TrezorConnect.signEthereumTx(
        this.wallet.path,
        this.getNakedAddress(rawTx.nonce),
        this.getNakedAddress(rawTx.gasPrice),
        this.getNakedAddress(rawTx.gas),
        this.getNakedAddress(rawTx.to),
        this.getNakedAddress(rawTx.value),
        this.getNakedAddress(rawTx.data),
        +rawTx.chainId,
        trezorConnectSignCallback
      );
    });
  }

  signMessageTrezor(stringMessage) {
    return new Promise((resolve, reject) => {
      const localCallback = function(result) {
        if (!result.success) {
          reject(result.error);
          return;
        }
        const signedMessage = '0x' + result.signature;
        resolve(signedMessage);
      };
      TrezorConnect.ethereumSignMessage(
        this.wallet.path,
        stringMessage,
        localCallback,
        '1.5.2'
      );
    });
  }

  // (End) Internal methods underlying wallet usage methods
  // (Start) Internal utility methods
  getNakedAddress(address) {
    const naked = address.toLowerCase().replace('0x', '');
    if (naked.length % 2 === 0) {
      return naked.toString();
    }
    return '0' + naked.toString();
  }

  _getAddressForWallet(wallet) {
    if (typeof wallet.pubKey === 'undefined') {
      return '0x' + ethUtil.privateToAddress(wallet.privKey).toString('hex');
    }
    return '0x' + ethUtil.publicToAddress(wallet.pubKey, true).toString('hex');
  }

  // (End) Internal utility methods
  // ============== (End) Internally used methods ======================
}
