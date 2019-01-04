const nodeVector = path => {
  const result = [];
  const components = path.split('/');
  components.forEach(element => {
    let number = parseInt(element, 10);
    if (isNaN(number)) {
      return;
    }
    if (element.length > 1 && element[element.length - 1] === "'") {
      number += 0x80000000;
    }
    result.push(number);
  });
  return result;
};
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
export { nodeVector, getUint8Tx };
