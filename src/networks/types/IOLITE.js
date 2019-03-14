import tokens from '@/tokens/tokens-iolite.json';
import contracts from '@/contracts/contract-abi-iolite.json';
import iolite from '@/assets/images/networks/iolite.svg';

export default {
  name: 'ILT',
  name_long: 'IOLITE',
  homePage: 'https://iolite.io/',
  blockExplorerTX: 'https://scan.iolite.io/txs/[[txHash]]',
  blockExplorerAddr: 'https://scan.iolite.io/addrs/[[address]]',
  chainID: 18289463,
  tokens: tokens,
  contracts: contracts,
  icon: iolite
};
