import rin from '@/assets/images/networks/network.svg';
import { RIN } from '../tlds';

export default {
  name: 'RIN',
  name_long: 'Rinkeby',
  homePage: 'https://www.rinkeby.io/',
  blockExplorerTX: 'https://rinkeby.etherscan.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://rinkeby.etherscan.io/address/[[address]]',
  chainID: 4,
  tokens: [],
  contracts: [],
  isTestNetwork: true,
  ens: {
    registry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    registrarTLD: 'eth',
    registrarType: 'permanent',
    supportedTld: RIN,
    subgraphPath:
      'https://api.thegraph.com/subgraphs/name/ensdomains/ensrinkeby'
  },
  icon: rin,
  currencyName: 'RIN',
  isEthVMSupported: {
    supported: false,
    url: null,
    blockExplorerTX: '',
    blockExplorerAddr: '',
    websocket: null
  },
  coingeckoID: null
};
