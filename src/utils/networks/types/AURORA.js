import aurora from '@/assets/images/networks/aurora.png';
export default {
  name: 'AURORA',
  name_long: 'Aurora',
  homePage: 'https://aurora.dev/',
  blockExplorer: 'aurora',
  blockExplorerTX: 'https://explorer.aurora.dev/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.aurora.dev/address/[[address]]',
  chainID: 1313161554,
  contracts: import('@/_generated/contracts/contract-abi-aurora.json').then(
    module => module.default
  ),
  icon: aurora,
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
  balanceApi: 'https://partners.mewapi.io/balances/aurora/'
};
