import rootstock from '@/assets/images/networks/rootstock.svg';
import { ROOTSTOCK } from '../tlds';

export default {
  name: 'Rootstock',
  name_long: 'Rootstock',
  homePage: 'https://rsk.co/',
  blockExplorerTX: 'https://explorer.rsk.co/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.rsk.co/address/[[address]]',
  chainID: 30,
  tokens: import('@/_generated/tokens/tokens-rsk.json').then(
    val => val.default
  ),
  contracts: import('@/_generated/contracts/contract-abi-rsk.json').then(
    val => val.default
  ),
  icon: rootstock,
  isTestNetwork: false,
  ens: {
    registry: '0xcb868aeabd31e2b66f74e9a55cf064abb31a4ad5',
    registrarTLD: 'rsk',
    registrarType: 'permanent',
    supportedTld: ROOTSTOCK,
    subgraphPath: ''
  },
  currencyName: 'RBTC',
  isEthVMSupported: {
    supported: false,
    url: null,
    websocket: null
  },
  coingeckoID: 'rootstock',
  gasPriceMultiplier: 1.1,
  canBuy: false,
  balanceApi: ''
};
