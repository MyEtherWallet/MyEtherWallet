import Web3 from 'web3';
import { getMode } from '../../configs';
const chrome = window.chrome;

(function() {
  cb();
  chrome.tabs.onActivated.addListener(cb);
  chrome.tabs.onUpdated.addListener(cb);

  function cb() {
    const useHash = getMode() === 'hash' ? '#' : '';
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, () => {
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
      }
      window.web3 = new Web3('https://api.myetherwallet.com/eth');
      window.web3.currentProvider.isMew = true;
    });
  }
})();
