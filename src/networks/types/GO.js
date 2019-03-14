import tokens from '@/tokens/tokens-go.json';
import contracts from '@/contracts/contract-abi-go.json';
import go from '@/assets/images/networks/go.svg';

export default {
  name: 'GO',
  name_long: 'GoChain',
  homePage: 'https://gochain.io/',
  blockExplorerTX: 'https://explorer.gochain.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.gochain.io/addr/[[address]]',
  chainID: 60,
  tokens: tokens,
  contracts: contracts,
  icon: go
};
