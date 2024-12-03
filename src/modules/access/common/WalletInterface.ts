import {
  getBufferFromHex,
  getSignTransactionObject,
  calculateChainIdFromV,
  eip1559Params,
  commonGenerator,
  bufferToHex,
} from './helpers';

import type {
  EthSaleKeystore,
  V3Keystore,
  MEWKeystore,
  Transaction
} from './types'

import {
  hashPersonalMessage,
  publicToAddress,
  ecsign,
  isValidPrivate,
  isValidPublic,
  privateToPublic,
} from '@ethereumjs/util';

import { LegacyTransaction, FeeMarketEIP1559Transaction } from '@ethereumjs/tx';
import { toChecksumAddress } from '@/utils/addressUtils';
import { useGlobalStore } from '@/stores/global_store';
import { storeToRefs } from 'pinia';

export default class WalletInterface {
  keystore: { file: EthSaleKeystore | V3Keystore | MEWKeystore | null, name: string } | null;
  identifier: string;
  isPub: boolean;
  key: string | Buffer;
  privateKey: Buffer | null;
  publicKey: Uint8Array | null;
  isPubOnly: boolean;
  isAddress: boolean;

  constructor(key: string | Buffer, isPub: boolean = false, identifier: string, keystore?: { file: EthSaleKeystore | V3Keystore | MEWKeystore, name: string }) {
    this.keystore = keystore ? keystore : null;
    this.identifier = identifier;
    this.isPub = isPub;
    this.key = key;
    // needs to be initalized
    this.privateKey = null;
    this.publicKey = null;
    this.isPubOnly = true;
    this.isAddress = false;

    if (!isPub) {
      const _privateKey = Buffer.isBuffer(key) ? key : getBufferFromHex(key);
      try {
        if (_privateKey.length !== 32 || !isValidPrivate(_privateKey)) {
          throw new Error('Private key does not satisfy the curve requirements (ie. it is invalid)');
        }
      } catch (e) {
        throw e;
      }
      this.privateKey = _privateKey;
      this.publicKey = privateToPublic(this.privateKey);
      this.isPubOnly = false
    } else {
      const _publicKey = Buffer.isBuffer(key) ? key : getBufferFromHex(key);
      if (_publicKey.length !== 20) {
        try {
          if (!isValidPublic(_publicKey, true)) throw new Error('Invalid public key');
        } catch {
          throw new Error('Invalid public key');
        }
      }
      if (_publicKey.length === 20) {
        this.isAddress = true;
      }
      this.publicKey = _publicKey;
      this.isPubOnly = true;
    }
  }

  getPrivateKey() {
    if (this.isPubOnly) throw new Error('This is a public key only wallet');
    return this.privateKey;
  }

  getPrivateKeyString() {
    if (this.isPubOnly) throw new Error('This is a public key only wallet');
    return bufferToHex(this.getPrivateKey() as Buffer);
  }

  getKeystore() {
    return this.keystore;
  }

  getPublicKey() {
    if (this.isAddress) throw new Error('This is a public key only wallet');
    return this.publicKey;
  }

  getPublicKeyString() {
    return bufferToHex(this.getPublicKey() as Buffer);
  }

  getAddress() {
    if (this.isAddress) return this.publicKey;
    return publicToAddress(this.publicKey as Buffer, true);
  }

  getAddressString() {
    return bufferToHex(this.getAddress() as Buffer);
  }

  getChecksumAddressString() {
    return toChecksumAddress(this.getAddressString());
  }

  // temp any
  signTransaction(txParams: Transaction, signer: (txParams: Transaction) => string) {
    const store = useGlobalStore();
    // these will change when tx generation is enabled
    const { gasFeeMarketInfo } = store;
    const { network, isEIP1559SupportedNetwork } = storeToRefs(store);
    if (this.isPubOnly && typeof signer !== 'function') throw new Error('Public key wallet needs a signer function');
    if (!this.isPubOnly) {
      return new Promise(resolve => {
        let tx = LegacyTransaction.fromTxData(txParams, { common: commonGenerator(network.value) });
        if (isEIP1559SupportedNetwork.value) { // probably assume this in the future?
          const feeMarket = gasFeeMarketInfo();
          const _txParams = Object.assign(eip1559Params(txParams.gasPrice as bigint, feeMarket), txParams, { gasPrice: null });
          tx = FeeMarketEIP1559Transaction.fromTxData(_txParams, { common: commonGenerator(network.value) }) as unknown as LegacyTransaction; // temp: maybe look into refactoring this
        }

        const chainId = tx.common.chainId();
        tx = tx.sign(this.getPrivateKey() as Buffer);
        const signedTxToJson = tx.toJSON();
        const signedChainId = signedTxToJson.chainId ? parseInt(signedTxToJson.chainId.toString()) : calculateChainIdFromV(signedTxToJson.v as string);
        if (chainId !== BigInt(signedChainId)) {
          throw new Error(`Invalid networkdId signature returned. Expected: ${chainId}, Got: ${signedChainId}`);
        }
        resolve(getSignTransactionObject(tx));
      })
    }
    return signer(txParams);
  }

  // temp any
  signMessage(msg: string, signer: (param: string) => Promise<Buffer>) {
    if (this.isPubOnly && typeof signer !== 'function') throw new Error('Public key wallet needs a signer function');
    return new Promise((resolve, reject) => {
      if (!this.isPubOnly) {
        const msgHash = hashPersonalMessage(new Uint8Array(Buffer.from(msg, 'utf-8')));
        const signed = ecsign(msgHash, this.getPrivateKey() as Buffer);
        resolve(Buffer.concat([Buffer.from(signed.r), Buffer.from(signed.s), Buffer.from([Number(signed.v)])]));
      } else {

        signer(msg).then(resolve).catch(e => reject(e));
      }
    })
  }
}
