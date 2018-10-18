const getBufferFromHex = hex => {
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
const getSignTransactionObject = tx => {
  return {
    raw: bufferToHex(tx.serialize()),
    rawTransaction: bufferToHex(tx.serialize()),
    tx: {
      nonce: bufferToHex(tx.nonce),
      gasPrice: bufferToHex(tx.gasPrice),
      gas: bufferToHex(tx.gasLimit),
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
export {
  getBufferFromHex,
  bufferToHex,
  getSignTransactionObject,
  sanitizeHex,
  padLeftEven
};
