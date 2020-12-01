import tokens from '@/tokens/tokens-xdc.json';
import contracts from '@/contracts/contract-abi-xdc.json';
import xdc from '@/assets/images/networks/xdc.svg';

export default {
  name: 'XDC',
  name_long: 'XinFin.Network',
  homePage: 'https://xinfin.Network/',
  blockExplorerTX: 'https://explorer.xinfin.network/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.xinfin.network/addr/[[address]]',
  chainID: 50,
  tokens: tokens,
  contracts: contracts,
  icon: xdc,
  currencyName: 'XDC'
};
