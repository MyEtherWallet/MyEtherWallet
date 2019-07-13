import web3Eth from 'web3';
import MEWProvider from '@/wallets/web3-provider';
import { WEB3_DETECTED } from './cxEvents';
if (
  window.hasOwnProperty('web3') &&
  !window.web3.currentProvider.hasOwnProperty('isMew')
) {
  const event = new CustomEvent(
    WEB3_DETECTED.replace('{{id}}', window.extentionID)
  );
  window.dispatchEvent(event);
} else if (!window.hasOwnProperty('web3')) {
  window.web3 = new web3Eth(new MEWProvider('https://mainnet.infura.io/mew'));
  window.web3.currentProvider.isMew = true;
}
