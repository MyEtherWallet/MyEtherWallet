import tokens from '@/_generated/tokens/tokens-etho.json';
import contracts from '@/_generated/contracts/contract-abi-etho.json';
import etho from '@/assets/images/networks/etho.svg';

export default {
  name: 'ETHO',
  name_long: 'Ether1',
  homePage: 'ether1.org',
  blockExplorerTX: 'https://explorer.ether1.org/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.ether1.org/addr/[[address]]',
  chainID: 1313114,
  tokens: tokens,
  contracts: contracts,
  icon: etho,
  currencyName: 'ETHO'
};
