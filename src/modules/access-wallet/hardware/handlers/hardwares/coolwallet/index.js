import { Transaction } from 'ethereumjs-tx';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import HDWalletInterface from '@/modules/access-wallet/common/HDWalletInterface';
import errorHandler from './errorHandler';
import cwsETH from '@coolwallets/eth';
import cwsWallet, { generateKeyPair } from '@coolwallets/wallet';
import bip44Paths from '@/modules/access-wallet/hardware/handlers/bip44';
import { bufferToHex } from 'ethereumjs-util';
import cwsTransportLib from '@coolwallets/transport-web-ble';
import Vue from 'vue';
import coolwallet from '@/assets/images/icons/wallets/coolwallet.svg';
import * as locstore from 'store';
import store from '@/core/store';
import {
  getSignTransactionObject,
  sanitizeHex,
  getBufferFromHex,
  calculateChainIdFromV
} from '@/modules/access-wallet/common/helpers';
import commonGenerator from '@/core/helpers/commonGenerator';

const NEED_PASSWORD = true;
const APP_NAME = 'MyEtherWalletV6';
const APP_ID = 'coolWallet-appId';
const APP_PRIVATE_KEY = 'coolWallet-appPrivateKey';
const APP_PUBLIC_KEY = 'coolWallet-appPublicKey';

class CoolWallet {
  constructor() {
    this.identifier = WALLET_TYPES.COOL_WALLET;
    this.isHardware = true;
    this.needPassword = NEED_PASSWORD;
    this.transport = {};
    this.deviceInstance = {};
    this.supportedPaths = bip44Paths[WALLET_TYPES.COOL_WALLET];
    this.meta = {
      name: 'Cool Wallet',
      img: {
        type: 'img',
        value: coolwallet
      }
    };
    this.appId = locstore.get(APP_ID) ? locstore.get(APP_ID) : '';
    this.appPrivateKey = locstore.get(APP_PRIVATE_KEY)
      ? locstore.get(APP_PRIVATE_KEY)
      : '';
    this.appPublicKey = locstore.get(APP_PUBLIC_KEY)
      ? locstore.get(APP_PUBLIC_KEY)
      : '';
    this.firstTimeConnecting =
      this.appPrivateKey === '' &&
      this.appPublicKey === '' &&
      this.appId === '';
  }
  init(password) {
    const _this = this;
    return new Promise((resolve, reject) => {
      if (!window.navigator.bluetooth)
        return reject(new Error('browser not supported'));
      cwsTransportLib.listen((error, device) => {
        if (error) reject(error);
        if (device) {
          cwsTransportLib.connect(device).then(async _transport => {
            _this.transport = _transport;
            try {
              _this.deviceInstance = new cwsETH(
                _this.transport,
                _this.appPrivateKey,
                _this.appId
              );
              await _this.deviceInstance.getAddress(0);
              resolve();
            } catch (e) {
              const { publicKey: appPublicKey, privateKey: appPrivateKey } =
                generateKeyPair();
              _this.appPrivateKey = appPrivateKey;
              _this.appPublicKey = appPublicKey;
              const coolWalletInstance = new cwsWallet(
                _this.transport,
                _this.appPrivateKey
              );
              coolWalletInstance
                .register(_this.appPublicKey, password, APP_NAME)
                .then(appId => {
                  _this.appId = appId;
                  locstore.set(APP_ID, appId);
                  locstore.set(APP_PUBLIC_KEY, appPublicKey);
                  locstore.set(APP_PRIVATE_KEY, appPrivateKey);
                  coolWalletInstance.setAppId(appId);
                  _this.deviceInstance = new cwsETH(
                    _this.transport,
                    _this.appPrivateKey,
                    _this.appId
                  );
                  resolve();
                })
                .catch(errorHandler);
            }
          });
        } else {
          reject(new Error('no device'));
        }
      });
    });
  }

  async getAccount(idx) {
    const address = await this.deviceInstance.getAddress(idx);
    const txSigner = async tx => {
      tx = new Transaction(tx, {
        common: commonGenerator(store.getters['global/network'])
      });
      const cwTx = {
        data: bufferToHex(tx.data),
        gasLimit: bufferToHex(tx.gasLimit),
        gasPrice: bufferToHex(tx.gasPrice),
        nonce: bufferToHex(tx.nonce),
        to: bufferToHex(tx.to),
        value: bufferToHex(tx.value),
        chainId: store.getters['global/network'].type.chainID
      };

      const networkId = tx.getChainId();
      const result = await this.deviceInstance
        .signTransaction(cwTx, idx)
        .catch(errorHandler);

      if (result) {
        const resultTx = new Transaction(result);
        tx.v = getBufferFromHex(sanitizeHex(resultTx.v.toString('hex')));
        tx.r = getBufferFromHex(sanitizeHex(resultTx.r.toString('hex')));
        tx.s = getBufferFromHex(sanitizeHex(resultTx.s.toString('hex')));
        const signedChainId = calculateChainIdFromV(tx.v);
        if (signedChainId !== networkId)
          throw new Error(
            Vue.$i18n.t('errorsGlobal.invalid-network-id-sig', {
              got: signedChainId,
              expected: networkId
            }),
            'InvalidNetworkId'
          );
        return getSignTransactionObject(tx);
      }
      return result;
    };
    const msgSigner = async msg => {
      const result = await this.deviceInstance.signMessage(msg, idx);
      if (result) {
        const signature = result.substr(2);
        const r = '0x' + signature.slice(0, 64);
        const s = '0x' + signature.slice(64, 128);
        const v = '0x' + signature.slice(128, 130);
        return Buffer.concat([
          getBufferFromHex(sanitizeHex(r)),
          getBufferFromHex(sanitizeHex(s)),
          getBufferFromHex(sanitizeHex(v))
        ]);
      }
      return result;
    };
    return new HDWalletInterface(
      null,
      address,
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
    return this.supportedPaths[0].path;
  }
  getSupportedPaths() {
    return this.supportedPaths;
  }
}

const createWallet = async (_, password) => {
  const _coolWallet = new CoolWallet();
  await _coolWallet.init(password);
  return _coolWallet;
};
createWallet.errorHandler = errorHandler;

export default createWallet;
