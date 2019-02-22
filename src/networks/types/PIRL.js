import tokens from '@/tokens/tokens-pirl.json';
import contracts from '@/contracts/contract-abi-pirl.json';
import pirl from '@/assets/images/networks/pirl.svg';

export default {
  name: 'PIRL',
  name_long: 'Pirl',
  homePage: 'https://pirl.io/',
  blockExplorerTX: 'https://poseidon.pirl.io/explorer/transaction/[[txHash]]',
  blockExplorerAddr: 'https://poseidon.pirl.io/explorer/address/[[address]]',
  chainID: 3125659152,
  tokens: tokens,
  contracts: contracts,
  icon: pirl
};
