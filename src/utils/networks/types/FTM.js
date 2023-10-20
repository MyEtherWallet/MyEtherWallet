import ftm from '@/assets/images/networks/ftm.svg';
export default {
  name: 'FTM',
  name_long: 'Fantom',
  homePage: 'https://fantom.foundation/',
  blockExplorer: 'ftmscan',
  blockExplorerTX: 'https://ftmscan.com/tx/[[txHash]]',
  blockExplorerAddr: 'https://ftmscan.com/address/[[address]]',
  chainID: 250,
  contracts: import('@/_generated/contracts/contract-abi-ftm.json').then(
    module => module.default
  ),
  icon: ftm,
  currencyName: 'FTM',
  isTestNetwork: false,
  isEthVMSupported: {
    supported: false,
    url: null,
    websocket: null
  },
  gasPriceMultiplier: 1,
  canBuy: false,
  coingeckoID: 'fantom',
  balanceApi: 'https://partners.mewapi.io/balances/ftm/'
};
