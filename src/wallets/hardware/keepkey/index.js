import { WebUSBDevice, Messages, KeepKey } from '@keepkey/keepkey.js';
import { KEEPKEY as keepkeyType } from '../../bip44/walletTypes';
import bip44Paths from '../../bip44';
import HDWalletInterface from '@/wallets/HDWalletInterface';
import { nodeVector, getUint8Tx } from './utils';
import {
  getBufferFromHex,
  sanitizeHex,
  getSignTransactionObject,
  calculateChainIdFromV
} from '../../utils';
import * as HDKey from 'hdkey';
import ethUtil from 'ethereumjs-util';
import ethTx from 'ethereumjs-tx';

const { MessageType } = Messages;
const {
  MESSAGETYPE_BUTTONREQUEST,
  MESSAGETYPE_PINMATRIXREQUEST,
  MESSAGETYPE_PASSPHRASEREQUEST
} = MessageType;

const NEED_PASSWORD = false;

class KeepkeyWallet {
  constructor() {
    this.identifier = keepkeyType;
    this.isHardware = true;
    this.needPassword = NEED_PASSWORD;
    this.supportedPaths = bip44Paths[keepkeyType];
  }
  async init(basePath) {
    this.basePath = basePath ? basePath : this.supportedPaths[0].path;
    const usbDevice = await WebUSBDevice.requestPair();
    const device = new WebUSBDevice({ usbDevice });
    this.keepkey = KeepKey.withWebUSB(device);
    this.keepkey.device.events.on(
      String(MESSAGETYPE_BUTTONREQUEST),
      requestMsg => {
        console.log('button request', requestMsg);
      }
    );
    this.keepkey.device.events.on(
      String(MESSAGETYPE_PINMATRIXREQUEST),
      requestMsg => {
        console.log('pin request', requestMsg);
        window.setPin = pin => {
          this.keepkey.acknowledgeWithPin(pin).then(console.log);
        };
      }
    );
    this.keepkey.device.events.on(
      String(MESSAGETYPE_PASSPHRASEREQUEST),
      requestMsg => {
        console.log('passphrase request', requestMsg);
        window.setPass = pin => {
          this.keepkey.acknowledgeWithPassphrase(pin).then(console.log);
        };
      }
    );
    await this.keepkey.initialize();
    const rootPub = await getRootPubKey(this.keepkey, this.basePath);
    this.hdKey = new HDKey();
    this.hdKey.publicKey = Buffer.from(rootPub.publicKey, 'hex');
    this.hdKey.chainCode = Buffer.from(rootPub.chainCode, 'hex');
  }
  async getAccount(idx) {
    const derivedKey = this.hdKey.derive('m/' + idx);
    const txSigner = async tx => {
      tx = new ethTx(tx);
      const hexTx = getUint8Tx(tx);
      const networkId = tx._chainId;
      hexTx.addressNList = nodeVector(this.basePath + '/' + idx);
      const result = await this.keepkey.ethereumSignTx(
        hexTx,
        null,
        null,
        hexTx.data,
        networkId
      );
      tx.v = getBufferFromHex(sanitizeHex(result.v));
      tx.r = getBufferFromHex(sanitizeHex(result.r));
      tx.s = getBufferFromHex(sanitizeHex(result.s));
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
      const signMessage = new Messages.EthereumSignMessage();
      signMessage.setAddressNList(nodeVector(this.basePath + '/' + idx));
      signMessage.setMessage(new Uint8Array(ethUtil.toBuffer(msg)));
      const [, response] = await this.keepkey.device.exchange(
        Messages.MessageType.MESSAGETYPE_ETHEREUMSIGNMESSAGE,
        signMessage
      );
      return Buffer.from(response.toObject().signature, 'base64');
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
  const _keepkeyWallet = new KeepkeyWallet();
  await _keepkeyWallet.init(basePath);
  return _keepkeyWallet;
};
const getRootPubKey = async (_keepkey, _path) => {
  const getPublicKey = new Messages.GetPublicKey();
  getPublicKey.setAddressNList(nodeVector(_path));
  getPublicKey.setShowDisplay(false);
  const pubObj = await _keepkey.getPublicKey(getPublicKey.toObject());
  const hdkey = HDKey.fromExtendedKey(pubObj[1]);
  return {
    publicKey: hdkey.publicKey.toString('hex'),
    chainCode: hdkey.chainCode.toString('hex')
  };
};

export default createWallet;
