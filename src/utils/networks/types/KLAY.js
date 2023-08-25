import klaytn from '@/assets/images/networks/klaytn.png';
export default {
  name: 'KLAY',
  name_long: 'Klaytn',
  homePage: 'https://www.klaytn.foundation/',
  blockExplorer: 'klaytn',
  blockExplorerTX: 'https://scope.klaytn.com/tx/[[txHash]]',
  blockExplorerAddr: 'https://scope.klaytn.com/account/[[address]]',
  chainID: 8217,
  contracts: import('@/_generated/contracts/contract-abi-klay.json').then(
    module => module.default
  ),
  icon: klaytn,
  currencyName: 'KLAY',
  isTestNetwork: false,
  isEthVMSupported: {
    supported: false,
    url: null,
    websocket: null
  },
  gasPriceMultiplier: 1,
  canBuy: false,
  coingeckoID: 'klay-token',
  balanceApi: 'https://partners.mewapi.io/balances/klay/'
};
