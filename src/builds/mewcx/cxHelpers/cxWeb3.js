// eslint-disable-next-line
import MewCxProvider from '@/wallets/web3-provider/providers/mew-cx-web3';
// import { WEB3_DETECTED } from './cxEvents';
const ethereumProvider = new MewCxProvider().setMaxListeners(0); // setting to 0 to remove listener warning
if (
  (window.hasOwnProperty('web3') && window.web3) ||
  (window.hasOwnProperty('ethereum') && window.ethereum)
) {
  if (
    (window.web3 &&
      window.web3.currentProvider &&
      window.web3.currentProvider.isMew) ||
    (window.ethereum && window.ethereum.isMew)
  ) {
    window.dispatchEvent(event);
  }
} else {
  // eslint-disable-next-line
  console.info('MEWCX Web3 provider injected');
  window.ethereum = ethereumProvider;
}
