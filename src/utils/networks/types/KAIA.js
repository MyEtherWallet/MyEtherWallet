import klaytn from '@/assets/images/networks/klaytn.png';
export default {
  name: 'KAIA',
  name_long: 'Kaia',
  homePage: 'https://www.kaia.io/',
  blockExplorer: 'kaiascan',
  blockExplorerTX: 'https://kaiascan.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://kaiascan.io/address/[[address]]',
  chainID: 8217,
  tokens: import('@/_generated/tokens/tokens-klay.json').then(
    module => module.default
  ),
  contracts: import('@/_generated/contracts/contract-abi-klay.json').then(
    module => module.default
  ),
  icon: klaytn,
  currencyName: 'KAIA',
  isTestNetwork: false,
  isEthVMSupported: {
    supported: false,
    url: null,
    websocket: null
  },
  gasPriceMultiplier: 1,
  canBuy: false,
  coingeckoID: 'kaia',
  balanceApi: 'https://partners.mewapi.io/balances/kaia/'
};
