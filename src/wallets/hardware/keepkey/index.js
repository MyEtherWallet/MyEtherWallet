import {
  WebUSBDevice,
  Messages,
  KeepKey,
  bip32ToAddressNList
} from '@keepkey/keepkey.js';
import { KEEPKEY as keepkeyType } from '../../bip44/walletTypes';
import bip44Paths from '../../bip44';
import HDWalletInterface from '@/wallets/HDWalletInterface';
import { getUint8Tx } from './utils';
import {
  getBufferFromHex,
  sanitizeHex,
  getSignTransactionObject,
  calculateChainIdFromV
} from '../../utils';
import HDKey from 'hdkey';
import { toBuffer } from 'ethereumjs-util';
import ethTx from 'ethereumjs-tx';
import errorHandler from './errorHandler';

const { MessageType } = Messages;
const {
  MESSAGETYPE_PINMATRIXREQUEST,
  MESSAGETYPE_PASSPHRASEREQUEST
} = MessageType;

const NEED_PASSWORD = false;

class KeepkeyWallet {
  constructor(eventHub) {
    this.identifier = keepkeyType;
    this.isHardware = true;
    this.needPassword = NEED_PASSWORD;
    this.eventHub = eventHub;
    this.supportedPaths = bip44Paths[keepkeyType];
  }
  async init(basePath) {
    this.basePath = basePath ? basePath : this.supportedPaths[0].path;
    this.isHardened = this.basePath.split('/').length - 1 === 2;
    const usbDevice = await WebUSBDevice.requestPair();
    const device = new WebUSBDevice({ usbDevice });
    this.keepkey = KeepKey.withWebUSB(device);
    this.keepkey.device.events.on(String(MESSAGETYPE_PINMATRIXREQUEST), () => {
      this.eventHub.$emit(
        'showHardwarePinMatrix',
        { name: this.identifier },
        pin => {
          this.keepkey.acknowledgeWithPin(pin).catch(errorHandler);
        }
      );
    });
    this.keepkey.device.events.on(String(MESSAGETYPE_PASSPHRASEREQUEST), () => {
      this.eventHub.$emit(
        'showHardwarePassword',
        { name: this.identifier },
        passPhrase => {
          this.keepkey
            .acknowledgeWithPassphrase(passPhrase)
            .catch(errorHandler);
        }
      );
    });
    await this.keepkey.initialize();
    if (!this.isHardened) {
      const rootPub = await getRootPubKey(this.keepkey, this.basePath);
      this.hdKey = new HDKey();
      this.hdKey.publicKey = Buffer.from(rootPub.publicKey, 'hex');
      this.hdKey.chainCode = Buffer.from(rootPub.chainCode, 'hex');
    } else {
      await getRootPubKey(this.keepkey, this.basePath + '/0 ');
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
      tx = new ethTx(tx);
      const hexTx = getUint8Tx(tx);
      const networkId = tx._chainId;
      hexTx.addressNList = bip32ToAddressNList(accountPath);
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
      signMessage.setAddressNList(bip32ToAddressNList(accountPath));
      signMessage.setMessage(new Uint8Array(toBuffer(msg)));
      const [, response] = await this.keepkey.device.exchange(
        Messages.MessageType.MESSAGETYPE_ETHEREUMSIGNMESSAGE,
        signMessage
      );
      return Buffer.from(response.toObject().signature, 'base64');
    };
    return new HDWalletInterface(
      accountPath,
      derivedKey.publicKey,
      this.isHardware,
      this.identifier,
      errorHandler,
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
const createWallet = async (basePath, eventHub) => {
  const _keepkeyWallet = new KeepkeyWallet(eventHub);
  await _keepkeyWallet.init(basePath);
  return _keepkeyWallet;
};

createWallet.errorHandler = errorHandler;

const getRootPubKey = async (_keepkey, _path) => {
  const pubObj = await _keepkey.getPublicKey({
    addressNList: bip32ToAddressNList(_path),
    showDisplay: false
  });
  const hdkey = HDKey.fromExtendedKey(pubObj[1]);
  return {
    publicKey: hdkey.publicKey.toString('hex'),
    chainCode: hdkey.chainCode.toString('hex')
  };
};

export default createWallet;
