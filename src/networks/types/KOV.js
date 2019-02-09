import tokens from '@/tokens/tokens-kov.json';
import contracts from '@/contracts/contract-abi-kov.json';
import kov from '@/assets/images/icons/network.svg';

export default {
  name: 'KOV',
  name_long: 'Kovan',
  homePage: 'https://kovan-testnet.github.io/website/',
  blockExplorerTX: 'https://kovan.etherscan.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://kovan.etherscan.io/address/[[address]]',
  chainID: 42,
  tokens: tokens,
  contracts: contracts,
  icon: kov
};
