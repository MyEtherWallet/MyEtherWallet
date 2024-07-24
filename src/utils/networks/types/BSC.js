import bsc from '@/assets/images/networks/bsc.svg';
export default {
  name: 'BNB',
  name_long: 'BNB Smart Chain',
  homePage: 'https://www.binance.org/en/smartChain',
  blockExplorer: 'BscScan',
  blockExplorerTX: 'https://bscscan.com/tx/[[txHash]]',
  blockExplorerAddr: 'https://bscscan.com/address/[[address]]',
  chainID: 56,
  tokens: import('@/_generated/tokens/tokens-bsc.json').then(
    module => module.default
  ),
  contracts: import('@/_generated/contracts/contract-abi-bsc.json').then(
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
  canBuy: false,
  coingeckoID: 'binancecoin',
  balanceApi: 'https://tokenbalance.mewapi.io/bsc?address='
};
