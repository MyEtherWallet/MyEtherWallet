import moonbeam from '@/assets/images/networks/moonbeam.svg';

export default {
  name: 'Moonbeam',
  name_long: 'Moonbeam',
  homePage: 'https://moonbeam.network/',
  blockExplorer: 'Moonscan',
  blockExplorerTX: 'https://moonscan.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://moonscan.io/addr/[[address]]',
  chainID: 1284,
  tokens: import('@/_generated/tokens/tokens-moonbeam.json').then(
    val => val.default
  ),
  contracts: import('@/_generated/contracts/contract-abi-moonbeam.json').then(
    val => val.default
  ),
  icon: moonbeam,
  currencyName: 'GLMR',
  isTestNetwork: false,
  isEthVMSupported: {
    supported: false,
    url: null,
    blockExplorerTX: '',
    blockExplorerAddr: '',
    websocket: null
  },
  gasPriceMultiplier: 1,
  canBuy: false,
  coingeckoID: 'moonbeam',
  balanceApi: 'https://partners.mewapi.io/balances/moonbeam/'
};
