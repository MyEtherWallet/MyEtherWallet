import * as HDKey from 'hdkey';
import { Transaction, FeeMarketEIP1559Transaction } from '@ethereumjs/tx';
import { hashPersonalMessage, ecsign } from 'ethereumjs-util';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import bip44Paths from '@/modules/access-wallet/hardware/handlers/bip44';
import HDWalletInterface from '@/modules/access-wallet/common/HDWalletInterface';
import {
  getSignTransactionObject,
  calculateChainIdFromV,
  eip1559Params
} from '@/modules/access-wallet/common/helpers';
import errorHandler from './errorHandler';
import store from '@/core/store';
import commonGenerator from '@/core/helpers/commonGenerator';
import toBuffer from '@/core/helpers/toBuffer';
import Vue from 'vue';

const bip39 = require('bip39');
const NEED_PASSWORD = true;
const IS_HARDWARE = false;

class MnemonicWallet {
  constructor(mnemonic, password) {
    if (!bip39.validateMnemonic(mnemonic))
      throw Vue.$i18n.t('createWallet.mnemonic.invalid-mnemonic');
    this.identifier = WALLET_TYPES.MNEMONIC;
    this.isHardware = IS_HARDWARE;
    this.needPassword = NEED_PASSWORD;
    this.mnemonic = mnemonic;
    this.password = password;
    this.supportedPaths = bip44Paths[WALLET_TYPES.MNEMONIC];
    this.meta = {
      name: 'Mnemonic',
      img: {
        type: 'mew-icon',
        value: 'mnemonic'
      }
    };
  }
  async init(basePath) {
    this.basePath = basePath ? basePath : this.supportedPaths[0].path;
    this.hdKey = HDKey.fromMasterSeed(
      bip39.mnemonicToSeedSync(this.mnemonic, this.password)
    );
  }
  getAccount(idx) {
    const derivedKey = this.hdKey.derive(this.basePath + '/' + idx);
    const txSigner = async txParams => {
      let tx = Transaction.fromTxData(txParams, {
        common: commonGenerator(store.getters['global/network'])
      });
      if (store.getters['global/isEIP1559SupportedNetwork']) {
        const feeMarket = store.getters['global/gasFeeMarketInfo'];
        const _txParams = Object.assign(
          eip1559Params(txParams.gasPrice, feeMarket),
          txParams
        );
        delete _txParams.gasPrice;
        tx = FeeMarketEIP1559Transaction.fromTxData(_txParams, {
          common: commonGenerator(store.getters['global/network'])
        });
      }
      const networkId = tx.common.chainId();
      tx = tx.sign(derivedKey.privateKey);
      const signedChainId = tx.chainId
        ? parseInt(tx.chainId.toString())
        : calculateChainIdFromV(tx.v);
      if (signedChainId !== networkId)
        throw Vue.$i18n.t('createWallet.mnemonic.invalid-network-id', {
          networkId: networkId,
          signedChainId: signedChainId
        });
      return getSignTransactionObject(tx);
    };
    const msgSigner = async msg => {
      const msgHash = hashPersonalMessage(toBuffer(msg));
      const signed = ecsign(msgHash, derivedKey.privateKey);
      return Buffer.concat([
        Buffer.from(signed.r),
        Buffer.from(signed.s),
        Buffer.from([signed.v])
      ]);
    };
    return new HDWalletInterface(
      this.basePath + '/' + idx,
      derivedKey.privateKey,
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
const createWallet = async (mnemonic, password, basePath) => {
  const _mnemonicWallet = new MnemonicWallet(mnemonic, password);
  await _mnemonicWallet.init(basePath);
  return _mnemonicWallet;
};
createWallet.errorHandler = errorHandler;

export default createWallet;
