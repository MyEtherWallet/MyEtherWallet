// import Web3 from 'web3';
// import { getMode } from '../../configs';
const chrome = window.chrome;
// const web3 = new Web3('https://api.myetherwallet.com/eth');
// const injectWeb3 =
//   '(' +
//   function() {
//     window.web3 = web3;
//     window.web3.currentProvider.isMew = true;
//   } +
//   ')' +
//   '(' +
//   web3 +
//   ');';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.msg === 'injectWeb3') {
    const script = document.createElement('script');
    script.src = chrome.extension.getURL('cxWeb3.js');
    (document.head || document.documentElement).appendChild(script);
    script.onload = function() {
      script.parentNode.removeChild(script);
    };
    sendResponse({
      response: 'REEEEEEEEEEEEE! SUCCESSFULLY ADDED WEB3 MY DUDES'
    });
    return true;
  }
});

// function injector() {
//   console.log('injector called');
//   const script = document.createElement('script');
//   script.src = chrome.extension.getUrl('script.js');
//   (document.head || document.documentElement).appendChild(script);
//   script.onload = function() {
//     script.parentNode.removeChild(script);
//   };
// }

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
