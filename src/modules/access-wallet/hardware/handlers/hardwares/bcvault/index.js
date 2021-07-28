import { Transaction } from '@ethereumjs/tx';
import { bufferToHex } from 'ethereumjs-util';
import * as bc from 'bc-vault-js';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import HDWalletInterface from '@/modules/access-wallet/common/HDWalletInterface';
import errorHandler from './errorHandler';
import BigNumber from 'bignumber.js';
import commonGenerator from '@/core/helpers/commonGenerator';
import store from '@/core/store';
import Vue from 'vue';
import bcvault from '@/assets/images/icons/wallets/bcvault.png';

import {
  getBufferFromHex,
  sanitizeHex,
  getSignTransactionObject,
  calculateChainIdFromV
} from '@/modules/access-wallet/common/utils';

const NEED_PASSWORD = false;

class BCVault {
  constructor() {
    this.identifier = WALLET_TYPES.bcVaultType;
    this.isHardware = true;
    this.needPassword = NEED_PASSWORD;
    this.bcWallet = new bc.BCJS(() => {});
    this.deviceNumber = null;
    this.bcWalletType = bc.WalletType.ethereum;
    this.meta = {
      name: 'BC Vault',
      img: {
        type: 'img',
        value: bcvault
      }
    };
  }

  async init() {
    const _self = this;
    return new Promise((resolve, reject) => {
      _self.bcWallet
        .getDevices()
        .then(res => {
          if (!res) {
            reject({
              jsError: 'mew3'
            });
            return;
          } else if (res && res.length === 0) {
            reject({
              jsError: 'mew5'
            });
            return;
          }
          _self.deviceNumber = res;
          _self.bcWallet
            .EnterGlobalPin(_self.deviceNumber[0], _self.bcWalletType)
            .then(() => {
              _self.bcWallet
                .getBatchWalletDetails(_self.deviceNumber[0], [
                  _self.bcWalletType
                ])
                .then(walletRes => {
                  if (!walletRes || walletRes.length === 0) {
                    return reject({
                      jsError: 'mew4'
                    });
                  }
                  resolve(walletRes);
                })
                .catch(reject);
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }

  getAccount(address) {
    const path = null;
    const txSigner = async tx => {
      const web3Utils = store.state.wallet.web3.utils;
      if (store.state.wallet.network.type.chainID !== 1) {
        errorHandler({
          jsError: 'mew2'
        });
        return;
      }
      delete tx['from'];
      tx['from'] = address;
      tx = new Transaction(tx, {
        common: commonGenerator(store.getters['global/network'])
      });
      const newTx = {};
      newTx['feeCount'] = web3Utils.hexToNumber(bufferToHex(tx['gasLimit']));
      newTx['feePrice'] = BigNumber(bufferToHex(tx['gasPrice'])).toString();
      newTx['amount'] = BigNumber(bufferToHex(tx['value'])).toString() || 0;
      if (bufferToHex(tx['data']) !== '0x') {
        newTx['contractData'] = bufferToHex(tx['data']);
      }
      newTx['to'] = bufferToHex(tx['to']);
      newTx['from'] = address;
      newTx['advanced'] = {
        eth: {
          nonce:
            bufferToHex(tx['nonce']) === '0x'
              ? 0
              : web3Utils.hexToNumber(bufferToHex(tx['nonce']))
        }
      };
      const networkId = tx.getChainId();
      const result = await this.bcWallet
        .GenerateTransaction(
          this.deviceNumber[0],
          this.bcWalletType,
          newTx,
          false
        )
        .catch(err => {
          errorHandler(err);
        });
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
    };
    const msgSigner = async msg => {
      const result = await this.bcWallet
        .SignData(this.deviceNumber[0], this.bcWalletType, address, msg)
        .catch(errorHandler);
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
      path,
      address,
      true,
      this.identifier,
      errorHandler,
      txSigner,
      msgSigner,
      null,
      this.meta
    );
  }
}

const createWallet = () => {
  const _bcvault = new BCVault();
  return _bcvault;
};

createWallet.errorHandler = errorHandler;

export default createWallet;
