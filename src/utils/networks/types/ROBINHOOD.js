import robinhood from '@/assets/images/networks/robinhood.svg';

export default {
  name: 'ROBINHOOD',
  name_long: 'Robinhood Chain',
  homePage: 'https://docs.robinhood.com/chain',
  blockExplorer: 'Blockscout',
  blockExplorerTX: 'https://robinhoodchain.blockscout.com/tx/[[txHash]]',
  blockExplorerAddr:
    'https://robinhoodchain.blockscout.com/address/[[address]]',
  chainID: 4663,
  tokens: import('@/_generated/tokens/tokens-goerli.json').then(
    val => val.default
  ),
  contracts: import('@/_generated/contracts/contract-abi-goerli.json').then(
    val => val.default
  ),
  icon: robinhood,
  currencyName: 'ETH',
  isTestNetwork: false,
  isEthVMSupported: {
    supported: false,
    url: null,
    blockExplorerTX: '',
    blockExplorerAddr: '',
    websocket: null
  },
  coingeckoID: 'ethereum',
  gasPriceMultiplier: 1,
  canBuy: false,
  balanceApi: ''
};
