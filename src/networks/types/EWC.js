//added by 121gw - decentralized EnergyWeb community team

import tokens from '@/_generated/tokens/tokens-ewc.json';
import contracts from '@/_generated/contracts/contract-abi-ewc.json';
import poa from '@/assets/images/networks/ewc.svg';

export default {
  name: 'EWC',
  name_long: 'Energy Web',
  homePage: 'https://www.energyweb.org/',
  blockExplorerTX: 'https://explorer.energyweb.org/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.energyweb.org/address/[[address]]',
  chainID: 246,
  tokens: tokens,
  contracts: contracts,
  icon: ewc,
  currencyName: 'EWT'
};
