import { WebUSBDevice, Messages, KeepKey } from 'keepkey';
import { KEEPKEY as keepkeyType } from '../../bip44/walletTypes';
import bip44Paths from '../../bip44';
import HDWalletInterface from '@/wallets/HDWalletInterface';
import { nodeVector } from './utils';
import * as HDKey from 'hdkey';

const { MessageType } = Messages;
const {
  MESSAGETYPE_BUTTONREQUEST,
  MESSAGETYPE_PINMATRIXREQUEST,
  MESSAGETYPE_PASSPHRASEREQUEST
} = MessageType;

const NEED_PASSWORD = false;

class keepkeyWallet {
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
    this.keepkey.device.promptEvents.on(
      String(MESSAGETYPE_BUTTONREQUEST),
      requestMsg => {
        console.log('button request', requestMsg);
      }
    );
    this.keepkey.device.promptEvents.on(
      String(MESSAGETYPE_PINMATRIXREQUEST),
      requestMsg => {
        console.log('pin request', requestMsg);
      }
    );
    this.keepkey.device.promptEvents.on(
      String(MESSAGETYPE_PASSPHRASEREQUEST),
      requestMsg => {
        console.log('passphrase request', requestMsg);
      }
    );
    const rootPub = await getRootPubKey(this.keepkey, this.basePath);
    this.hdKey = new HDKey();
    this.hdKey.publicKey = Buffer.from(rootPub.publicKey, 'hex');
    this.hdKey.chainCode = Buffer.from(rootPub.chainCode, 'hex');
  }
  async getAccount(idx) {
    const derivedKey = this.hdKey.derive('m/' + idx);
    const txSigner = () => {};
    const msgSigner = () => {};
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
  const _keepkeyWallet = new keepkeyWallet();
  await _keepkeyWallet.init(basePath);
  return _keepkeyWallet;
};
const getRootPubKey = async (_keepkey, _path) => {
  const getPublicKey = new Messages.GetPublicKey();
  getPublicKey.setAddressNList(nodeVector(_path));
  getPublicKey.setShowDisplay(true);
  const pubObj = await _keepkey.getPublicKey(getPublicKey.toObject());
  return {
    publicKey: pubObj.getPublicKey_asU8().toString('hex'),
    chainCode: pubObj.getChainCode_asU8().toString('hex')
  };
};

export default createWallet;
