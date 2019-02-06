import tokens from '@/tokens/tokens-goerli.json';
import contracts from '@/contracts/contract-abi-goerli.json';

export default {
  name: 'GöETH',
  name_long: 'Goerli',
  homePage: 'https://github.com/goerli/testnet',
  blockExplorerTX: 'https://blockscout.com/eth/goerli/tx/[[txHash]]',
  blockExplorerAddr: 'https://blockscout.com/eth/goerli/address/[[address]]',
  chainID: 5,
  tokens: tokens,
  contracts: contracts
};
