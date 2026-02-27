import krown from '@/assets/images/networks/krown.png';

export default {
  name: 'KROWN',
  name_long: 'Krown Network',
  homePage: 'https://krown.network',
  blockExplorer: 'Krown Explorer',
  blockExplorerTX: 'https://explorer.krown.network/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.krown.network/address/[[address]]',
  chainID: 1983,
  tokens: [],
  contracts: [],
  icon: krown,
  currencyName: 'KROWN',
  isTestNetwork: false,
  isEthVMSupported: {
    supported: false,
    url: null,
    websocket: null
  },
  gasPriceMultiplier: 1,
  canBuy: false,
  coingeckoID: 'krown-network',
  balanceApi: ''
};

