import tokens from '@/tokens/tokens-rop.json';
import contracts from '@/contracts/contract-abi-rop.json';
import rop from '@/assets/images/icons/network.svg';
import { RopAbi } from '../ensAbis';

export default {
  name: 'ROP',
  name_long: 'Ropsten',
  homePage: 'https://github.com/ethereum/ropsten',
  blockExplorerTX: 'https://ropsten.etherscan.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://ropsten.etherscan.io/address/[[address]]',
  chainID: 3,
  tokens: tokens,
  contracts: contracts,
  ensResolver: '0x112234455c3a32fd11230c42e7bccd4a84e02010',
  ensAbi: RopAbi,
  icon: rop
};
