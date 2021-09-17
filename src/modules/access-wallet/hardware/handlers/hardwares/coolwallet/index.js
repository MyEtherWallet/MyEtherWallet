import { Transaction } from '@ethereumjs/tx';
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
    this.appId = locstore.get('coolWallet-appId')
      ? locstore.get('coolWallet-appId')
      : '';
    this.appPrivateKey = locstore.get('coolWallet-appPrivateKey')
      ? locstore.get('coolWallet-appPrivateKey')
      : '';
    this.appPublicKey = locstore.get('coolWallet-appPublicKey')
      ? locstore.get('coolWallet-appPublicKey')
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
    const txSigner = async txParams => {
      const tx = new Transaction(txParams, {
        common: commonGenerator(store.getters['global/network'])
      });
      const cwTx = {
        data: bufferToHex(tx.data),
        gasLimit: bufferToHex(tx.gasLimit),
        gasPrice: bufferToHex(tx.gasPrice),
        nonce: bufferToHex(tx.nonce),
        to: bufferToHex(tx.to),
        value: bufferToHex(tx.value),
        chainId: tx.common.chainId()
      };

      const networkId = tx.common.chainId();
      const result = await this.deviceInstance
        .signTransaction(cwTx, idx)
        .catch(errorHandler);

      if (result) {
        const resultTx = Transaction.fromTxData(result);
        const signedChainId = calculateChainIdFromV(resultTx.v);
        if (signedChainId !== networkId)
          throw new Error(
            Vue.$i18n.t('errorsGlobal.invalid-network-id-sig', {
              got: signedChainId,
              expected: networkId
            }),
            'InvalidNetworkId'
          );
        return getSignTransactionObject(resultTx);
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
