import EthereumTx from 'ethereumjs-tx';
import Ledger from '@ledgerhq/hw-app-eth';
import u2fTransport from '@ledgerhq/hw-transport-u2f';
import HardwareWalletInterface from '../hardwareWallet-interface';
import * as ethUtil from 'ethereumjs-util';
import { paths, getDerivationPath } from './deterministicWalletPaths';

export default class LedgerWallet extends HardwareWalletInterface {
  constructor(opts) {
    super();
    const options = opts || {};
    this.brand = 'ledger';
    this.identifier = 'LedgerNanoS';
    this.version = '';
    this.wallet = null;
    if (options.transport) this.ledgerTransport = options.transport;
    this.defaultOptions = {
      path: this.getDerivationPath().dpath, // ledger default derivation path
      askConfirm: false
    };

    const currentOptions = {
      ...this.defaultOptions,
      ...options
    };
    this.accountsLength =
      currentOptions.accountsLength || this.defaultAccountsCount;
    this.accountsOffset =
      currentOptions.accountsOffset || this.defaultAccountsOffset;
    this.networkId = currentOptions.networkId || this.defaultNetworkId;

    this.path = currentOptions.path;
    this.askConfirm = currentOptions.askConfirm;
    this.addressToPathMap = {};
    this.pathComponents = this.obtainPathComponentsFromDerivationPath(
      this.path
    );

    this.accountsRetrieved = false;
    this.connectionOpened = false;
    this.getAppConfig = this.getAppConfig.bind(this);
    this.getAccounts = this.getAccounts.bind(this);
    this.getMultipleAccounts = this.getMultipleAccounts.bind(this);
    this.signTransaction = this.signTransaction.bind(this);
    this.signMessage = this.signMessage.bind(this);
    this.changeNetwork = this.changeNetwork.bind(this);
  }

  // ============== (Start) Expected Utility methods ======================
  static async unlock(options) {
    try {
      const wallet = new LedgerWallet(options);
      const appConfig = await wallet.getAppConfig();
      wallet.version = appConfig.version;
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

  async changeDerivationPath(path) {
    try {
      this.pathComponents = this.obtainPathComponentsFromDerivationPath(path);
      this.path = path;
      this.addressToPathMap = {};
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
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

  setActiveAddress(address, index) {
    this.wallet = {};
    this.wallet.address = address;
    this.wallet.path = this.pathComponents.basePath + index.toString();
    this.wallet.hwType = 'ledger';
    this.wallet.brand = 'ledger';
    this.wallet.hwTransport = undefined;
    this.wallet.type = 'hardware';
  }

  // ============== (End) Expected Utility methods ======================

  // ============== (Start) Implementation of required EthereumJs-wallet interface methods =========
  getAddress() {
    return this.wallet.address;
  }

  getAddressString() {
    return ethUtil.toChecksumAddress(this.getAddress());
  }
  // ============== (End) Implementation of required EthereumJs-wallet interface methods ===========

  // ============== (Start) Implementation of wallet usage methods ======================
  getAccounts() {
    const _this = this;
    if (arguments.length > 1 && arguments.length < 3) {
      return _this.getMultipleAccounts(arguments[0], arguments[1]);
    }
    return _this._getAccounts();
  }

  getMultipleAccounts(count, offset) {
    return this._getAccounts(count, offset);
  }

  signMessage(txData) {
    return this._signPersonalMessage(txData);
  }

  signTransaction(txData) {
    return this._signTransaction(txData);
  }

  // ============== (End) Implementation of wallet usage methods ======================

  // ============== (Start) Internally used methods ======================

  makeError(msg, id) {
    const err = new Error(msg);
    err.id = id;
    return err;
  }

  versionCheck(chainRegexResult) {
    const forChecks = chainRegexResult
      ? chainRegexResult.length === 3
        ? chainRegexResult[2]
        : '0'
      : '0';
    const versionParts = this.version.split('.');
    if (/^1$|^60$|^61$/.test(forChecks)) {
      return true;
    }
    return +versionParts[1] > 3;
  }

  obtainPathComponentsFromDerivationPath(derivationPath) {
    // eslint-disable-next-line no-useless-escape
    const REGEX = /^m\s*\/(\s*44'\s*\/\s*(\d+)'\s*\/\s*(\d+)'\s*\/)\s*(\d+)\s*(\/\s*(\d+))?$/;
    const regExp = /^m?\/?(44'\/(\d+)'\/\d+'\/)$/;
    const regExpAlt = /^m?\/?(44'\/(\d+)')/;
    const matchResult = regExp.exec(derivationPath);
    const matchResultAlt = regExpAlt.exec(derivationPath);
    const coinCheck = REGEX.exec(derivationPath);
    if (matchResult === null && matchResultAlt === null) {
      throw this.makeError(
        "To get multiple accounts your derivation path must follow pattern 44'/60|61'/x'/n ",
        'InvalidDerivationPath'
      );
    }
    if (matchResult !== null) {
      return { basePath: matchResult[1], index: 0 };
    } else if (coinCheck !== null && this.versionCheck(coinCheck)) {
      return { basePath: coinCheck[1], index: 0 };
    } else if (matchResultAlt !== null && this.versionCheck(matchResultAlt)) {
      return {
        basePath: matchResultAlt[1] + "/0'/",
        index: 0
      };
    }
    throw this.makeError(
      'The selected path is not compatible with the attached Ledgers Firmware version'
    );
  }

  getTransport() {
    if (this.connectionOpened) {
      throw new Error(
        'You can only have one ledger connection active at a time'
      );
    } else {
      this.connectionOpened = true;
      if (this.ledgerTransport) {
        return this.ledgerTransport.create(3000, 3000);
      }
      return u2fTransport.create(3000, 3000);
    }
  }

  async _getAccounts(_accountsLength, _accountsOffset) {
    const transport = await this.getTransport();
    try {
      const accountsOffset = _accountsOffset || this.accountsOffset;
      const accountsLength = _accountsLength || this.accountsLength;
      const eth = new Ledger(transport);
      const addresses = {};
      for (let i = accountsOffset; i < accountsOffset + accountsLength; i++) {
        const path =
          this.pathComponents.basePath +
          (this.pathComponents.index + i).toString();
        const address = await eth.getAddress(path, this.askConfirm, false);
        addresses[i] = address.address;
        this.addressToPathMap[address.address.toLowerCase()] = path;
      }
      return addresses;
    } finally {
      transport
        .close()
        .then(() => {
          this.connectionOpened = false;
        })
        .catch(error => {
          throw error;
        });
    }
  }

  async getAppConfig() {
    const transport = await this.getTransport();
    try {
      const eth = new Ledger(transport);
      const appConfig = await eth.getAppConfiguration();
      return appConfig;
    } catch (e) {
      throw e;
    } finally {
      transport
        .close()
        .then(() => {
          this.connectionOpened = false;
        })
        .catch(error => {
          throw error;
        });
    }
  }

  async checkIfKnownAddress(data) {
    let path;
    if (!this.accountsRetrieved) {
      await this._getAccounts();
      path = this.addressToPathMap[data.from.toLowerCase()];
      if (!path) throw new Error("address unknown '" + data.from + "'");
      return path;
    }
    path = this.addressToPathMap[data.from.toLowerCase()];
    if (!path) throw new Error("address unknown '" + data.from + "'");
    return path;
  }

  async _signPersonalMessage(msgData) {
    const path = await this.checkIfKnownAddress(msgData);
    const transport = await this.getTransport();
    try {
      const thisMessage = msgData.data ? msgData.data : msgData;
      const eth = new Ledger(transport);
      const result = await eth.signPersonalMessage(
        path,
        Buffer.from(thisMessage).toString('hex')
      );
      const v = parseInt(result.v, 10) - 27;
      let vHex = v.toString(16);
      if (vHex.length < 2) {
        vHex = `0${v}`;
      }
      return `0x${result.r}${result.s}${vHex}`;
    } finally {
      transport
        .close()
        .then(() => {
          this.connectionOpened = false;
        })
        .catch(error => {
          throw error;
        });
    }
  }

  async _signTransaction(txData) {
    const path = await this.checkIfKnownAddress(txData);
    const transport = await this.getTransport();
    try {
      const eth = new Ledger(transport);
      const tx = new EthereumTx(txData);

      // Set the EIP155 bits
      tx.raw[6] = Buffer.from([this.networkId]); // v
      tx.raw[7] = Buffer.from([]); // r
      tx.raw[8] = Buffer.from([]); // s

      // Pass hex-rlp to ledger for signing
      const result = await eth.signTransaction(
        path,
        tx.serialize().toString('hex')
      );
      // Store signature in transaction
      tx.v = Buffer.from(result.v, 'hex');
      tx.r = Buffer.from(result.r, 'hex');
      tx.s = Buffer.from(result.s, 'hex');

      // EIP155: v should be chain_id * 2 + {35, 36}
      const signedChainId = Math.floor((tx.v[0] - 35) / 2);
      const validChainId = this.networkId & 0xff; // FIXME this is to fixed a current workaround that app don't support > 0xff
      if (signedChainId !== validChainId) {
        throw this.makeError(
          'Invalid networkId signature returned. Expected: ' +
            this.networkId +
            ', Got: ' +
            signedChainId,
          'InvalidNetworkId'
        );
      }
      return {
        tx: {
          ...txData,
          v: `0x${tx.v.toString('hex')}`,
          r: `0x${tx.r.toString('hex')}`,
          s: `0x${tx.s.toString('hex')}`,
          hash: tx.hash().toString('hex')
        },
        rawTransaction: `0x${tx.serialize().toString('hex')}`
      };
    } finally {
      transport
        .close()
        .then(() => {
          this.connectionOpened = false;
        })
        .catch(error => {
          throw error;
        });
    }
  }

  // ============== (End) Internally used methods ======================
}
