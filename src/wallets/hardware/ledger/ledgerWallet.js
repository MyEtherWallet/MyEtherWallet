import EthereumTx from 'ethereumjs-tx';
import Ledger from '@ledgerhq/hw-app-eth';
import u2fTransport from '@ledgerhq/hw-transport-u2f';
import HardwareWalletInterface from '../hardwareWallet-interface';
import * as ethUtil from 'ethereumjs-util';

// const NOT_SUPPORTED_ERROR_MSG =
//   'LedgerWallet uses U2F which is not supported by your browser. ' +
//   'Use Chrome, Opera or Firefox with a U2F extension.' +
//   "Also make sure you're on an HTTPS connection"

/**
 * THE CONNECTION STATUS, STATE, AND ACTIONS ALL OPERATE FROM THE TRANSPORT INSTANCE PASSED TO THE LEDGER APP INTERFACE
 */
export default class LedgerWallet extends HardwareWalletInterface {
  constructor(opts) {
    super();
    let options = opts || {};
    this.brand = 'ledger';
    this.identifier = 'LedgerNanoS';
    this.wallet = null;
    this.activeAddress = '';
    this.activeAddressIndex = '';
    if (options.transport) this.ledgerTransport = options.transport;
    this.allowedHdPaths = options.options || ["44'/60'", "44'/61'"];
    this.defaultOptions = {
      path: "44'/60'/0'/0", // ledger default derivation path
      askConfirm: false
    };

    const currentOptions = {
      ...this.defaultOptions,
      ...options
    };
    this.checkIfAllowedPath(currentOptions.path);

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

  static async unlock(options) {
    try {
      return new LedgerWallet(options);
    } catch (e) {
      return e;
    }
  }

  getAddress() {
    return this.wallet.address;
  }

  getAddressString() {
    // let rawAddress = '0x' + this.getAddress().toString('hex')
    return ethUtil.toChecksumAddress(this.getAddress());
  }

  changeDPath(path) {
    this.path = path;
  }

  setActiveAddress(address, index) {
    this.wallet = {};
    this.wallet.address = address;
    // this.activeAddressIndex = index
    this.wallet.path = this.pathComponents.basePath + index.toString();
    this.wallet.hwType = 'ledger';
    this.wallet.hwTransport = undefined;
    this.wallet.type = 'default';
  }

  changeNetwork(networkId, path) {
    this.networkId = networkId;
    this.path = path;
  }

  getAccounts() {
    let _this = this;
    if (arguments.length > 1 && arguments.length < 3) {
      return _this.getMultipleAccounts(arguments[0], arguments[1]);
    } else {
      return _this._getAccounts();
    }
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

  checkIfAllowedPath(path) {
    if (!this.allowedHdPaths.some(hdPref => path.startsWith(hdPref))) {
      throw this.makeError(
        'Ledger derivation path allowed are ' +
          this.allowedHdPaths.join(', ') +
          '. ' +
          path +
          ' is not supported',
        'InvalidDerivationPath'
      );
    }
  }

  makeError(msg, id) {
    const err = new Error(msg);
    err.id = id;
    return err;
  }

  obtainPathComponentsFromDerivationPath(derivationPath) {
    // check if derivation path follows 44'/60'/x'/n pattern
    const regExp = /^(44'\/(?:1|60|61)'\/\d+'?\/)(\d+)$/;
    const matchResult = regExp.exec(derivationPath);
    if (matchResult === null) {
      throw this.makeError(
        'To get multiple accounts your derivation path must follow pattern 44\'/60|61\'/x\'/n ',
        'InvalidDerivationPath'
      );
    }
    return { basePath: matchResult[1], index: parseInt(matchResult[2], 10) };
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
      } else {
        return u2fTransport.create(3000, 3000);
      }
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

  async getAppConfig(callback) {
    const transport = await this.getTransport();
    try {
      const eth = new Ledger(transport);
      const appConfig = await eth.getAppConfiguration();
      callback(null, appConfig);
    } catch (e) {
      callback(e);
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
    } else {
      path = this.addressToPathMap[data.from.toLowerCase()];
      if (!path) throw new Error("address unknown '" + data.from + "'");
      return path;
    }
  }

  async _signPersonalMessage(msgData) {
    const path = await this.checkIfKnownAddress(msgData);
    const transport = await this.getTransport();
    try {
      let thisMessage = msgData.data ? msgData.data : msgData;
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
}
