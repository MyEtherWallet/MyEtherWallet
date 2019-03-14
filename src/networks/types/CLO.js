import tokens from '@/tokens/tokens-clo.json';
import contracts from '@/contracts/contract-abi-clo.json';
import clo from '@/assets/images/networks/clo.svg';

export default {
  name: 'CLO',
  name_long: 'Callisto',
  homePage: 'https://callisto.network/',
  blockExplorerTX: 'https://explorer.callisto.network/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.callisto.network/account/[[address]]',
  chainID: 820,
  tokens: tokens,
  contracts: contracts,
  icon: clo
};
