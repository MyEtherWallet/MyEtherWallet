import {
  getEthBalance,
  getUSDPrice,
  getBalanceHistory
} from './wallets.graphql';
import { Toast, ERROR } from '@/components/toast';
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
        Toast(err.message, {}, ERROR);
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
          return ethereumPrice[0];
        }
        return null;
      })
      .catch(err => {
        Toast(err.message, {}, ERROR);
      });
  }

  getBalanceHistory(timeString, address, scale, nextKey) {
    const key = `ACCOUNT_BALANCE_PREFIX_AVG-0xETH-${address}`;
    const actualTimeString = Math.floor(timeString / 1000);
    const acceptableScales = ['seconds', 'minutes', 'hours', 'days'];
    if (!acceptableScales.includes(scale)) {
      throw new Error('Scale not valid.');
    }
    return this.apollo.query({
      query: getBalanceHistory,
      variables: {
        timeString: actualTimeString,
        key: key,
        scale: scale,
        _nextKey: nextKey
      }
    });
  }
}
