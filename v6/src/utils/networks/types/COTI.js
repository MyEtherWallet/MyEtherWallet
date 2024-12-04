import cotisvg from '@/assets/images/networks/coti.svg';

export default {
  name: 'COTI',
  name_long: 'Coti Testnet',
  homePage: 'https://coti.io/',
  blockExplorer: 'Coti.io',
  blockExplorerTX: 'https://explorer-devnet.coti.io/transaction/[[txHash]]',
  blockExplorerAddr: 'https://explorer-devnet.coti.io/transaction/[[address]]',
  chainID: 13068200,
  tokens: import('@/_generated/tokens/tokens-goerli.json').then(
    val => val.default
  ),
  contracts: import('@/_generated/contracts/contract-abi-goerli.json').then(
    val => val.default
  ),
  icon: cotisvg,
  currencyName: 'COTI2',
  isTestNetwork: true,
  isEthVMSupported: {
    supported: false,
    url: null,
    blockExplorerTX: '',
    blockExplorerAddr: '',
    websocket: null
  },
  coingeckoID: null,
  gasPriceMultiplier: 1,
  balanceApi: ''
};
