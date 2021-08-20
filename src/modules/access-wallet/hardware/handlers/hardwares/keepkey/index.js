import * as keepkeyWebUSB from '@shapeshiftoss/hdwallet-keepkey-webusb';
import {
  Keyring,
  bip32ToAddressNList,
  Events
} from '@shapeshiftoss/hdwallet-core';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import bip44Paths from '@/modules/access-wallet/hardware/handlers/bip44';
import HDWalletInterface from '@/modules/access-wallet/common/HDWalletInterface';
import { getHexTx } from './utils';
import {
  getBufferFromHex,
  sanitizeHex,
  getSignTransactionObject,
  calculateChainIdFromV
} from '@/modules/access-wallet/common/helpers';
import HDKey from 'hdkey';
import { Transaction } from 'ethereumjs-tx';
import errorHandler from './errorHandler';
import store from '@/core/store';
import commonGenerator from '@/core/helpers/commonGenerator';
import Vue from 'vue';
import { EventBus } from '@/core/plugins/eventBus';
import keepkeyImg from '@/assets/images/icons/wallets/keepkey.svg';
import { numberToHex } from 'web3-utils';
const NEED_PASSWORD = false;

class KeepkeyWallet {
  constructor() {
    this.keyring = new Keyring();
    this.keepkeyAdapter = keepkeyWebUSB.WebUSBKeepKeyAdapter.useKeyring(
      this.keyring
    );
    this.identifier = WALLET_TYPES.KEEPKEY;
    this.isHardware = true;
    this.needPassword = NEED_PASSWORD;
    this.supportedPaths = bip44Paths[WALLET_TYPES.KEEPKEY];
    this.meta = {
      name: 'KeepKey',
      img: {
        type: 'img',
        value: keepkeyImg
      }
    };
  }
  async init(basePath) {
    this.basePath = basePath ? basePath : this.supportedPaths[0].path;
    this.isHardened = this.basePath.split('/').length - 1 === 2;
    this.keepkey = await this.keepkeyAdapter.pairDevice(undefined, true);
    this.keyring.on(['*', '*', Events.PIN_REQUEST], () => {
      EventBus.$emit('enablePin', { name: this.identifier }, pin => {
        this.keepkey.sendPin(pin).catch(errorHandler);
      });
    });
    this.keyring.on(['*', '*', Events.PASSPHRASE_REQUEST], () => {
      EventBus.$emit(
        'showHardwarePassword',
        { name: this.identifier },
        passPhrase => {
          this.keepkey.sendPassphrase(passPhrase).catch(errorHandler);
        }
      );
    });
    await this.keepkey.initialize(undefined, true, false);
    if (!this.isHardened) {
      const rootPub = await getRootPubKey(this.keepkey, this.basePath);
      this.hdKey = new HDKey();
      this.hdKey.publicKey = Buffer.from(rootPub.publicKey, 'hex');
      this.hdKey.chainCode = Buffer.from(rootPub.chainCode, 'hex');
    } else {
      await getRootPubKey(this.keepkey, this.basePath + '/0');
    }
  }
  async getAccount(idx) {
    let derivedKey, accountPath;
    if (this.isHardened) {
      const rootPub = await getRootPubKey(
        this.keepkey,
        this.basePath + '/' + idx + "'"
      );
      const hdKey = new HDKey();
      hdKey.publicKey = Buffer.from(rootPub.publicKey, 'hex');
      hdKey.chainCode = Buffer.from(rootPub.chainCode, 'hex');
      derivedKey = hdKey.derive('m/0/0');
      accountPath = this.basePath + '/' + idx + "'" + '/0/0';
    } else {
      derivedKey = this.hdKey.derive('m/' + idx);
      accountPath = this.basePath + '/' + idx;
    }
    const txSigner = async tx => {
      tx = new Transaction(tx, {
        common: commonGenerator(store.getters['global/network'])
      });
      const hexTx = getHexTx(tx);
      const networkId = tx.getChainId();
      hexTx.addressNList = bip32ToAddressNList(accountPath);
      const result = await this.keepkey.ethSignTx(hexTx);
      tx.v = getBufferFromHex(sanitizeHex(numberToHex(result.v)));
      tx.r = getBufferFromHex(sanitizeHex(result.r));
      tx.s = getBufferFromHex(sanitizeHex(result.s));
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
    };
    const msgSigner = async msg => {
      const response = await this.keepkey.ethSignMessage({
        addressNList: bip32ToAddressNList(accountPath),
        message: msg
      });
      return Buffer.from(response.signature.substr(2), 'hex');
    };
    const displayAddress = async () => {
      await this.keepkey.ethGetAddress({
        addressNList: bip32ToAddressNList(accountPath),
        showDisplay: true
      });
    };
    return new HDWalletInterface(
      accountPath,
      derivedKey.publicKey,
      this.isHardware,
      this.identifier,
      errorHandler,
      txSigner,
      msgSigner,
      displayAddress,
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
const createWallet = async basePath => {
  const _keepkeyWallet = new KeepkeyWallet();
  await _keepkeyWallet.init(basePath);
  return _keepkeyWallet;
};

createWallet.errorHandler = errorHandler;

const getRootPubKey = async (_keepkey, _path) => {
  const pubObj = await _keepkey.getPublicKeys([
    {
      addressNList: bip32ToAddressNList(_path),
      showDisplay: false,
      curve: 'secp256k1',
      coin: 'Bitcoin'
    }
  ]);
  const hdkey = HDKey.fromExtendedKey(pubObj[0].xpub);
  return {
    publicKey: hdkey.publicKey.toString('hex'),
    chainCode: hdkey.chainCode.toString('hex')
  };
};

export default createWallet;
