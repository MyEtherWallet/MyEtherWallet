import tokens from '@/tokens/tokens-rsk.json';
import contracts from '@/contracts/contract-abi-rsk.json';
import rsk from '@/assets/images/networks/rsk.svg';
import { EthAbi } from '../ensAbis';

export default {
  name: 'RSK',
  name_long: 'RSK',
  homePage: 'https://www.rsk.co',
  blockExplorerTX: 'https://explorer.rsk.co/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.rsk.co/address/[[address]]',
  chainID: 30,
  tokens: tokens,
  contracts: contracts,
  ensResolver: '0x4efd25e3d348f8f25a14fb7655fba6f72edfe93a',
  ensAbi: EthAbi,
  icon: rsk
};
