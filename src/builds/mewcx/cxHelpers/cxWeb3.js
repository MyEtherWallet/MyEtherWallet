import Web3 from 'web3';
import {
  MewCxEthereum as ethereumProvider,
  MewCxWeb3 as web3Provider
} from '@/wallets/web3-provider/providers/mew-cx-web3';
import { WEB3_DETECTED } from './cxEvents';
const url = 'https://api.myetherwallet.com/eth';
const web3 = new Web3();
window.web3 = web3;
// const ethereum = new ethereumProvider(url).setMaxListeners(25);
// web3.currentProvider.isMew = true;
// if (
//   window.hasOwnProperty('web3') &&
//   !window.web3.currentProvider.hasOwnProperty('isMew')
// ) {
//   const event = new CustomEvent(
//     WEB3_DETECTED.replace('{{id}}', window.extensionID)
//   );
//   window.dispatchEvent(event);
// } else if (!window.hasOwnProperty('web3')) {
//   window.web3 = web3;
//   window.ethereum = ethereum;
// }
