import tokens from '@/tokens/tokens-rsk-test.json';
import contracts from '@/contracts/contract-abi-rsk-test.json';
import rsk from '@/assets/images/networks/rsk.svg';

export default {
  name: 'RSKTEST',
  name_long: 'RSK Testnet',
  homePage: 'https://www.rsk.co',
  blockExplorerTX: 'https://explorer.testnet.rsk.co/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.testnet.rsk.co/address/[[address]]',
  chainID: 31,
  tokens: tokens,
  contracts: contracts,
  icon: rsk
};
