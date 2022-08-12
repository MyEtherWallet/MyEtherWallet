// import { BitBox02API, getDevicePath, constants } from 'bitbox02-api';

import { BITBOX02 as bitbox02Type } from '../../bip44/walletTypes';
import bip44Paths from '../../bip44';
import HDWalletInterface from '@/wallets/HDWalletInterface';
import * as HDKey from 'hdkey';
import { Transaction } from 'ethereumjs-tx';
import { getSignTransactionObject, calculateChainIdFromV } from '../../utils';
import errorHandler from './errorHandler';
import store from '@/store';
import commonGenerator from '@/helpers/commonGenerator';
import { Misc } from '@/helpers';

const NEED_PASSWORD = false;

class BitBox02Wallet {
  constructor() {
    this.identifier = bitbox02Type;
    this.isHardware = true;
    this.needPassword = NEED_PASSWORD;
    this.supportedPaths = bip44Paths[bitbox02Type];
    this.status = undefined;
    this.pairingConfirmed = false;
  }
  async connect() {
    this.BitBox02 = {};
  }

  async init(basePath) {
    this.basePath = basePath ? basePath : this.supportedPaths[0].path;
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
        store.dispatch('main/clearWallet');
      },
      status => {
        this.status = status;
      }
    );

    if (this.BitBox02.firmware().Product() !== '') {
      throw new Error('Unsupported device');
    }

    const rootPub = await this.BitBox02.ethGetRootPubKey(this.basePath);
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
      const signingData = {
        keypath: this.basePath + '/' + idx,
        chainId: tx.getChainId(),
        tx: tx
      };
      const result = await this.BitBox02.ethSignTransaction(signingData);
      tx.r = new Buffer(result.r);
      tx.s = new Buffer(result.s);
      tx.v = new Buffer(result.v);

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
        keypath: this.basePath + '/' + idx,
        message: Misc.toBuffer(msg)
      });
      return Buffer.concat([
        new Buffer(result.r),
        new Buffer(result.s),
        new Buffer(result.v)
      ]);
    };

    const displayAddress = async () => {
      await this.BitBox02.ethDisplayAddress(this.basePath + '/' + idx);
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

const createWallet = async () => {
  const _bb02Wallet = new BitBox02Wallet();
  await _bb02Wallet.connect();
  return _bb02Wallet;
};
createWallet.errorHandler = errorHandler;

export default createWallet;
