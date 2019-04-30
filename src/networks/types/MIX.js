import tokens from '@/tokens/tokens-mix.json';
import contracts from '@/contracts/contract-abi-mix.json';
import mix from '@/assets/images/icons/network.svg';

export default {
  name: 'MIX',
  name_long: 'Mix Blockchain',
  homePage: 'https://www.mix-blockchain.org/',
  blockExplorerTX: 'https://blocks.mix-blockchain.org/transaction/[[txHash]]',
  blockExplorerAddr: 'https://blocks.mix-blockchain.org/address/[[address]]',
  chainID: 76,
  tokens: tokens,
  contracts: contracts,
  icon: mix,
  currencyName: 'MIX'
};
