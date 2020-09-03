import tokens from '@/_generated/tokens/tokens-akroma.json';
import contracts from '@/_generated/contracts/contract-abi-akroma.json';
import aka from '@/assets/images/networks/aka.svg';

export default {
  name: 'AKA',
  name_long: 'Akroma',
  homePage: 'https://akroma.io/',
  blockExplorerTX: 'https://akroma.io/explorer/transaction/[[txHash]]',
  blockExplorerAddr: 'https://akroma.io/explorer/address/[[address]]',
  chainID: 200625,
  tokens: tokens,
  contracts: contracts,
  icon: aka,
  currencyName: 'AKA'
};
