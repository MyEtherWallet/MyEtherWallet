import Ledger from '@ledgerhq/hw-app-eth';
import ethTx from 'ethereumjs-tx';
import u2fTransport from '@ledgerhq/hw-transport-u2f';
import { LEDGER as ledgerType } from '../../bip44/walletTypes';
import bip44Paths from '../../bip44';
import HDWalletInterface from '@/wallets/HDWalletInterface';
import * as HDKey from 'hdkey';
import {
  getSignTransactionObject,
  getBufferFromHex,
  sanitizeHex
} from '../../utils';

const NEED_PASSWORD = false;

class ledgerWallet {
  constructor() {
    this.identifier = ledgerType;
    this.isHardware = true;
    this.needPassword = NEED_PASSWORD;
    this.supportedPaths = bip44Paths[ledgerType];
  }
  async init(basePath) {
    this.basePath = basePath ? basePath : this.supportedPaths[0].path;
    this.transport = await getLedgerTransport();
    this.ledger = new Ledger(this.transport);
    this.appConfig = await getLedgerAppConfig(this.ledger);
    const rootPub = await getRootPubKey(this.ledger, this.basePath);
    this.hdKey = new HDKey();
    this.hdKey.publicKey = Buffer.from(rootPub.publicKey, 'hex');
    this.hdKey.chainCode = Buffer.from(rootPub.chainCode, 'hex');
  }
  getAccount(idx) {
    const derivedKey = this.hdKey.derive('m/' + idx);
    const txSigner = async tx => {
      tx = new ethTx(tx);
      const networkId = tx._chainId;
      tx.raw[6] = Buffer.from([networkId]);
      tx.raw[7] = Buffer.from([]);
      tx.raw[8] = Buffer.from([]);
      const result = await this.ledger.signTransaction(
        this.basePath + '/' + idx,
        tx.serialize().toString('hex')
      );
      tx.v = getBufferFromHex(result.v);
      tx.r = getBufferFromHex(result.r);
      tx.s = getBufferFromHex(result.s);
      const signedChainId = Math.floor((tx.v[0] - 35) / 2);
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
      const result = await this.ledger.signPersonalMessage(
        this.basePath + '/' + idx,
        Buffer.from(msg).toString('hex')
      );
      const v = parseInt(result.v, 10) - 27;
      const vHex = sanitizeHex(v.toString(16));
      return Buffer.concat([
        getBufferFromHex(result.r),
        getBufferFromHex(result.s),
        getBufferFromHex(vHex)
      ]);
    };
    return new HDWalletInterface(
      this.basePath + '/' + idx,
      derivedKey.publicKey,
      this.isHardware,
      this.identifier,
      txSigner,
      msgSigner
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
  const _ledgerWallet = new ledgerWallet();
  await _ledgerWallet.init(basePath);
  return _ledgerWallet;
};
const getLedgerTransport = async () => {
  const transport = await u2fTransport.create(3000, 3000);
  return transport;
};
const getLedgerAppConfig = async _ledger => {
  const appConfig = await _ledger.getAppConfiguration();
  return appConfig;
};
const getRootPubKey = async (_ledger, _path) => {
  const pubObj = await _ledger.getAddress(_path, false, true);
  return {
    publicKey: pubObj.publicKey,
    chainCode: pubObj.chainCode
  };
};

export default createWallet;
