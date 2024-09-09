import pol from '@/assets/images/networks/pol.svg';
export default {
  name: 'Polygon',
  name_long: 'Polygon',
  homePage: 'https://polygonscan.com/',
  blockExplorer: 'PolygonScan',
  blockExplorerTX: 'https://polygonscan.com/tx/[[txHash]]',
  blockExplorerAddr: 'https://polygonscan.com/address/[[address]]',
  chainID: 137,
  tokens: import('@/_generated/tokens/tokens-pol.json').then(
    val => val.default
  ),
  contracts: import('@/_generated/contracts/contract-abi-pol.json').then(
    val => val.default
  ),
  icon: pol,
  isTestNetwork: false,
  currencyName: 'POL',
  isEthVMSupported: {
    supported: false,
    url: null,
    websocket: null
  },
  gasPriceMultiplier: 1.7,
  canBuy: true,
  coingeckoID: 'matic-network',
  balanceApi: 'https://partners.mewapi.io/balances/matic/',
  ensEnkryptType: 'MATIC'
};
