import { Transaction } from '@ethereumjs/tx';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import HDWalletInterface from '@/modules/access-wallet/common/HDWalletInterface';
import errorHandler from './errorHandler';
import cwsETH from '@coolwallet/eth';
import cwsBSC from '@coolwallet/bsc';
import * as core from '@coolwallet/core';
import bip44Paths from '@/modules/access-wallet/hardware/handlers/bip44';
import { bufferToHex } from 'ethereumjs-util';
import cwsTransportLib from '@coolwallet/transport-web-ble';
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
const APP_ID = 'coolWalletPro-appId';
const APP_PRIVATE_KEY = 'coolWalletPro-appPrivateKey';
const APP_PUBLIC_KEY = 'coolWalletPro-appPublicKey';
const CW_DEVICE_NAME = 'coolWalletPro-deviceName';
const CW_SE_PUBKEY = 'coolWalletPro-SEPublicKey';

class CoolWallet {
  constructor() {
    this.identifier = WALLET_TYPES.COOL_WALLET_PRO;
    this.isHardware = true;
    this.needPassword = NEED_PASSWORD;
    this.transport = {};
    this.deviceInstance = {};
    this.supportedPaths = bip44Paths[WALLET_TYPES.COOL_WALLET];
    this.meta = {
      name: 'CoolWallet Pro',
      img: {
        type: 'img',
        value: coolwallet
      }
    };

    this.lastCWDeviceUsed = locstore.get(CW_DEVICE_NAME)
      ? locstore.get(CW_DEVICE_NAME)
      : '';
    this.appId = locstore.get(APP_ID) ? locstore.get(APP_ID) : '';
    this.appPrivateKey = locstore.get(APP_PRIVATE_KEY)
      ? locstore.get(APP_PRIVATE_KEY)
      : '';
    this.appPublicKey = locstore.get(APP_PUBLIC_KEY)
      ? locstore.get(APP_PUBLIC_KEY)
      : '';
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
              /**
               * if lastCWDeviceUsed !== device.name
               * assume that its a different cw device
               * throw moves it to catch so it registers
               */
              if (_this.lastCWDeviceUsed !== device.name) throw '';
              locstore.set(CW_DEVICE_NAME, device.name);
              _this.connectToCW();
              const chainID = store.getters['global/network'].type.chainID;
              await _this.deviceInstance[chainID].getAddress(
                _this.transport,
                _this.appPrivateKey,
                _this.appId,
                0
              );
              resolve();
            } catch (e) {
              core.config.getSEPublicKey(_this.transport).then(res => {
                localStorage.setItem(CW_SE_PUBKEY, res);
                this.generateAndRegister(password, resolve, device, reject);
              });
            }
          });
        } else {
          reject(new Error('no device'));
        }
      });
    });
  }

  generateAndRegister(password, cb, device, reject) {
    const sePublicKey = localStorage.getItem(CW_SE_PUBKEY) || '';
    const { publicKey: appPublicKey, privateKey: appPrivateKey } =
      core.crypto.key.generateKeyPair();
    this.appPrivateKey = appPrivateKey;
    this.appPublicKey = appPublicKey;
    core.apdu.pair
      .register(this.transport, appPublicKey, password, APP_NAME, sePublicKey)
      .then(appId => {
        this.appId = appId;
        locstore.set(APP_ID, appId);
        locstore.set(APP_PUBLIC_KEY, appPublicKey);
        locstore.set(APP_PRIVATE_KEY, appPrivateKey);
        locstore.set(CW_DEVICE_NAME, device.name);
        this.connectToCW();
        cb();
      })
      .catch(e => {
        reject(e);
      });
  }

  connectToCW() {
    this.deviceInstance = {
      1: new cwsETH(),
      56: new cwsBSC()
    };
  }

  async getAccount(idx) {
    const chainID = store.getters['global/network'].type.chainID;
    const address = await this.deviceInstance[chainID].getAddress(
      this.transport,
      this.appPrivateKey,
      this.appId,
      idx
    );
    const txSigner = async txParam => {
      const tx = new Transaction.fromTxData(txParam, {
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

      const signTxData = {
        transport: this.transport,
        appPrivateKey: this.appPrivateKey,
        appId: this.appId,
        transaction: cwTx,
        addressIndex: idx
      };

      const networkId = tx.common.chainId();
      const result = await this.deviceInstance[chainID]
        .signTransaction(signTxData)
        .catch(errorHandler);

      if (result) {
        const resultTx = Transaction.fromSerializedTx(result, {
          common: commonGenerator(store.getters['global/network'])
        });
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
      const signMsgData = {
        transport: this.transport,
        appPrivateKey: this.appPrivateKey,
        appId: this.appId,
        message: msg,
        addressIndex: idx
      };
      const result = await this.deviceInstance[chainID].signMessage(
        signMsgData
      );
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
