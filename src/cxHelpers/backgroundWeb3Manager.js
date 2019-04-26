import Web3 from 'web3';
const chrome = window.chrome;
chrome.app.runtime.onLaunched.addListener(() => {
  if (window.web3 === undefined) {
    window.web3 = new Web3('https://api.myetherwallet.com/eth');
  }
});
// (function() {
// })();
