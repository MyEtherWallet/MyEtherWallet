import { BitBox02API, getDevicePath, constants } from 'bitbox02-api';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import bip44Paths from '@/modules/access-wallet/hardware/handlers/bip44';
import HDWalletInterface from '@/modules/access-wallet/common/HDWalletInterface';
import * as HDKey from 'hdkey';
import { Transaction } from '@ethereumjs/tx';
import {
  getSignTransactionObject,
  calculateChainIdFromV
} from '@/modules/access-wallet/common/helpers';
import errorHandler from './errorHandler';
import store from '@/core/store';
import commonGenerator from '@/core/helpers/commonGenerator';
import toBuffer from '@/core/helpers/toBuffer';
import { BN } from 'web3-utils';

const NEED_PASSWORD = false;

class BitBox02Wallet {
  constructor() {
    this.identifier = WALLET_TYPES.BITBOX2;
    this.isHardware = true;
    this.needPassword = NEED_PASSWORD;
    this.supportedPaths = bip44Paths[WALLET_TYPES.BITBOX2];
    this.status = undefined;
    this.pairingConfirmed = false;
    this.meta = {
      name: 'BitBox02',
      img: {
        type: 'mew-icon',
        value: 'bitbox'
      }
    };
  }
  async connect() {
    const devicePath = await getDevicePath();
    this.BitBox02 = new BitBox02API(devicePath);
  }

  async init(basePath) {
    this.basePath = basePath ? basePath : this.supportedPaths[0].path;
    try {
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
          store.dispatch('wallet/removeWallet');
        },
        status => {
          this.status = status;
        }
      );

      if (
        this.BitBox02.firmware().Product() !== constants.Product.BitBox02Multi
      ) {
        throw new Error('Unsupported device');
      }

      const rootPub = await this.BitBox02.ethGetRootPubKey(this.basePath);
      this.hdKey = HDKey.fromExtendedKey(rootPub);

      if (!this.attestation) {
        errorHandler({ message: 'Attestation failed' });
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  getAccount(idx) {
    const derivedKey = this.hdKey.derive('m/' + idx);
    const txSigner = async txParams => {
      const tx = new Transaction.fromTxData(txParams, {
        common: commonGenerator(store.getters['global/network'])
      });
      const networkId = tx.common.chainId();
      const signingData = {
        keypath: this.basePath + '/' + idx,
        chainId: networkId,
        tx: {
          nonce: BN(tx.nonce).toArrayLike(Buffer, 'be', 32),
          gasPrice: BN(tx.gasPrice).toArrayLike(Buffer, 'be', 32),
          gasLimit: BN(tx.gasLimit).toArrayLike(Buffer, 'be', 32),
          to: tx.to.toBuffer(),
          value: BN(tx.value).toArrayLike(Buffer, 'be', 32),
          data: tx.data
        }
      };
      const result = await this.BitBox02.ethSignTransaction(signingData);
      tx.r = Buffer.from(result.r);
      tx.s = Buffer.from(result.s);
      tx.v = Buffer.from(result.v);

      const signedChainId = calculateChainIdFromV(tx.v);
      if (signedChainId !== networkId)
        throw new Error(
          'Invalid networkId signature returned. Expected: ' +
            networkId +
            ', Got: ' +
            signedChainId,
          'InvalidNetworkId'
        );
      return getSignTransactionObject(Transaction.fromTxData(tx));
    };

    const msgSigner = async msg => {
      const result = await this.BitBox02.ethSignMessage({
        keypath: this.basePath + '/' + idx,
        message: toBuffer(msg)
      });
      return Buffer.concat([
        Buffer.from(result.r),
        Buffer.from(result.s),
        Buffer.from(result.v)
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

const createWallet = async () => {
  try {
    const _bb02Wallet = new BitBox02Wallet();
    await _bb02Wallet.connect();
    return _bb02Wallet;
  } catch (e) {
    errorHandler(e);
  }
};
createWallet.errorHandler = errorHandler;

export default createWallet;
