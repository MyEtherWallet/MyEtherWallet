import { Transaction } from 'ethereumjs-tx';
import { hashPersonalMessage } from 'ethereumjs-util';
import DigitalBitboxUsb from './digitalBitboxUsb';
import DigitalBitboxEth from './digitalBitboxEth';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import bip44Paths from '@/modules/access-wallet/hardware/handlers/bip44';
import HDWalletInterface from '@/modules/access-wallet/common/HDWalletInterface.js';
import { Toast, SENTRY } from '@/modules/toast/handler/handlerToast';
import toBuffer from '@/core/helpers/toBuffer';
import errorHandler from './errorHandler';
import * as HDKey from 'hdkey';
import store from '@/core/store';
import {
  getSignTransactionObject,
  sanitizeHex,
  getBufferFromHex,
  calculateChainIdFromV
} from '@/modules/access-wallet/common/helpers';
import commonGenerator from '@/core/helpers/commonGenerator';
import Vue from 'vue';

const NEED_PASSWORD = true;

class BitBoxWallet {
  constructor(password) {
    this.identifier = WALLET_TYPES.BITBOX;
    this.isHardware = true;
    this.needPassword = NEED_PASSWORD;
    this.supportedPaths = bip44Paths[WALLET_TYPES.BITBOX];
    this.password = password;
    this.meta = {
      name: 'BitBox',
      img: {
        type: 'mew-icon',
        value: 'bitbox'
      }
    };
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
      tx = new Transaction(tx, {
        common: commonGenerator(store.getters['global/network'])
      });
      const networkId = tx.getChainId();
      const result = await this.bitbox.signTransaction(
        this.basePath + '/' + idx,
        tx
      );
      tx.v = getBufferFromHex(sanitizeHex(result.v));
      tx.r = getBufferFromHex(sanitizeHex(result.r));
      tx.s = getBufferFromHex(sanitizeHex(result.s));
      const signedChainId = calculateChainIdFromV(tx.v);
      if (signedChainId !== networkId)
        Toast(
          new Error(
            Vue.$i18n.t('errorsGlobal.invalid-network-id-sig', {
              got: signedChainId,
              expected: networkId
            }),
            'InvalidNetworkId'
          ),
          {},
          SENTRY
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
      msgSigner,
      null,
      this.meta
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
    _bitbox.getStarted(_path, (result, error) => {
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
