import moonriver from '@/assets/images/networks/moonriver.svg';

export default {
  name: 'Moonriver',
  name_long: 'Moonriver',
  homePage: 'https://moonriver.network/',
  blockExplorer: 'Moonscan',
  blockExplorerTX: 'https://moonriver.moonscan.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://moonriver.moonscan.io/addr/[[address]]',
  chainID: 1285,
  tokens: import('@/_generated/tokens/tokens-moonriver.json').then(
    val => val.default
  ),
  contracts: import('@/_generated/contracts/contract-abi-moonriver.json').then(
    val => val.default
  ),
  icon: moonriver,
  currencyName: 'MOVR',
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
  coingeckoID: 'moonriver',
  balanceApi: 'https://partners.mewapi.io/balances/moonriver/'
};
