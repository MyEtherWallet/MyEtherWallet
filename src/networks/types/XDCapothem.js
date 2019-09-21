import tokens from '@/tokens/tokens-xdc.json';
import contracts from '@/contracts/contract-abi-xdc.json';
import xdc from '@/assets/images/networks/xdc.svg';

export default {
  name: 'XDC Apothem',
  name_long: 'XDC Apothem',
  homePage: 'https://xinfin.org/',
  blockExplorerAddr: 'https://explorer.apothem.network/account/[[address]]',
  blockExplorerTX: 'https://explorer.apothem.network/tx/[[txHash]]',
  chainID: 51,
  tokens: tokens,
  contracts: contracts,
  ens: {
    registry: '0x41ab1b6fcbb2fa9dced81acbdec13ea6315f2bf2',
    registrarTLD: 'xdc'
  },
  icon: xdc
};
