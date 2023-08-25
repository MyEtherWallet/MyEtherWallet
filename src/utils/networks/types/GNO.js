import gno from '@/assets/images/networks/gno.svg';
export default {
  name: 'GNO',
  name_long: 'Gnosis',
  homePage: 'https://www.gnosis.io/',
  blockExplorer: 'gnosiscan',
  blockExplorerTX: 'https://gnosisscan.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://gnosisscan.io/address/[[address]]',
  chainID: 100,
  contracts: import('@/_generated/contracts/contract-abi-gno.json').then(
    module => module.default
  ),
  icon: gno,
  currencyName: 'DAI',
  isTestNetwork: false,
  isEthVMSupported: {
    supported: false,
    url: null,
    websocket: null
  },
  gasPriceMultiplier: 1,
  canBuy: false,
  coingeckoID: 'dai',
  balanceApi: 'https://partners.mewapi.io/balances/xdai/'
};
