import {
  BitBox02API,
  getDevicePath,
  api,
  sanitizeEthTransactionData
} from 'bitbox02-api';

import { BITBOX as bitboxType } from '../../bip44/walletTypes';
import bip44Paths from '../../bip44';
import HDWalletInterface from '@/wallets/HDWalletInterface';
import * as HDKey from 'hdkey';
import { Transaction } from 'ethereumjs-tx';
import {
  getSignTransactionObject,
  getHexTxObject,
  calculateChainIdFromV
} from '../../utils';
import errorHandler from './errorHandler';
import store from '@/store';
import commonGenerator from '@/helpers/commonGenerator';
import { Misc } from '@/helpers';

const NEED_PASSWORD = false;

class BitBox02Wallet {
  constructor(logout) {
    this.identifier = bitboxType;
    this.isHardware = true;
    this.needPassword = NEED_PASSWORD;
    this.supportedPaths = bip44Paths[bitboxType];
    this.logout = logout;
    this.status = undefined;
    this.pairingConfirmed = false;
  }
  async init(basePath) {
    this.basePath = basePath ? basePath : this.supportedPaths[0].path;
    const devicePath = await getDevicePath();
    this.BitBox02 = new BitBox02API(devicePath);
  }

  async connect() {
    await this.BitBox02.connect(
      pairingCode => {
        this.pairingCode = pairingCode;
      },
      async () => {
        return new Promise(resolve => {
          this.pairingConfirmed = true;
          this.pairingConfirmationResolve = resolve;
        });
      },
      attestationResult => {
        this.attestation = attestationResult;
      },
      () => {
        this.logout('clearWallet');
      },
      status => {
        this.status = status;
      }
    );

    if (this.BitBox02.fw.Product() !== api.common.Product.BitBox02Multi) {
      throw new Error('Unsupported device');
    }

    const rootPub = await this.BitBox02.ethGetRootPubKey();
    this.hdKey = HDKey.fromExtendedKey(rootPub);

    if (!this.attestation) {
      errorHandler('Attestation failed');
    }
  }

  getAccount(idx) {
    const derivedKey = this.hdKey.derive('m/' + idx);
    const txSigner = async tx => {
      tx = new Transaction(tx, {
        common: commonGenerator(store.state.main.network)
      });
      const networkId = tx.getChainId();
      const signatureData = {
        account: idx,
        recipient: tx.to,
        tx: getHexTxObject(tx),
        data: tx.data
      };
      const sanitizedData = sanitizeEthTransactionData(signatureData);
      const result = await this.BitBox02.ethSignTransaction(sanitizedData);
      tx.r = result.r;
      tx.s = result.s;
      tx.v = result.v;

      const signedChainId = calculateChainIdFromV(tx.v);
      if (signedChainId !== networkId)
        throw new Error(
          'Invalid networkId signature returned. Expected: ' +
            networkId +
            ', Got: ' +
            signedChainId,
          'InvalidNetworkId'
        );
      return getSignTransactionObject(tx);
    };

    const msgSigner = async msg => {
      const result = await this.BitBox02.ethSignMessage({
        account: idx,
        message: Misc.toBuffer(msg)
      });
      return Buffer.concat([result.r, result.s, result.v]);
    };

    const displayAddress = async () => {
      await this.BitBox02.ethDisplayAddress(idx);
    };

    return new HDWalletInterface(
      this.basePath + '/' + idx,
      derivedKey.publicKey,
      this.isHardware,
      this.identifier,
      errorHandler,
      txSigner,
      msgSigner,
      displayAddress
    );
  }

  getCurrentPath() {
    return this.basePath;
  }

  getSupportedPaths() {
    return this.supportedPaths;
  }
}

const createWallet = async (basePath, logout) => {
  const _bb02Wallet = new BitBox02Wallet(logout);
  await _bb02Wallet.init(basePath);
  return _bb02Wallet;
};
createWallet.errorHandler = errorHandler;

export default createWallet;
