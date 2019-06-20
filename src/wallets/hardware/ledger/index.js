import Ledger from '@ledgerhq/hw-app-eth';
import { byContractAddress } from '@ledgerhq/hw-app-eth/erc20';
import { Transaction } from 'ethereumjs-tx';
import u2fTransport from '@ledgerhq/hw-transport-u2f';
import webUsbTransport from '@ledgerhq/hw-transport-webusb';
import { LEDGER as ledgerType } from '../../bip44/walletTypes';
import bip44Paths from '../../bip44';
import HDWalletInterface from '@/wallets/HDWalletInterface';
import * as HDKey from 'hdkey';
import platform from 'platform';
import store from '@/store';

import {
  getSignTransactionObject,
  getBufferFromHex,
  sanitizeHex,
  calculateChainIdFromV
} from '../../utils';
import { toBuffer } from 'ethereumjs-util';
import errorHandler from './errorHandler';

const NEED_PASSWORD = false;
const OPEN_TIMEOUT = 10000;
const LISTENER_TIMEOUT = 30000;

class ledgerWallet {
  constructor() {
    this.identifier = ledgerType;
    this.isHardware = true;
    this.needPassword = NEED_PASSWORD;
    this.supportedPaths = bip44Paths[ledgerType];
  }
  async init(basePath) {
    this.basePath = basePath ? basePath : this.supportedPaths[0].path;
    this.isHardened = this.basePath.split('/').length - 1 === 2;
    this.transport = await getLedgerTransport();
    this.ledger = new Ledger(this.transport);
    this.appConfig = await getLedgerAppConfig(this.ledger);
    if (!this.isHardened) {
      const rootPub = await getRootPubKey(this.ledger, this.basePath);
      this.hdKey = new HDKey();
      this.hdKey.publicKey = Buffer.from(rootPub.publicKey, 'hex');
      this.hdKey.chainCode = Buffer.from(rootPub.chainCode, 'hex');
    }
  }
  async getAccount(idx) {
    let derivedKey, accountPath;
    if (this.isHardened) {
      const rootPub = await getRootPubKey(
        this.ledger,
        this.basePath + '/' + idx + "'"
      );
      const hdKey = new HDKey();
      hdKey.publicKey = Buffer.from(rootPub.publicKey, 'hex');
      hdKey.chainCode = Buffer.from(rootPub.chainCode, 'hex');
      derivedKey = hdKey.derive('m/0/0');
      accountPath = this.basePath + '/' + idx + "'" + '/0/0';
    } else {
      derivedKey = this.hdKey.derive('m/' + idx);
      accountPath = this.basePath + '/' + idx;
    }
    const txSigner = async tx => {
      tx = new Transaction(tx, { common: store.state.network.config });
      const networkId = tx.getChainId();
      tx.raw[6] = networkId;
      tx.raw[7] = Buffer.from([]);
      tx.raw[8] = Buffer.from([]);
      const tokenInfo = byContractAddress('0x' + tx.to.toString('hex'));
      if (tokenInfo) await this.ledger.provideERC20TokenInformation(tokenInfo);
      const result = await this.ledger.signTransaction(
        accountPath,
        tx.serialize().toString('hex')
      );

      // EIP155 support. check/recalc signature v value.
      let v = result.v;
      const rv = parseInt(v, 16);
      let cv = networkId * 2 + 35;
      if (rv !== cv && (rv & cv) !== rv) {
        cv += 1; // add signature v bit.
      }
      v = cv.toString(16);

      tx.v = getBufferFromHex(v);
      tx.r = getBufferFromHex(result.r);
      tx.s = getBufferFromHex(result.s);
      const signedChainId = calculateChainIdFromV(tx.v);
      if (signedChainId !== networkId)
        throw new Error(
          'Invalid networkId signature returned. Expected: ' +
            networkId +
            ', Got: ' +
            signedChainId,
          'InvalidNetworkId'
        );
      return getSignTransactionObject(tx);
    };
    const msgSigner = async msg => {
      const result = await this.ledger.signPersonalMessage(
        accountPath,
        toBuffer(msg).toString('hex')
      );
      const v = parseInt(result.v, 10) - 27;
      const vHex = sanitizeHex(v.toString(16));
      return Buffer.concat([
        getBufferFromHex(result.r),
        getBufferFromHex(result.s),
        getBufferFromHex(vHex)
      ]);
    };
    const displayAddress = async () => {
      await this.ledger.getAddress(accountPath, true, false);
    };
    return new HDWalletInterface(
      accountPath,
      derivedKey.publicKey,
      this.isHardware,
      this.identifier,
      errorHandler,
      txSigner,
      msgSigner,
      displayAddress
    );
  }
  getCurrentPath() {
    return this.basePath;
  }
  getSupportedPaths() {
    return this.supportedPaths;
  }
}
const createWallet = async basePath => {
  const _ledgerWallet = new ledgerWallet();
  await _ledgerWallet.init(basePath);
  return _ledgerWallet;
};
createWallet.errorHandler = errorHandler;

const isWebUsbSupported = async () => {
  const isSupported = await webUsbTransport.isSupported();
  return (
    isSupported && platform.os.family !== 'Windows' && platform.name !== 'Opera' // take it out later once the windows issue is fixed
  );
};

const getLedgerTransport = async () => {
  let transport;
  const support = await isWebUsbSupported();
  if (support) {
    transport = await webUsbTransport.create();
  } else {
    transport = await u2fTransport.create(OPEN_TIMEOUT, LISTENER_TIMEOUT);
  }
  return transport;
};
const getLedgerAppConfig = async _ledger => {
  const appConfig = await _ledger.getAppConfiguration();
  return appConfig;
};
const getRootPubKey = async (_ledger, _path) => {
  const pubObj = await _ledger.getAddress(_path, false, true);
  return {
    publicKey: pubObj.publicKey,
    chainCode: pubObj.chainCode
  };
};

export default createWallet;
