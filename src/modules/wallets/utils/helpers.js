import { bufferToInt } from 'ethereumjs-util';

const walletRequirePass = ethjson => {
  if (!ethjson) return false;
  if (ethjson.encseed != null) return true;
  else if (ethjson.Crypto != null || ethjson.crypto != null) return true;
  else if (ethjson.hash != null && ethjson.locked) return true;
  else if (ethjson.hash != null && !ethjson.locked) return false;
  else if (ethjson.publisher == 'MyEtherWallet' && !ethjson.encrypted)
    return false;
  return true;
};

const getBufferFromHex = hex => {
  hex = sanitizeHex(hex);
  const _hex = hex.toLowerCase().replace('0x', '');
  return new Buffer(_hex, 'hex');
};
const padLeftEven = hex => {
  hex = hex.length % 2 != 0 ? '0' + hex : hex;
  return hex;
};
const sanitizeHex = hex => {
  hex = hex.substring(0, 2) == '0x' ? hex.substring(2) : hex;
  if (hex == '') return '';
  return '0x' + padLeftEven(hex);
};
const bufferToHex = buffer => {
  return '0x' + buffer.toString('hex');
};
const getHexTxObject = tx => {
  return {
    to: sanitizeHex(tx.to.toString('hex')),
    value: sanitizeHex(tx.value.toString('hex')),
    data: sanitizeHex(tx.data.toString('hex')),
    chainId: tx.getChainId(),
    nonce: sanitizeHex(tx.nonce.toString('hex')),
    gasLimit: sanitizeHex(tx.gasLimit.toString('hex')),
    gasPrice: sanitizeHex(tx.gasPrice.toString('hex'))
  };
};
const getSignTransactionObject = tx => {
  return {
    rawTransaction: bufferToHex(tx.serialize()),
    tx: {
      nonce: bufferToHex(tx.nonce),
      gasPrice: bufferToHex(tx.gasPrice),
      gas: tx.gasLimit ? bufferToHex(tx.gasLimit) : bufferToHex(tx.gas),
      to: bufferToHex(tx.to),
      value: bufferToHex(tx.value),
      input: bufferToHex(tx.data),
      v: bufferToHex(tx.v),
      r: bufferToHex(tx.r),
      s: bufferToHex(tx.s),
      hash: bufferToHex(tx.hash())
    }
  };
};
const calculateChainIdFromV = v => {
  const sigV = bufferToInt(v);
  let chainId = Math.floor((sigV - 35) / 2);
  if (chainId < 0) chainId = 0;
  return chainId;
};

const createBlob = (str, mime) => {
  const string = typeof str === 'object' ? JSON.stringify(str) : str;
  if (string === null) return '';
  const blob = new Blob([string], {
    type: mime
  });
  return window.URL.createObjectURL(blob);
};

export {
  getBufferFromHex,
  bufferToHex,
  getSignTransactionObject,
  sanitizeHex,
  padLeftEven,
  getHexTxObject,
  calculateChainIdFromV,
  walletRequirePass,
  createBlob
};
