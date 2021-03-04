import { Transaction } from 'ethereumjs-tx';
import { COOLWALLET as coolWalletType } from '../../bip44/walletTypes';
import HDWalletInterface from '@/wallets/HDWalletInterface';
import errorHandler from './errorHandler';
import cwsETH from '@coolwallets/eth';
import cwsWallet, { generateKeyPair } from '@coolwallets/wallet';
import bip44Paths from '../../bip44';
import { bufferToHex } from 'ethereumjs-util';
import cwsTransportLib from '@coolwallets/transport-web-ble';
import Vue from 'vue';
import locStore from 'store';

import store from '@/store';
import {
  getSignTransactionObject,
  sanitizeHex,
  getBufferFromHex,
  calculateChainIdFromV
} from '../../utils';
import commonGenerator from '@/helpers/commonGenerator';

const NEED_PASSWORD = true;
const APP_NAME = 'MyEtherWalletV5';

class CoolWallet {
  constructor() {
    this.identifier = coolWalletType;
    this.isHardware = true;
    this.needPassword = NEED_PASSWORD;
    this.transport = {};
    this.deviceInstance = {};
    this.supportedPaths = bip44Paths[coolWalletType];
    this.appId = locStore.get('coolWallet-appId')
      ? locStore.get('coolWallet-appId')
      : '';
    this.appPrivateKey = locStore.get('coolWallet-appPrivateKey')
      ? locStore.get('coolWallet-appPrivateKey')
      : '';
    this.appPublicKey = locStore.get('coolWallet-appPublicKey')
      ? locStore.get('coolWallet-appPublicKey')
      : '';
    this.firstTimeConnecting =
      this.appPrivateKey === '' &&
      this.appPublicKey === '' &&
      this.appId === '';
  }
  init(password) {
    const _this = this;
    return new Promise((resolve, reject) => {
      cwsTransportLib.listen((error, device) => {
        if (error) {
          reject(error);
        }
        if (device) {
          cwsTransportLib.connect(device).then(async _transport => {
            _this.transport = _transport;
            try {
              this.deviceInstance = new cwsETH(
                this.transport,
                this.appPrivateKey,
                this.appId
              );
              await this.deviceInstance.getAddress(0);
              resolve();
            } catch (e) {
              const {
                publicKey: appPublicKey,
                privateKey: appPrivateKey
              } = generateKeyPair();
              this.appPrivateKey = appPrivateKey;
              this.appPublicKey = appPublicKey;
              const coolWalletInstance = new cwsWallet(
                this.transport,
                this.appPrivateKey
              );
              await coolWalletInstance
                .register(this.appPublicKey, password, APP_NAME)
                .then(appId => {
                  locStore.set('coolWallet-appId', appId);
                  locStore.set('coolWallet-appPublicKey', appPublicKey);
                  locStore.set('coolWallet-appPrivateKey', appPrivateKey);
                  this.appId = appId;
                  coolWalletInstance.setAppId(appId);
                  this.deviceInstance = new cwsETH(
                    this.transport,
                    this.appPrivateKey,
                    this.appId
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
        common: commonGenerator(store.state.main.network)
      });
      const cwTx = {
        data: bufferToHex(tx.data),
        gasLimit: bufferToHex(tx.gasLimit),
        gasPrice: bufferToHex(tx.gasPrice),
        nonce: bufferToHex(tx.nonce),
        to: bufferToHex(tx.to),
        value: bufferToHex(tx.value),
        chainId: store.state.main.network.type.chainID
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
      null
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
