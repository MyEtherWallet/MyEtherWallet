import aa from '@/assets/images/networks/aa.svg';

export default {
  name: 'AA',
  name_long: 'Arthera Mainnet',
  homePage: 'https://arthera.net/',
  blockExplorer: 'Blockscout',
  blockExplorerTX: 'https://explorer.arthera.net/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.arthera.net/address/[[address]]',
  chainID: 10242,
  tokens: import('@/_generated/tokens/tokens-goerli.json').then(
    val => val.default
  ),
  contracts: import('@/_generated/contracts/contract-abi-goerli.json').then(
    val => val.default
  ),
  icon: aa,
  currencyName: 'AA',
  isTestNetwork: false,
  isEthVMSupported: {
    supported: false,
    url: null,
    blockExplorerTX: '',
    blockExplorerAddr: '',
    websocket: null
  },
  coingeckoID: null,
  gasPriceMultiplier: 1,
  balanceApi: ''
};
