import EthereumjsTx from 'ethereumjs-tx';
import * as ethUtil from 'ethereumjs-util';
import * as HDKey from 'hdkey';
import HardwareWalletInterface from '../hardwareWallet-interface';
import { getDerivationPath, paths } from './deterministicWalletPaths';

import { DigitalBitboxUsb } from './digitalBitboxUsb';
import { DigitalBitboxEth } from './digitalBitboxEth';
import { u2f } from '../utils/u2f-api';

export default class DigitalBitboxWallet extends HardwareWalletInterface {
  constructor(options) {
    super();
    this.identifier = 'DigitalBitbox';
    this.brand = 'digitalBitbox';
    this.wallet = null;
    this.transport = null;

    options = options || {};
    this.addressToWalletMap = {};
    this.addressesToIndexMap = {};
    this.walletsRetrieved = [];

    this.id = 0;
    this.hdk = null;
    this.numWallets = 0;

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
      const digitalBitboxSecret = options.password || '';
      delete options['password'];
      const wallet = new DigitalBitboxWallet(options);
      await wallet.unlockBitbox(digitalBitboxSecret);
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
    return this.signTxDigitalBitbox(txData);
  }

  signMessage() {
    // let thisMessage = msgData.data ? msgData.data : msgData;
    return null;
  }

  // ============== (End) Implementation of wallet usage methods ======================

  changeDerivationPath(path) {
    this.path = path;
    return this.unlockBitbox();
  }

  // ============== (Start) Internally used methods ======================

  // (Start) Internal setup methods
  digitalBitboxCallback(result, error) {
    return new Promise((resolve, reject) => {
      if (typeof result !== 'undefined') {
        this.HWWalletCreate(
          result['publicKey'],
          result['chainCode'],
          'digitalBitbox',
          this.path
        );
        resolve();
      } else {
        reject(error);
      }
    });
  }

  unlockBitbox(digitalBitboxSecret) {
    return new Promise(resolve => {
      this.transport = new DigitalBitboxUsb();
      const app = new DigitalBitboxEth(this.transport, digitalBitboxSecret);
      const path = this.path;
      app.getAddress(path, (result, error) => {
        resolve(this.digitalBitboxCallback(result, error));
      });
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
    this.numWallets = 0;
    this.path = path;
    this.setHDAddressesHWWallet(
      this.numWallets,
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
    this.numWallets = start + limit;
  }

  // (End) Internal setup methods

  AddRemoveHDAddresses(isAdd) {
    if (isAdd)
      this.setHDAddressesHWWallet(this.numWallets, this.accountsLength);
    else
      this.setHDAddressesHWWallet(
        this.numWallets - 2 * this.accountsLength,
        this.accountsLength
      );
  }

  setHDWallet() {
    this.wallet = this.walletsRetrieved[this.id];
    this.wallet.type = 'default';
  }

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
    this.numWallets = start + limit;
  }

  decimalToHex(dec) {
    return new ethUtil.BN(dec).toString(16);
  }

  signTxDigitalBitbox(rawTx) {
    return new Promise((resolve, reject) => {
      const localCallback = (result, error) => {
        if (typeof error !== 'undefined') {
          error = error.errorCode ? u2f.getErrorByCode(error.errorCode) : error;
          reject(error);
          return;
        }
        // uiFuncs.notifier.info("The transaction was signed but not sent. Click the blue 'Send Transaction' button to continue.");
        rawTx.v = this.sanitizeHex(result['v']);
        rawTx.r = this.sanitizeHex(result['r']);
        rawTx.s = this.sanitizeHex(result['s']);
        const eTx_ = new EthereumjsTx(rawTx);
        rawTx.rawTx = JSON.stringify(rawTx);
        rawTx.signedTx = this.sanitizeHex(eTx_.serialize().toString('hex'));
        rawTx.isError = false;
        resolve(rawTx);
      };
      // uiFuncs.notifier.info("Touch the LED for 3 seconds to sign the transaction. Or tap the LED to cancel.");
      const app = new DigitalBitboxEth(this.transport, '');
      const tx = new EthereumjsTx(rawTx);
      app.signTransaction(rawTx.path, tx, localCallback);
    });
  }

  sanitizeHex(hex) {
    hex = hex.substring(0, 2) === '0x' ? hex.substring(2) : hex;
    if (hex === '') return '';
    return '0x' + this.padLeftEven(hex);
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
