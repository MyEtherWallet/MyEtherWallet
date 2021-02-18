import { isHexString } from 'ethereumjs-util';

const SOFTWARE_WALLET_TYPES = [
  'keystore',
  'mnemonic',
  'private-key',
  'overview'
];

const isPrivateKey = key => {
  const _priv = key.replace('0x', '');
  return isHexString('0x' + _priv, 32) && key !== '';
};

export { SOFTWARE_WALLET_TYPES, isPrivateKey };
