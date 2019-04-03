//import web3 from 'web3';
import locStore from 'store';
import BigNumber from 'bignumber.js';

function parseTokensData(data, to, _web3, networkToken, networkName) {
  const web3 = _web3;
  let token = networkToken.find(el => {
    return el.address.toLowerCase() === to.toLowerCase();
  });
  if (!token) {
    const customStore = locStore.get('customTokens');
    if (
      customStore !== undefined &&
      customStore[networkName] !== undefined &&
      customStore[networkName].length
    ) {
      token = customStore[networkName].find(el => {
        return el.address.toLowerCase() === to.toLowerCase();
      });
    }
  }
  const jsonInterface = {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_amount', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  };
  const transferFuncSig = web3.eth.abi.encodeFunctionSignature(jsonInterface);
  const tokenData = {
    tokenTransferTo: '',
    tokenTransferVal: '',
    tokenSymbol: ''
  };
  if (data.substr(0, 10) === transferFuncSig) {
    const params = web3.eth.abi.decodeParameters(
      ['address', 'uint256'],
      `${data.substr(10)}`
    );
    const value = new BigNumber(params[1]);
    tokenData.tokenTransferTo = params[0];
    tokenData.tokenTransferVal = token
      ? value
          .div(new BigNumber(10).pow(token.decimals))
          .toFixed()
          .toString()
      : value.toString();
    tokenData.tokenSymbol = token ? token.symbol : 'Unidentified Token';
  }

  return tokenData;
}

export default parseTokensData;
