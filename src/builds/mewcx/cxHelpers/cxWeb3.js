import Web3 from 'web3';
import { MewCxEthereum as ethereumProvider } from '@/wallets/web3-provider/providers/mew-cx-web3';
import { WEB3_DETECTED } from './cxEvents';
const ethereum = new ethereumProvider().setMaxListeners(25);
if (
  window.hasOwnProperty('web3') &&
  !window.web3.currentProvider.hasOwnProperty('isMew')
) {
  const event = new CustomEvent(
    WEB3_DETECTED.replace('{{id}}', window.extensionID)
  );
  window.dispatchEvent(event);
} else if (!window.hasOwnProperty('web3')) {
  window.web3 = {};
  window.web3.currentProvider = ethereumProvider;
  window.web3.currentProvider.isMew = true;
  window.Web3 = Web3;
  window.ethereum = ethereum;
}
