import { getBalance } from './wallets.graphql';
export default class WalletCalls {
  constructor(apollo) {
    this.apollo = apollo;
  }
  getBalance() {
    return this.apollo
      .query({
        query: getBalance
      })
      .then(response => {
        return response;
      })
      .catch(err => {
        console.error('error', err);
        throw err;
      });
  }
}
