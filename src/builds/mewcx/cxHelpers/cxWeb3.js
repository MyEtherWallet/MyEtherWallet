// import Web3Eth from 'web3-eth';
import Web3 from 'web3';
import {
  MewCxEthereum as ethereumProvider,
  MewCxWeb3 as web3Provider
} from '@/wallets/web3-provider/providers/mew-cx-web3';
import { WEB3_DETECTED } from './cxEvents';
const url = 'https://api.myetherwallet.com/eth';
const minWeb3 = new Web3(new web3Provider(url));
const ethereum = new ethereumProvider(url);
minWeb3.currentProvider.isMew = true;
if (
  window.hasOwnProperty('web3') &&
  !window.web3.currentProvider.hasOwnProperty('isMew')
) {
  const event = new CustomEvent(
    WEB3_DETECTED.replace('{{id}}', window.extensionID)
  );
  window.dispatchEvent(event);
} else if (!window.hasOwnProperty('web3')) {
  window.web3 = minWeb3;
  window.ethereum = ethereum;
}
