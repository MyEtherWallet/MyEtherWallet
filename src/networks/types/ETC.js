import tokens from '@/tokens/tokens-etc.json';
import contracts from '@/contracts/contract-abi-etc.json';

export default {
  name: 'ETC',
  name_long: 'Ethereum Classic',
  homePage: 'https://ethereumclassic.org/',
  blockExplorerTX: 'https://gastracker.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://gastracker.io/address/[[address]]',
  chainID: 61,
  tokens: tokens,
  contracts: contracts,
  ensResolver: ''
};
