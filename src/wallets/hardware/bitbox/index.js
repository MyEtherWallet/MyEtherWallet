import ethTx from 'ethereumjs-tx';
import { hashPersonalMessage, toBuffer } from 'ethereumjs-util';
import DigitalBitboxUsb from './digitalBitboxUsb';
import DigitalBitboxEth from './digitalBitboxEth';
import { BITBOX as bitboxType } from '../../bip44/walletTypes';
import bip44Paths from '../../bip44';
import HDWalletInterface from '@/wallets/HDWalletInterface';
import { Toast } from '@/helpers';
import errorHandler from './errorHandler';
import * as HDKey from 'hdkey';
import {
  getSignTransactionObject,
  sanitizeHex,
  getBufferFromHex,
  calculateChainIdFromV
} from '../../utils';

const NEED_PASSWORD = true;

class BitBoxWallet {
  constructor(password) {
    this.identifier = bitboxType;
    this.isHardware = true;
    this.needPassword = NEED_PASSWORD;
    this.supportedPaths = bip44Paths[bitboxType];
    this.password = password;
  }
  async init(basePath) {
    this.basePath = basePath ? basePath : this.supportedPaths[0].path;
    const transport = new DigitalBitboxUsb();
    this.bitbox = new DigitalBitboxEth(transport, this.password);
    const rootPub = await getRootPubKey(this.bitbox, this.basePath);
    this.hdKey = new HDKey();
    this.hdKey.publicKey = Buffer.from(rootPub.publicKey, 'hex');
    this.hdKey.chainCode = Buffer.from(rootPub.chainCode, 'hex');
  }
  getAccount(idx) {
    const derivedKey = this.hdKey.derive('m/' + idx);
    const txSigner = async tx => {
      tx = new ethTx(tx);
      const networkId = tx._chainId;
      const result = await this.bitbox.signTransaction(
        this.basePath + '/' + idx,
        tx
      );
      tx.v = getBufferFromHex(sanitizeHex(result.v));
      tx.r = getBufferFromHex(sanitizeHex(result.r));
      tx.s = getBufferFromHex(sanitizeHex(result.s));
      const signedChainId = calculateChainIdFromV(tx.v);
      if (signedChainId !== networkId)
        Toast.responseHandler(
          new Error(
            'Invalid networkId signature returned. Expected: ' +
              networkId +
              ', Got: ' +
              signedChainId,
            'InvalidNetworkId'
          ),
          false
        );
      return getSignTransactionObject(tx);
    };
    const msgSigner = async msg => {
      const msgHash = hashPersonalMessage(toBuffer(msg));
      const result = await this.bitbox.signMessage(
        this.basePath + '/' + idx,
        msgHash
      );
      return Buffer.concat([
        getBufferFromHex(sanitizeHex(result.r)),
        getBufferFromHex(sanitizeHex(result.s)),
        getBufferFromHex(sanitizeHex(result.v))
      ]);
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
const getRootPubKey = (_bitbox, _path) => {
  return new Promise((resolve, reject) => {
    _bitbox.getAddress(_path, (result, error) => {
      if (error) return reject(error);
      resolve({
        publicKey: result.publicKey,
        chainCode: result.chainCode
      });
    });
  });
};

const createWallet = async (basePath, password) => {
  const _bitboxWallet = new BitBoxWallet(password);
  await _bitboxWallet.init(basePath);
  return _bitboxWallet;
};
createWallet.errorHandler = errorHandler;

export default createWallet;
