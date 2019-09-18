// eslint-disable-next-line
import { MewCxEthereum as ethereumProvider } from '@/wallets/web3-provider/providers/mew-cx-web3';
import { WEB3_DETECTED } from './cxEvents';
import web3 from 'web3';
const ethereum = new ethereumProvider().setMaxListeners(0); // setting to 0 to remove listener warning
if (
  (window.hasOwnProperty('web3') &&
    !window.web3.currentProvider.hasOwnProperty('isMew')) ||
  (window.hasOwnProperty('ethereum') &&
    !window.ethereum.hasOwnProperty('isMew'))
) {
  const event = new CustomEvent(
    WEB3_DETECTED.replace('{{id}}', window.extensionID)
  );
  window.dispatchEvent(event);
} else if (!window.hasOwnProperty('web3')) {
  // eslint-disable-next-line
  console.info('MEWCX Web3 provider injected');
  window.ethereum = ethereum;
  window.web3 = web3;
}
