import op from '@/assets/images/networks/op.svg';
export default {
  name: 'OP',
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
  icon: op,
  currencyName: 'ETH',
  isTestNetwork: false,
  isEthVMSupported: {
    supported: false,
    url: null,
    websocket: null
  },
  gasPriceMultiplier: 1,
  canBuy: false,
  coingeckoID: 'ethereum',
  balanceApi: 'https://partners.mewapi.io/balances/op/'
};
