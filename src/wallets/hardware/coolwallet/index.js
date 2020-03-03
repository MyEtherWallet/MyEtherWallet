import { Transaction } from 'ethereumjs-tx';
import { hashPersonalMessage } from 'ethereumjs-util';
import { COOLWALLET as coolWalletType } from '../../bip44/walletTypes';
import HDWalletInterface from '@/wallets/HDWalletInterface';
import { Toast, Misc } from '@/helpers';
import errorHandler from './errorHandler';
import cwsTransportLib from '@coolwallets/transport-web-ble';
import cwsETH from '@coolwallets/eth';
import cwsWallet, { generateKeyPair } from '@coolwallets/wallet';
import locStore from 'store.js';

import store from '@/store';
import {
  getSignTransactionObject,
  sanitizeHex,
  getBufferFromHex,
  calculateChainIdFromV
} from '../../utils';
import commonGenerator from '@/helpers/commonGenerator';

const NEED_PASSWORD = false;

class CoolWallet {
  constructor() {
    this.identifier = coolWalletType;
    this.isHardware = true;
    this.needPassword = NEED_PASSWORD;
    this.selectedIdx = '';
    this.appPrivateKey = '';
    this.appPublicKey = '';
  }
  async init() {
    const hasKeys =
      locStore.get('appPublicKey') && locStore.get('appPrivateKey');
    const hasAppId = locStore.get('appId') || null;
    if (!hasKeys) {
      const {
        publicKey: appPublicKey,
        privateKey: appPrivateKey
      } = generateKeyPair();

      // store it locally on web storage
      locStore.set('appPublicKey', appPublicKey);
      locStore.set('appPrivateKey', appPrivateKey);
      this.appPrivateKey = appPrivateKey;
      this.appPublicKey = appPublicKey;
    } else {
      this.appPrivateKey = locStore.get('appPrivateKey');
      this.appPublicKey = locStore.get('appPublicKey');
    }

    if (!hasAppId) {
    } else {
      this.hasAppId = hasAppId;
    }
  }
  getAccount(idx) {
    const txSigner = async tx => {
      tx = new Transaction(tx, {
        common: commonGenerator(store.state.main.network)
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
      const msgHash = hashPersonalMessage(Misc.toBuffer(msg));
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
      null,
      '0x',
      this.isHardware,
      this.identifier,
      errorHandler,
      txSigner,
      msgSigner,
      null
    );
  }
}

const createWallet = async () => {
  const _bitboxWallet = new CoolWallet();
  await _bitboxWallet.init();
  return _bitboxWallet;
};
createWallet.errorHandler = errorHandler;

export default createWallet;
