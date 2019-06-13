import Web3 from 'web3';
import { getMode } from '../../configs';
const chrome = window.chrome;
const useHash = getMode() === 'hash' ? '#' : '';
if (
  window.hasOwnProperty('web3') &&
  !window.web3.currentProvider.hasOwnProperty('isMew')
) {
  chrome.windows.create({
    url: chrome.runtime.getURL(
      `index.html${useHash}/extension-popups/web3-detected`
    ),
    type: 'popup',
    height: 400,
    width: 300,
    focused: true
  });
} else if (!window.hasOwnProperty('web3')) {
  const web3 = new Web3('https://mainnet.infura.io/mew');
  window.web3 = web3;
  web3.currentProvider.isMew = true;
}
