import tokens from '@/tokens/tokens-rin.json';
import contracts from '@/contracts/contract-abi-rin.json';
import rin from '@/assets/images/icons/network.svg';
import { RinAbi } from '../ensAbis';

export default {
  name: 'RIN',
  name_long: 'Rinkeby',
  homePage: 'https://www.rinkeby.io/',
  blockExplorerTX: 'https://rinkeby.etherscan.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://rinkeby.etherscan.io/address/[[address]]',
  chainID: 4,
  tokens: tokens,
  contracts: contracts,
  ensResolver: '0xe7410170f87102DF0055eB195163A03B7F2Bff4A',
  ensAbi: RinAbi,
  icon: rin
};
