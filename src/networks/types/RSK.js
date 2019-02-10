import tokens from '@/tokens/tokens-rsk.json';
import contracts from '@/contracts/contract-abi-rsk.json';
import rsk from '@/assets/images/networks/rsk.svg';

export default {
  name: 'RSK',
  name_long: 'RSK',
  homePage: 'https://www.rsk.co',
  blockExplorerTX: 'https://explorer.rsk.co/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.rsk.co/address/[[address]]',
  chainID: 30,
  tokens: tokens,
  contracts: contracts,
  ens: {
    registry: '0xcb868aeabd31e2b66f74e9a55cf064abb31a4ad5',
    registrarTLD: 'rsk'
  },
  icon: rsk
};
