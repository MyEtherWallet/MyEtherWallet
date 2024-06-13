import { Transaction, FeeMarketEIP1559Transaction } from '@ethereumjs/tx';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import HDWalletInterface from '@/modules/access-wallet/common/HDWalletInterface';
import errorHandler from './errorHandler';
import cwsETH from '@coolwallets/eth';
import cwsWallet, { generateKeyPair } from '@coolwallets/wallet';
import ETH from '@coolwallet/eth';
import BSC from '@coolwallet/bsc';
import * as core from '@coolwallet/core';
import bip44Paths from '@/modules/access-wallet/hardware/handlers/bip44';
import { bufferToHex, toBuffer } from 'ethereumjs-util';
import WebBleTransport, {
  createTransport
} from '@coolwallet/transport-web-ble';

import Vue from 'vue';
import coolwallet from '@/assets/images/icons/wallets/coolwallet.svg';
import coolwalletPro from '@/assets/images/icons/wallets/coolwalletpro.svg';
import * as locstore from 'store';
import { useGlobalStore } from '@/core/store/global';
import {
  getSignTransactionObject,
  sanitizeHex,
  getBufferFromHex,
  calculateChainIdFromV,
  eip1559Params
} from '@/modules/access-wallet/common/helpers';
import commonGenerator from '@/core/helpers/commonGenerator';

const NEED_PASSWORD = true;
const APP_NAME = 'MyEtherWalletV6';
const APP_ID = 'coolWallet-appId';
const APP_PRIVATE_KEY = 'coolWallet-appPrivateKey';
const APP_PUBLIC_KEY = 'coolWallet-appPublicKey';
const CW_DEVICE_NAME = 'coolWallet-deviceName';
const CW_SE_PUBKEY = 'coolWalletPro-SEPublicKey';

class CoolWallet {
  constructor() {
    this.identifier = WALLET_TYPES.COOL_WALLET;
    this.isHardware = true;
    this.needPassword = NEED_PASSWORD;
    this.transport = {};
    this.deviceInstance = {};
    this.supportedPaths = bip44Paths[WALLET_TYPES.COOL_WALLET];
    this.isPro = false;
    this.meta = {
      name: 'CoolWallet S',
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
  async init(password) {
    const { network } = useGlobalStore();
    const _this = this;
    const transport = await createTransport();
    const device = transport.device;
    return new Promise((resolve, reject) => {
      if (!window.navigator.bluetooth) {
        return reject(new Error('browser not supported'));
      }
      if (device) {
        if (device.name.includes('CWP')) {
          _this.isPro = true;
          _this.meta.name = 'CoolWallet Pro';
          _this.meta.img.value = coolwalletPro;
        }

        WebBleTransport.connect(device)
          .then(async () => {
            _this.transport = transport;
            _this.identifier = device.name.includes('CWP')
              ? WALLET_TYPES.COOL_WALLET_PRO
              : WALLET_TYPES.COOL_WALLET_S;
            try {
              /**
               * if lastCWDeviceUsed !== device.name
               * assume that its a different cw device
               * throw moves it to catch so it registers
               */
              if (_this.lastCWDeviceUsed !== device.name) throw '';
              locstore.set(CW_DEVICE_NAME, device.name);
              if (_this.isPro) {
                _this.connectToCWP();
                const chainID = network.value.type.chainID;
                await _this.deviceInstance[chainID].getAddress(
                  _this.transport,
                  _this.appPrivateKey,
                  _this.appId,
                  0
                );
              } else {
                _this.connectToCWS();
                await _this.deviceInstance.getAddress(0);
              }
              resolve();
            } catch (e) {
              if (_this.isPro) {
                core.config.getSEPublicKey(_this.transport).then(res => {
                  localStorage.setItem(CW_SE_PUBKEY, res);
                  this.generateAndRegisterCWP(
                    password,
                    resolve,
                    device,
                    reject
                  );
                });
              } else {
                this.generateAndRegisterCWS(password, resolve, device, reject);
              }
            }
          })
          .catch(err => {
            errorHandler(err);
          });
      } else {
        reject(new Error('no device'));
      }
    });
  }

  generateAndRegisterCWP(password, cb, device, reject) {
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
        this.connectToCWP();
        cb();
      })
      .catch(e => {
        reject(e);
      });
  }
  generateAndRegisterCWS(password, cb, device, reject) {
    const { publicKey: appPublicKey, privateKey: appPrivateKey } =
      generateKeyPair();
    this.appPrivateKey = appPrivateKey;
    this.appPublicKey = appPublicKey;
    const coolWalletInstance = new cwsWallet(
      this.transport,
      this.appPrivateKey
    );
    coolWalletInstance
      .register(this.appPublicKey, password, APP_NAME)
      .then(appId => {
        this.appId = appId;
        locstore.set(APP_ID, appId);
        locstore.set(APP_PUBLIC_KEY, appPublicKey);
        locstore.set(APP_PRIVATE_KEY, appPrivateKey);
        locstore.set(CW_DEVICE_NAME, device.name);
        coolWalletInstance.setAppId(appId);
        this.connectToCWS();
        cb();
      })
      .catch(e => {
        reject(e);
      });
  }

  connectToCWS() {
    this.deviceInstance = new cwsETH(
      this.transport,
      this.appPrivateKey,
      this.appId
    );
  }

  connectToCWP() {
    this.deviceInstance = {
      1: new ETH(),
      56: new BSC()
    };
  }

  async getAccount(idx) {
    const { network, gasFeeMarketInfo, isEIP1559SupportedNetwork } =
      useGlobalStore();
    const chainID = network.value.type.chainID;
    const instance = this.isPro
      ? this.deviceInstance[chainID]
      : this.deviceInstance;
    const address = this.isPro
      ? await instance.getAddress(
          this.transport,
          this.appPrivateKey,
          this.appId,
          idx
        )
      : await instance.getAddress(idx);
    const txSigner = async txParam => {
      const legacySigner = async _txParam => {
        const tx = new Transaction.fromTxData(_txParam, {
          common: commonGenerator(network)
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

        const result = this.isPro
          ? await this.deviceInstance[chainID]
              .signTransaction(signTxData)
              .catch(errorHandler)
          : await this.deviceInstance
              .signTransaction(cwTx, idx)
              .catch(errorHandler);
        if (result) {
          const resultTx = Transaction.fromSerializedTx(result, {
            common: commonGenerator(network)
          });
          const signedChainId = calculateChainIdFromV(resultTx.v);
          if (signedChainId !== chainID)
            throw new Error(
              Vue.$i18n.t('errorsGlobal.invalid-network-id-sig', {
                got: signedChainId,
                expected: chainID
              }),
              'InvalidNetworkId'
            );
          return getSignTransactionObject(resultTx);
        }
        return result;
      };
      const eip1559Signer = async _txParam => {
        const feeMarket = gasFeeMarketInfo.value;
        const _txParams = Object.assign(
          eip1559Params(_txParam.gasPrice, feeMarket),
          _txParam
        );
        delete _txParams.gasPrice;
        const tx = FeeMarketEIP1559Transaction.fromTxData(_txParams, {
          common: commonGenerator(network)
        });
        const cwTx = {
          data: bufferToHex(tx.data),
          gasLimit: bufferToHex(tx.gasLimit),
          gasTipCap: bufferToHex(tx.maxPriorityFeePerGas),
          gasFeeCap: bufferToHex(tx.maxFeePerGas),
          nonce: bufferToHex(tx.nonce),
          to: bufferToHex(tx.to),
          value: bufferToHex(tx.value)
        };
        const signTxData = {
          transport: this.transport,
          appPrivateKey: this.appPrivateKey,
          appId: this.appId,
          transaction: cwTx,
          addressIndex: idx
        };
        const result = await instance.signEIP1559Transaction(signTxData);

        if (result) {
          const resultTx = FeeMarketEIP1559Transaction.fromSerializedTx(
            toBuffer(result),
            {
              common: commonGenerator(network)
            }
          );
          return getSignTransactionObject(resultTx);
        }
        return result;
      };

      if (isEIP1559SupportedNetwork.value && this.isPro) {
        try {
          return eip1559Signer(txParam);
        } catch (e) {
          return legacySigner(txParam);
        }
      }
      return legacySigner(txParam);
    };
    const msgSigner = async msg => {
      const signMsgData = {
        transport: this.transport,
        appPrivateKey: this.appPrivateKey,
        appId: this.appId,
        message: msg,
        addressIndex: idx
      };
      const result = this.isPro
        ? await instance.signMessage(signMsgData)
        : await instance.signMessage(msg, idx);
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
