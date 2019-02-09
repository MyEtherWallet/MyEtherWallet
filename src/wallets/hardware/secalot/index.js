import ethTx from 'ethereumjs-tx';
import SecalotEth from './secalotEth';
import SecalotUsb from './secalotUsb';
import { SECALOT as secalotType } from '../../bip44/walletTypes';
import bip44Paths from '../../bip44';
import HDWalletInterface from '@/wallets/HDWalletInterface';
import * as HDKey from 'hdkey';
import {
  getSignTransactionObject,
  sanitizeHex,
  getBufferFromHex,
  calculateChainIdFromV
} from '../../utils';
import errorHandler from './errorHandler';

const NEED_PASSWORD = true;

class SecalotWallet {
  constructor(password) {
    this.identifier = secalotType;
    this.isHardware = true;
    this.needPassword = NEED_PASSWORD;
    this.supportedPaths = bip44Paths[secalotType];
    this.password = password;
  }
  async init(basePath) {
    this.basePath = basePath ? basePath : this.supportedPaths[0].path;
    const transport = new SecalotUsb();
    this.secalot = new SecalotEth(transport, this.password);
    const rootPub = await getRootPubKey(this.secalot, this.basePath);
    this.hdKey = new HDKey();
    this.hdKey.publicKey = Buffer.from(rootPub.publicKey, 'hex');
    this.hdKey.chainCode = Buffer.from(rootPub.chainCode, 'hex');
  }
  getAccount(idx) {
    const derivedKey = this.hdKey.derive('m/' + idx);
    const txSigner = async tx => {
      tx = new ethTx(tx);
      const networkId = tx._chainId;
      const result = await this.secalot.signTransactionAsync(
        this.basePath + '/' + idx,
        tx
      );
      tx.v = getBufferFromHex(sanitizeHex(result.v));
      tx.r = getBufferFromHex(sanitizeHex(result.r));
      tx.s = getBufferFromHex(sanitizeHex(result.s));
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
      const result = await this.secalot.signMessageAsync(
        this.basePath + '/' + idx,
        msg
      );
      return getBufferFromHex(result);
    };
    return new HDWalletInterface(
      this.basePath + '/' + idx,
      derivedKey.publicKey,
      this.isHardware,
      this.identifier,
      errorHandler,
      txSigner,
      msgSigner
    );
  }
  getCurrentPath() {
    return this.basePath;
  }
  getSupportedPaths() {
    return this.supportedPaths;
  }
}
const createWallet = async (basePath, password) => {
  const _secalotWallet = new SecalotWallet(password);
  await _secalotWallet.init(basePath);
  return _secalotWallet;
};
createWallet.errorHandler = errorHandler;
const getRootPubKey = (_secalot, _path) => {
  return new Promise((resolve, reject) => {
    _secalot.getAddress(_path, (result, error) => {
      if (error) return reject(error);
      resolve({
        publicKey: result.publicKey,
        chainCode: result.chainCode
      });
    });
  });
};

export default createWallet;
