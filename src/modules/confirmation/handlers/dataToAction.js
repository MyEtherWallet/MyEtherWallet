import Web3 from 'web3';
const signatures = {
  '0x095ea7b3': ({ data }) => {
    const params = new Web3().eth.abi.decodeParameters(
      ['address', 'uint256'],
      `${data.substr(10)}`
    );
    const value = Web3.utils.toBN(params[1]);
    if (value.isZero()) return 'Reset Approval';
    return 'Approval';
  },
  '0x7c025200': () => {
    return 'Swap';
  }
};
const getSignature = data => data.substr(0, 10);
export default tx => {
  if (!tx.data || tx.data === '0x') return '';
  else if (!signatures[getSignature(tx.data)]) return '';
  return signatures[getSignature(tx.data)]({
    from: tx.from,
    to: tx.to,
    data: tx.data,
    value: tx.value
  });
};
