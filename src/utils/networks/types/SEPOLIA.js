import goerli from '@/assets/images/networks/network.svg';

export default {
  name: 'SEPOLIA',
  name_long: 'Sepolia Testnet',
  homePage: 'https://sepolia.dev/',
  blockExplorer: 'ethVM',
  blockExplorerTX: 'https://sepolia.ethvm.com/tx/[[txHash]]',
  blockExplorerAddr: 'https://sepolia.ethvm.com/address/[[address]]',
  chainID: 11155111,
  tokens: import('@/_generated/tokens/tokens-goerli.json').then(
    val => val.default
  ),
  contracts: import('@/_generated/contracts/contract-abi-goerli.json').then(
    val => val.default
  ),
  isTestNetwork: true,
  icon: goerli,
  currencyName: 'SEP',
  isEthVMSupported: {
    supported: false,
    url: null,
    blockExplorerTX: '',
    blockExplorerAddr: '',
    websocket: null
  },
  gasPriceMultiplier: 1,
  canBuy: false,
  coingeckoID: null,
  balanceApi: ''
};
