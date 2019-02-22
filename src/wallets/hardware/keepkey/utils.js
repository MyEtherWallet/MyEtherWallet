const getUint8Tx = tx => {
  return {
    to: new Uint8Array(tx.to),
    value: new Uint8Array(tx.value),
    data: new Uint8Array(tx.data),
    chainId: tx._chainId,
    nonce: new Uint8Array(tx.nonce),
    gasLimit: new Uint8Array(tx.gasLimit),
    gasPrice: new Uint8Array(tx.gasPrice)
  };
};
export { getUint8Tx };
