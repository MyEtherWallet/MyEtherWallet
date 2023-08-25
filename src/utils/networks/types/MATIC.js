import matic from '@/assets/images/networks/matic.svg';
export default {
  name: 'MATIC',
  name_long: 'Polygon (Matic)',
  homePage: 'https://polygonscan.com/',
  blockExplorer: 'PolygonScan',
  blockExplorerTX: 'https://polygonscan.com/tx/[[txHash]]',
  blockExplorerAddr: 'https://polygonscan.com/address/[[address]]',
  chainID: 137,
  contracts: import('@/_generated/contracts/contract-abi-etc.json').then(
    val => val.default
  ),
  icon: matic,
  isTestNetwork: false,
  currencyName: 'MATIC',
  isEthVMSupported: {
    supported: false,
    url: null,
    websocket: null
  },
  gasPriceMultiplier: 1.7,
  canBuy: true,
  coingeckoID: 'matic-network',
  balanceApi: 'https://partners.mewapi.io/balances/matic/'
};
