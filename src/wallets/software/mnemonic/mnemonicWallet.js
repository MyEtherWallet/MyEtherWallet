import EthereumjsTx from 'ethereumjs-tx';
import * as ethUtil from 'ethereumjs-util';
import * as HDKey from 'hdkey';
import HardwareWalletInterface from './hardwareWallet-interface';
import { getDerivationPath, paths } from './deterministicWalletPaths';
import * as bip39 from 'bip39';

let phrase = '';
let pass = '';

export default class MnemonicWallet extends HardwareWalletInterface {
  constructor(options) {
    super();
    this.identifier = 'Mnemonic';
    this.wallet = null;

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

    if (options) {
      this.decryptWallet(options);
    }
  }

  // ============== (Start) Expected Utility methods ======================

  setActiveAddress(address) {
    this.wallet = this.addressToWalletMap[address];
    this.wallet.address = address;
  }

  static async unlock(options) {
    try {
      return new MnemonicWallet(options);
    } catch (e) {
      // eslint-disable-next-line
      console.error(e); // todo replace with proper error
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
    return this.signTxMnemonic(txData);
  }

  signMessage(msgData) {
    const thisMessage = msgData.data ? msgData.data : msgData;
    return this.signMessageMnemonic(thisMessage);
  }

  // ============== (End) Implementation of wallet usage methods ======================

  async changeDerivationPath(path) {
    this.path = path;
    await this.decryptWallet({
      mnemonicPhrase: phrase,
      mnemonicPassword: pass
    });
  }

  // ============== (Start) Internally used methods ======================

  set phrase(mnemonicPhrase) {
    phrase = mnemonicPhrase;
  }

  set password(mnemonicPassword) {
    pass = mnemonicPassword;
  }

  // (Start) Internal setup methods

  decryptWallet(options) {
    try {
      if (!bip39.validateMnemonic(options.mnemonicPhrase))
        throw new Error('Invalid Mnemonic Supplied');
      this.phrase = options.mnemonicPhrase;
      this.password = options.mnemonicPassword;
      this.hdk = HDKey.fromMasterSeed(
        bip39.mnemonicToSeed(
          options.mnemonicPhrase.trim(),
          options.mnemonicPassword
        )
      );
      this.setHDAddresses();
    } catch (e) {
      throw e;
    }
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

  setHDAddresses(start = 0, limit = 5) {
    // TODO: Move to a worker thread
    this.walletsRetrieved = [];
    for (let i = start; i < start + limit; i++) {
      const tempWallet = this.createWallet(
        this.hdk.derive(this.path + '/' + i)._privateKey
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

  async signTxMnemonic(rawTx) {
    try {
      if (!this.wallet)
        throw new Error('no wallet present. wallet not have been decrypted');
      const txData = {
        nonce: rawTx.nonce,
        gasPrice: rawTx.gasprice,
        gas: rawTx.gas,
        to: rawTx.to,
        value: rawTx.value,
        data: rawTx.data,
        chainId: rawTx.chainId
      };
      txData.data = txData.data === '' ? '0x' : txData.data;
      const tx = new EthereumjsTx(txData);
      tx.sign(Buffer.from(this.wallet.privKey, 'hex'));
      txData.rawTx = JSON.stringify(txData);
      return {
        rawTx: txData,
        messageHash: tx.hash(), // figure out what exactly web3 is putting here
        v: tx.v,
        r: tx.r,
        s: tx.s,
        rawTransaction: `0x${tx.serialize().toString('hex')}`
      };
    } catch (e) {
      return e;
    }
  }

  async signMessageMnemonic(stringMessage) {
    try {
      if (!this.wallet)
        throw new Error(
          'no wallet present. wallet may not have been decrypted'
        );

      const msg = ethUtil.hashPersonalMessage(ethUtil.toBuffer(stringMessage));
      const signed = ethUtil.ecsign(msg, this.wallet.privKey);
      const combined = Buffer.concat([
        Buffer.from(signed.r),
        Buffer.from(signed.s),
        Buffer.from([signed.v])
      ]);
      const combinedHex = combined.toString('hex');
      return '0x' + combinedHex;
    } catch (e) {
      return e;
    }
  }

  // (End) Internal methods underlying wallet usage methods
  // (Start) Internal utility methods
  _getAddressForWallet(wallet) {
    if (typeof wallet.pubKey === 'undefined') {
      return '0x' + ethUtil.privateToAddress(wallet.privKey).toString('hex');
    }
    return '0x' + ethUtil.publicToAddress(wallet.pubKey, true).toString('hex');
  }

  // (End) Internal utility methods
  // ============== (End) Internally used methods ======================
}
