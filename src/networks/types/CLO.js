import tokens from '@/tokens/tokens-clo.json';
import contracts from '@/contracts/contract-abi-clo.json';
import clo from '@/assets/images/networks/clo.svg';

export default {
  name: 'CLO',
  name_long: 'Callisto',
  homePage: 'https://callisto.network/',
  blockExplorerTX: 'https://cloexplorer.org/tx/[[txHash]]',
  blockExplorerAddr: 'https://cloexplorer.org/addr/[[address]]',
  chainID: 820,
  tokens: tokens,
  contracts: contracts,
  ensResolver: '',
  icon: clo
};
