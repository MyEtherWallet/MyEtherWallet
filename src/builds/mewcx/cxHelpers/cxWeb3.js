import web3 from 'web3';
import MEWProvider from '@/wallets/web3-provider';
import { buildMode } from './cxHelpers.js';
const chrome = window.chrome;
if (
  window.hasOwnProperty('web3') &&
  !window.web3.currentProvider.hasOwnProperty('isMew')
) {
  chrome.windows.create({
    url: chrome.runtime.getURL(
      `index.html${buildMode()}/extension-popups/web3-detected`
    ),
    type: 'popup',
    height: 400,
    width: 300,
    focused: true
  });
} else if (!window.hasOwnProperty('web3')) {
  window.web3 = new web3(new MEWProvider('https://mainnet.infura.io/mew'));
  window.web3.currentProvider.isMew = true;
}
