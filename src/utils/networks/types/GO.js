import go from '@/assets/images/networks/go.svg';

export default {
  name: 'GO',
  name_long: 'Gochain',
  homePage: 'https://gochain.io/',
  blockExplorer: 'Gochain',
  blockExplorerTX: 'https://explorer.gochain.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.gochain.io/addr/[[address]]',
  chainID: 60,
  tokens: import('@/_generated/tokens/tokens-go.json').then(val => val.default),
  contracts: import('@/_generated/contracts/contract-abi-go.json').then(
    val => val.default
  ),
  icon: go,
  currencyName: 'GO',
  isTestNetwork: false,
  isEthVMSupported: {
    supported: false,
    url: null,
    blockExplorerTX: '',
    blockExplorerAddr: '',
    websocket: null
  },
  gasPriceMultiplier: 1,
  canBuy: false,
  coingeckoID: 'gochain',
  balanceApi: ''
};
