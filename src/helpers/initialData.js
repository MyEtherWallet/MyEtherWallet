import Swapper from '@/modules/swap';
import web3 from 'web3';

function loadTokens() {
  const swapper = new Swapper(web3);
  swapper.getAllTokens().then(tokens => {
    localStorage.setItem('tokens', JSON.stringify(tokens));
    localStorage.setItem('tokens-time', Date.now());
  });
}

export class InitialData {
  static saveTokensLocalStorage() {
    if (localStorage.getItem('tokens-time') === null) {
      loadTokens();
    } else {
      const tokensTime = localStorage.getItem('tokens-time');
      const currentTime = Date.now();
      const age = currentTime - tokensTime;

      // Tokens list in Local Storage expires in 12 hours
      if (age > 12 * 60 * 60 * 1000) {
        loadTokens();
      }
    }
  }
}
