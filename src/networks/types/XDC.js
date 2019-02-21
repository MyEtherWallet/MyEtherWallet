import tokens from '@/tokens/tokens-xdc.json';
import contracts from '@/contracts/contract-abi-xdc.json';
import xdc from '@/assets/images/networks/xdc.svg';

export default {
  name: 'XDC',
  name_long: 'XDC',
  homePage: 'https://xinfin.org/',
  blockExplorerTX: 'https://explorer.xinfin.network/#/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.xinfin.network/#/address/[[address]]',
  chainID: 853,
  tokens: tokens,
  contracts: contracts,
  icon: xdc
};
