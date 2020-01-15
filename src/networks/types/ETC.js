import tokens from '@/tokens/tokens-etc.json';
import contracts from '@/contracts/contract-abi-etc.json';
import etc from '@/assets/images/networks/etc.svg';

export default {
  name: 'ETC',
  name_long: 'Ethereum Classic',
  homePage: 'https://ethereumclassic.org/',
  blockExplorerTX: 'https://blockscout.com/etc/mainnet/tx/[[txHash]]',
  blockExplorerAddr: 'https://blockscout.com/etc/mainnet/address/[[address]]',
  chainID: 61,
  tokens: tokens,
  contracts: contracts,
  icon: etc,
  currencyName: 'ETC'
};
