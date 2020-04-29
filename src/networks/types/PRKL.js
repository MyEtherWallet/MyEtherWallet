import tokens from '@/_generated/tokens/tokens-prkl.json';
import contracts from '@/_generated/contracts/contract-abi-prkl.json';
import perkle from '@/assets/images/networks/perkle.svg';

export default {
  name: 'PRKL',
  name_long: 'Perkle',
  homePage: 'https://esprezzo.io/',
  blockExplorerTX: 'https://explorer.esprezzo.io/transactions/[[txHash]]',
  blockExplorerAddr: 'https://explorer.esprezzo.io/addresses/[[address]]',
  chainID: 667,
  tokens: tokens,
  contracts: contracts,
  icon: perkle,
  currencyName: 'PRKL'
};
