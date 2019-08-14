/* eslint-disable no-undef */
import { CX_WEB3_DETECTED } from '../cxEvents';
export default async ({ event }, res, next) => {
  if (event !== CX_WEB3_DETECTED) return next();
  chrome.storage.sync.get('warned', item => {
    if (Object.keys(item).length === 0) {
      clearTimeout(metamaskChecker);
      chrome.windows.create({
        url: chrome.runtime.getURL(
          `index.html#/extension-popups/web3-detected`
        ),
        type: 'popup',
        height: 500,
        width: 300,
        focused: true
      });
      chrome.storage.sync.set({ warned: 'true' });
      metamaskChecker = setTimeout(function() {
        chrome.storage.remove('warned');
      }, 900000);
    }
  });
};
