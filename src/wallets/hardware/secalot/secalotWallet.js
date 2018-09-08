import EthereumjsTx from 'ethereumjs-tx';
import * as ethUtil from 'ethereumjs-util';
import * as HDKey from 'hdkey';
import HardwareWalletInterface from '../hardwareWallet-interface';
import { getDerivationPath, paths } from './deterministicWalletPath';
import { Misc } from '@/helpers';
import SecalotEth from './secalotEth';
import SecalotUsb from './secalotUsb';
import { u2f } from '../utils/u2f-api';

export default class SecalotWallet extends HardwareWalletInterface {
  constructor(opts) {
    super();
    this.identifier = 'Secalot';
    this.brand = 'secalot';
    this.wallet = null;
    this.transport = null;

    const options = opts || {};
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

  setActiveAddress(address) {
    this.wallet = this.addressToWalletMap[address];
    this.wallet.address = address;
  }

  static async unlock(options) {
    try {
      const secalotSecret = options.password || '';
      delete options['password'];
      const wallet = new SecalotWallet(options);
      await wallet.unlockSecalot(secalotSecret);
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
    return this.signTxSecalot(txData);
  }

  signMessage(msgData) {
    const thisMessage = msgData.data ? msgData.data : msgData;
    const app = new SecalotEth(this.transport);
    return new Promise((resolve, reject) => {
      app.signMessage(this.path, thisMessage, function(res, err) {
        if (res === undefined) reject(err);
        resolve(res);
      });
    });
  }

  changeDerivationPath(path) {
    this.path = path;
    return this.unlockSecalot();
  }

  secalotCallback(result, error) {
    return new Promise((resolve, reject) => {
      if (typeof result !== 'undefined') {
        this.HWWalletCreate(
          result['publicKey'],
          result['chainCode'],
          'secalot',
          this.path
        );
        resolve();
      } else {
        reject(error);
      }
    });
  }

  unlockSecalot(secalotSecret) {
    typeof secalotSecret === 'string' ? Number(secalotSecret) : secalotSecret;
    return new Promise(resolve => {
      this.transport = new SecalotUsb();
      const app = new SecalotEth(this.transport, secalotSecret);
      const path = this.path;
      app.getAddress(path, (result, error) => {
        resolve(this.secalotCallback(result, error));
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

  signTxSecalot(rawTx) {
    const app = new SecalotEth(this.transport);
    const tx = new EthereumjsTx(rawTx);

    return new Promise((resolve, reject) => {
      app.signTransaction(this.path, tx, (res, err) => {
        if (typeof err !== 'undefined') {
          err = err.errorCode ? u2f.getErrorByCode(err.errorCode) : err;
          reject(err);
          return;
        }
        rawTx.v = this.sanitizeHex(res['v']);
        rawTx.r = this.sanitizeHex(res['r']);
        rawTx.s = this.sanitizeHex(res['s']);
        const eTx_ = new EthereumjsTx(rawTx);
        rawTx.rawTx = JSON.stringify(rawTx);
        rawTx.rawTransaction = this.sanitizeHex(
          eTx_.serialize().toString('hex')
        );
        rawTx.isError = false;
        resolve(rawTx);
      });
    });
  }

  sanitizeHex(hex) {
    hex = hex.substring(0, 2) === '0x' ? hex.substring(2) : hex;
    if (hex === '') return '';
    return '0x' + Misc.padLeftEven(hex);
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
}
