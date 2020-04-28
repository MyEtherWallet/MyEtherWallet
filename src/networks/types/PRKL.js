import tokens from '@/_generated/tokens/tokens-prkl.json';
import contracts from '@/_generated/contracts/contract-abi-prkl.json';
import prkl from '@/assets/images/networks/prkl.svg';

export default {
  name: 'PRKL',
  name_long: 'Perkle',
  homePage: 'https://esprezzo.io',
  blockExplorerTX: 'https://explorer.esprezzo.io/transactions/[[txHash]]',
  blockExplorerAddr: 'https://explorer.esprezzo.io/addresses/[[address]]',
  chainID: 667,
  tokens: tokens,
  contracts: contracts,
  icon: prkl,
  currencyName: 'PRKL'
};
