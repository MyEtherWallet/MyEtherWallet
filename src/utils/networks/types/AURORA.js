import bsc from '@/assets/images/networks/bsc.svg';
export default {
  name: 'Optiomism',
  name_long: 'Optimism',
  homePage: 'https://www.optimism.io/',
  blockExplorer: 'etherscan',
  blockExplorerTX: 'https://optimistic.etherscan.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://optimistic.etherscan.io/address/[[address]]',
  chainID: 10,
  tokens: import('@/_generated/tokens/tokens-op.json').then(
    module => module.default
  ),
  contracts: import('@/_generated/contracts/contract-abi-op.json').then(
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
  coingeckoID: 'binancecoin',
  balanceApi: 'https://tokenbalance.mewapi.io/bsc?address='
};
