import XLAYER from '@/assets/images/networks/xlayer.png';

export default {
  name: 'XLayer',
  name_long: 'XLayer',
  homePage: 'https://www.okx.com/xlayer',
  blockExplorer: 'Oklink',
  blockExplorerTX: 'https://www.oklink.com/eth/tx/[[txHash]]',
  blockExplorerAddr: 'https://www.oklink.com/eth/address/[[address]]',
  chainID: 196,
  tokens: import('@/_generated/tokens/tokens-ftm.json').then(
    val => val.default
  ),
  contracts: import('@/_generated/contracts/contract-abi-ftm.json').then(
    val => val.default
  ),
  icon: XLAYER,
  isTestNetwork: false,
  currencyName: 'OKB',
  isEthVMSupported: {
    supported: false,
    url: null,
    websocket: null
  },
  coingeckoID: 'okb',
  gasPriceMultiplier: 1,
  canBuy: false,
  balanceApi: 'https://partners.mewapi.io/balances/xlayer/'
};
