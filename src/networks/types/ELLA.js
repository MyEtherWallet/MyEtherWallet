import tokens from '@/tokens/tokens-ella.json';
import contracts from '@/contracts/contract-abi-ella.json';

export default {
  name: 'ELLA',
  name_long: 'Ellaism',
  homePage: 'https://ellaism.org/',
  blockExplorerTX: 'https://explorer.ellaism.org/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.ellaism.org/addr/[[address]]',
  chainID: 64,
  tokens: tokens,
  contracts: contracts,
  ensResolver: ''
};
