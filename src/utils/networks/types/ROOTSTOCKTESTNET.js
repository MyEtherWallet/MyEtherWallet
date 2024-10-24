import rootstock from '@/assets/images/networks/rootstock.svg';
import { ROOTSTOCKTESTNET } from '../tlds';

export default {
  name: 'Rootstock Testnet',
  name_long: 'Rootstock Testnet',
  homePage: 'https://rsk.co/',
  blockExplorer: 'RSK Explorer',
  blockExplorerTX: 'https://explorer.testnet.rootstock.io/tx/[[txHash]]',
  blockExplorerAddr:
    'https://explorer.testnet.rootstock.io/address/[[address]]',
  chainID: 31,
  tokens: import('@/_generated/tokens/tokens-rsk.json').then(
    val => val.default
  ),
  contracts: import('@/_generated/contracts/contract-abi-rsk.json').then(
    val => val.default
  ),
  icon: rootstock,
  isTestNetwork: true,
  ens: {
    registry: '0x7d284aaac6e925aad802a53c0c69efe3764597b8',
    registrarTLD: 'rsk',
    registrarType: 'permanent',
    supportedTld: ROOTSTOCKTESTNET,
    subgraphPath: ''
  },
  currencyName: 'tRBTC',
  isEthVMSupported: {
    supported: false,
    url: null,
    websocket: null
  },
  coingeckoID: '',
  gasPriceMultiplier: 1.1,
  canBuy: false,
  balanceApi: ''
};
