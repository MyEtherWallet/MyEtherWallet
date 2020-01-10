import tokens from '@/tokens/tokens-ere.json';
import contracts from '@/contracts/contract-abi-ere.json';
import ere from '@/assets/images/networks/ere.svg';

export default {
  name: 'ERE',
  name_long: 'EtherCore',
  homePage: 'https://ethercore.org',
  blockExplorerTX: 'https://explorer.ethercore.org/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.ethercore.org/addr/[[address]]',
  chainID: 466,
  tokens: tokens,
  contracts: contracts,
  icon: ere,
  currencyName: 'ERE'
};
