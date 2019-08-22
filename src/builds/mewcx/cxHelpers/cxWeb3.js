import Web3 from 'web3';
import { MewCxEthereum as ethereumProvider } from '@/wallets/web3-provider/providers/mew-cx-web3';
import { WEB3_DETECTED } from './cxEvents';
const ethereum = new ethereumProvider().setMaxListeners(0); // setting to 0 to remove listener warning
if (
  window.hasOwnProperty('web3') &&
  !window.web3.currentProvider.hasOwnProperty('isMew')
) {
  const event = new CustomEvent(
    WEB3_DETECTED.replace('{{id}}', window.extensionID)
  );
  window.dispatchEvent(event);
} else if (!window.hasOwnProperty('web3')) {
  // eslint-disable-next-line
  console.info('MEWCX Web3 provider injected');
  window.web3 = new Web3(ethereum);
  // window.web3 = {};
  // window.web3.currentProvider = ethereum;
  window.web3.currentProvider.isMew = true;
  window.web3.currentProvider.isMetaMask = true;
  // window.Web3 = Web3; // unsure if this is needed
  window.ethereum = ethereum;
}
