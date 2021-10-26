const getUint8Tx = tx => {
  return {
    to: new Uint8Array(tx.to),
    value: new Uint8Array(tx.value),
    data: new Uint8Array(tx.data),
    chainId: tx.getChainId(),
    nonce: new Uint8Array(tx.nonce),
    gasLimit: new Uint8Array(tx.gasLimit),
    gasPrice: new Uint8Array(tx.gasPrice)
  };
};
const getHexTx = tx => {
  return {
    to: '0x' + tx.to.toString('hex'),
    value: '0x' + tx.value.toString('hex'),
    data: '0x' + tx.data.toString('hex'),
    chainId: tx.getChainId(),
    nonce: '0x' + tx.nonce.toString('hex'),
    gasLimit: '0x' + tx.gasLimit.toString('hex'),
    gasPrice: '0x' + tx.gasPrice.toString('hex')
  };
};
export { getUint8Tx, getHexTx };
