import tokens from '@/_generated/tokens/tokens-rin.json';
import contracts from '@/_generated/contracts/contract-abi-rin.json';
import rin from '@/assets/images/icons/network.svg';
import { RIN } from '../tlds';

export default {
  name: 'RIN',
  name_long: 'Rinkeby',
  homePage: 'https://www.rinkeby.io/',
  blockExplorerTX: 'https://rinkeby.etherscan.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://rinkeby.etherscan.io/address/[[address]]',
  chainID: 4,
  tokens: tokens,
  contracts: contracts,
  ens: {
    resolver: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    registrarTLD: 'test',
    registrarType: 'fifs',
    supportedTld: RIN
  },
  icon: rin,
  currencyName: 'RIN'
};
