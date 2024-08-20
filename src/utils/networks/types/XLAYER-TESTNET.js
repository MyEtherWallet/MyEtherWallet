import XLAYER from '@/assets/images/networks/xlayer.png';

export default {
  name: 'XLayer',
  name_long: 'XLayer Testnet',
  homePage: 'https://www.okx.com/xlayer',
  blockExplorer: 'Oklink',
  blockExplorerTX:
    'https://www.okx.com/web3/explorer/xlayer-test/tx/[[txHash]]',
  blockExplorerAddr:
    'https://www.okx.com/web3/explorer/xlayer-test/address/[[address]]',
  chainID: 195,
  tokens: import('@/_generated/tokens/tokens-ftm.json').then(
    val => val.default
  ),
  contracts: import('@/_generated/contracts/contract-abi-ftm.json').then(
    val => val.default
  ),
  icon: XLAYER,
  isTestNetwork: true,
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
