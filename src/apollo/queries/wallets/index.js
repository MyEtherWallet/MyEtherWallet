import { getEthBalance, getUSDPrice } from './wallets.graphql';
export default class WalletCalls {
  constructor(apollo) {
    this.apollo = apollo;
  }
  getBalance(hash) {
    return this.apollo
      .query({
        query: getEthBalance,
        variables: {
          hash: hash
        }
      })
      .then(response => {
        return response.data.getEthBalance.balance;
      })
      .catch(err => {
        console.error('error', err);
        throw err;
      });
  }
  getUSDPrice() {
    return this.apollo
      .query({
        query: getUSDPrice
      })
      .then(response => {
        const ethereumPrice = response.data.getLatestPrices.filter(item => {
          if (item.id === 'ethereum') return item;
        });

        if (ethereumPrice) {
          return ethereumPrice[0].current_price;
        }
        return null;
      })
      .catch(err => {
        console.error('error', err);
        throw err;
      });
  }
}
