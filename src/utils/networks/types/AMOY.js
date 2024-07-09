import matic from '@/assets/images/networks/matic.svg';
export default {
  name: 'AMOY',
  name_long: 'Polygon (AMOY) Testnet',
  homePage: 'https://amoy.polygonscan.com/',
  blockExplorer: 'PolygonScan',
  blockExplorerTX: 'https://amoy.polygonscan.com/tx/[[txHash]]',
  blockExplorerAddr: 'https://amoy.polygonscan.com/address/[[address]]',
  chainID: 80002,
  tokens: import('@/_generated/tokens/tokens-ftm.json').then(
    module => module.default
  ),
  contracts: import('@/_generated/contracts/contract-abi-ftm.json').then(
    module => module.default
  ),
  icon: matic,
  isTestNetwork: true,
  currencyName: 'MATIC',
  isEthVMSupported: {
    supported: false,
    url: null,
    websocket: null
  },
  gasPriceMultiplier: 1.7,
  canBuy: true,
  coingeckoID: '',
  balanceApi: ''
};
