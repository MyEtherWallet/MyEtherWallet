import { isHexString } from 'ethereumjs-util';

const SOFTWARE_WALLET_TYPES = {
  KEYSTORE: 'keystore',
  MNEMONIC: 'mnemonic',
  PRIVATE_KEY: 'private-key',
  OVERVIEW: 'overview'
};

const isPrivateKey = key => {
  const _priv = key.replace('0x', '');
  return isHexString('0x' + _priv, 32) && key !== '';
};

export { SOFTWARE_WALLET_TYPES, isPrivateKey };
