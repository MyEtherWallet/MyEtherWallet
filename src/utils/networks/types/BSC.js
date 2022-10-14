import bsc from '@/assets/images/networks/bsc.svg';
export default {
  name: 'BSC',
  name_long: 'Binance Smart Chain',
  homePage: 'https://www.binance.org/en/smartChain',
  blockExplorer: 'BscScan',
  blockExplorerTX: 'https://bscscan.com/tx/[[txHash]]',
  blockExplorerAddr: 'https://bscscan.com/address/[[address]]',
  chainID: 56,
  tokens: import('@/_generated/tokens/tokens-bsc.json').then(
    module => module.default
  ),
  contracts: import('@/_generated/contracts/contract-abi-etc.json').then(
    module => module.default
  ),
  icon: bsc,
  currencyName: 'BNB',
  isTestNetwork: false,
  isEthVMSupported: {
    supported: false,
    url: null,
    websocket: null
  },
  gasPriceMultiplier: 1,
  canBuy: true,
  coingeckoID: 'binancecoin'
};
