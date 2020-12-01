import tokens from '@/_generated/tokens/tokens-ere.json';
import contracts from '@/_generated/contracts/contract-abi-ere.json';
import ere from '@/assets/images/networks/ere.svg';

export default {
  name: 'ERE',
  name_long: 'EtherCore',
  homePage: 'https://ethercore.io',
  blockExplorerTX: 'https://explorer.ethercore.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.ethercore.io/address/[[address]]',
  chainID: 466,
  tokens: tokens,
  contracts: contracts,
  icon: ere,
  currencyName: 'ERE'
};
