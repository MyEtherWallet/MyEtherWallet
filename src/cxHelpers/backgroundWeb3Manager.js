import Web3 from 'web3';

(function() {
  if (window.web3 === undefined) {
    window.web3 = new Web3('https://api.myetherwallet.com/eth');
  }
})();
