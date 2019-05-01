import Web3 from 'web3';
// if (window.web3 === undefined) {
// }
// chrome.runtime.onStartup.addListener(() => {
// });

document.web3 = new Web3('https://api.myetherwallet.com/eth');
(function() {
  document.web3 = new Web3('https://api.myetherwallet.com/eth');
})();
