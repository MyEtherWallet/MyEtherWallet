import Web3 from 'web3';
import { getMode } from '../../configs';
const chrome = window.chrome;
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('reeeeeeeeeee');
  const useHash = getMode() === 'hash' ? '#' : '';
  if (request.msg === 'injectWeb3') {
    if (
      window.hasOwnProperty('web3') &&
      !window.web3.currentPRovider.hasOwnProperty('isMew')
    ) {
      sendResponse({ response: 'Found a Web3 instance!!!!!!!' });
      chrome.windows.create({
        url: chrome.runtime.getURL(
          `index.html${useHash}/extension-popups/web3-detected`
        ),
        type: 'popup',
        height: 400,
        width: 300,
        focused: true
      });
    } else {
      window.web3 = new Web3('https://api.myetherwallet.com/eth');
      window.web3.currentProvider.isMew = true;
      sendResponse({
        response: 'REEEEEEEEEEEEE! SUCCESSFULLY ADDED WEB3 MY DUDES'
      });
    }
    return true;
  }
});

// import Web3 from 'web3';
// import { getMode } from '../../configs';
// const chrome = window.chrome;
//       window.web3 = new Web3('https://api.myetherwallet.com/eth');
//       window.web3.currentProvider.isMew = true;
// (function() {
//   cb();
//   chrome.tabs.onActivated.addListener(cb);
//   chrome.tabs.onUpdated.addListener(cb);

//   function cb() {
//     const useHash = getMode() === 'hash' ? '#' : '';
//     chrome.tabs.query({ active: true, lastFocusedWindow: true }, () => {
//       if (
//         window.hasOwnProperty('web3') &&
//         !window.web3.currentProvider.hasOwnProperty('isMew')
//       ) {
//         chrome.windows.create({
//           url: chrome.runtime.getURL(
//             `index.html${useHash}/extension-popups/web3-detected`
//           ),
//           type: 'popup',
//           height: 400,
//           width: 300,
//           focused: true
//         });
//       } else {
//         chrome.windows.getCurrent({ populate: false }, res => {
//           console.log(res);
//         });
//       }
//       window.web3 = new Web3('https://api.myetherwallet.com/eth');
//       window.web3.currentProvider.isMew = true;
//     });
//   }
// })();
