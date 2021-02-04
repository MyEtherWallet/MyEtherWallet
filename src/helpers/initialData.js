import Swapper from '@/modules/swap';
import web3 from 'web3';

export class Tokens {
  static keyTokens = 'tokens';
  static keyTokensTime = 'tokens-time';

  static loadTokens() {
    const swapper = new Swapper(web3);
    swapper.getAllTokens().then(res => {
      localStorage.setItem(this.keyTokens, JSON.stringify(res));
      localStorage.setItem(this.keyTokensTime, Date.now());
    });
  }

  static storeTokensLocalStorage() {
    if (localStorage.getItem(this.keyTokensTime) === null) {
      this.loadTokens();
    } else {
      const tokensTime = localStorage.getItem(this.keyTokensTime);
      const currentTime = Date.now();
      const age = currentTime - tokensTime;

      // Tokens list in Local Storage expires in 12 hours
      if (age > 12 * 60 * 60 * 1000) {
        this.loadTokens();
      }
    }
  }
}
