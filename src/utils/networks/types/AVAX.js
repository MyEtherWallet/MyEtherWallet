import avax from '@/assets/images/networks/avax.svg';
export default {
  name: 'AVAX',
  name_long: 'Avalanche C-Chain',
  homePage: 'https://www.avax.com/',
  blockExplorer: 'snowtrace',
  blockExplorerTX: 'https://snowtrace.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://snowtrace.io/address/[[address]]',
  chainID: 43114,
  tokens: import('@/_generated/tokens/tokens-avax.json').then(
    module => module.default
  ),
  contracts: import('@/_generated/contracts/contract-abi-avax.json').then(
    module => module.default
  ),
  icon: avax,
  currencyName: 'AVAX',
  isTestNetwork: false,
  isEthVMSupported: {
    supported: false,
    url: null,
    websocket: null
  },
  gasPriceMultiplier: 1,
  canBuy: false,
  coingeckoID: 'avalanche-2',
  balanceApi: 'https://partners.mewapi.io/balances/avax/',
  ensEnkryptType: 'AVAX'
};
