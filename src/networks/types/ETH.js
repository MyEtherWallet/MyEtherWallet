import tokens from '@/tokens/tokens-eth.json';
import contracts from '@/contracts/contract-abi-eth.json';
import eth from '@/assets/images/networks/eth.svg';
import { ETH } from '../tlds';

export default {
  name: 'ETH',
  name_long: 'Ethereum',
  homePage: 'https://ethereum.org',
  blockExplorerTX: 'https://etherscan.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://etherscan.io/address/[[address]]',
  chainID: 1,
  tokens: tokens,
  contracts: contracts,
  ens: {
    registry: '0x314159265dd8dbb310642f98f50c066173c1259b',
    registrarTLD: 'eth',
    registrarType: 'auction',
    supportedTld: ETH
  },
  icon: eth
};
