import Trezor from 'trezor-connect';
import { TREZOR as trezorType } from '../../bip44/walletTypes';
import bip44Paths from '../../bip44';
import HDWalletInterface from '@/wallets/HDWalletInterface';
import * as HDKey from 'hdkey';
import { Transaction } from 'ethereumjs-tx';
import {
  getSignTransactionObject,
  getHexTxObject,
  getBufferFromHex,
  calculateChainIdFromV
} from '../../utils';
import { toBuffer } from 'ethereumjs-util';
import errorHandler from './errorHandler';
import store from '@/store';

const NEED_PASSWORD = false;

class TrezorWallet {
  constructor() {
    Trezor.manifest({
      email: 'dev@myetherwallet.com',
      appUrl: 'https://www.myetherwallet.com'
    });

    this.identifier = trezorType;
    this.isHardware = true;
    this.needPassword = NEED_PASSWORD;
    this.supportedPaths = bip44Paths[trezorType];
  }
  async init(basePath) {
    this.basePath = basePath ? basePath : this.supportedPaths[0].path;
    const rootPub = await getRootPubKey(this.basePath);
    this.hdKey = new HDKey();
    this.hdKey.publicKey = Buffer.from(rootPub.publicKey, 'hex');
    this.hdKey.chainCode = Buffer.from(rootPub.chainCode, 'hex');
  }
  getAccount(idx) {
    const derivedKey = this.hdKey.derive('m/' + idx);
    const txSigner = async tx => {
      tx = new Transaction(tx, { common: store.state.network.config });
      const networkId = tx.getChainId();
      const options = {
        path: this.basePath + '/' + idx,
        transaction: getHexTxObject(tx)
      };
      const result = await Trezor.ethereumSignTransaction(options);
      if (!result.success) throw new Error(result.payload.error);
      tx.v = getBufferFromHex(result.payload.v);
      tx.r = getBufferFromHex(result.payload.r);
      tx.s = getBufferFromHex(result.payload.s);
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
      const result = await Trezor.ethereumSignMessage({
        path: this.basePath + '/' + idx,
        message: toBuffer(msg).toString('hex'),
        hex: true
      });
      if (!result.success) throw new Error(result.payload.error);
      return getBufferFromHex(result.payload.signature);
    };
    const displayAddress = async () => {
      await Trezor.ethereumGetAddress({
        path: this.basePath + '/' + idx,
        showOnTrezor: true
      });
    };
    return new HDWalletInterface(
      this.basePath + '/' + idx,
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
  const _trezorWallet = new TrezorWallet();
  await _trezorWallet.init(basePath);
  return _trezorWallet;
};
createWallet.errorHandler = errorHandler;
const getRootPubKey = async _path => {
  const result = await Trezor.ethereumGetPublicKey({ path: _path });
  if (!result.success) throw new Error(result.payload.error);
  return {
    publicKey: result.payload.publicKey,
    chainCode: result.payload.chainCode
  };
};

export default createWallet;
