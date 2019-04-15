import tokens from '@/tokens/tokens-sum.json';
import contracts from '@/contracts/contract-abi-sum.json';
import sum from '@/assets/images/networks/sum.svg';

export default {
  name: 'SUM',
  name_long: 'Solidum',
  homePage: 'https://solidum.network/',
  blockExplorerTX: 'https://explorer.solidum.network/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.solidum.network/addr/[[address]]',
  chainID: 72106,
  tokens: tokens,
  contracts: contracts,
  icon: sum
};
