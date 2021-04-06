import { getBalanceHistory } from './wallets.graphql';
export default class WalletCalls {
  constructor(apollo) {
    this.apollo = apollo;
  }
  getBalanceHistory(timeString, todaysDate, address, scale, nextKey) {
    const key = `ACCOUNT_BALANCE_PREFIX_AVG-0xETH-${address}`;
    const actualTimeString = Math.floor(timeString / 1000);
    const actualTodaysDate = Math.floor(todaysDate / 1000);
    const acceptableScales = ['seconds', 'minutes', 'hours', 'days'];
    if (!acceptableScales.includes(scale)) {
      throw new Error('Scale not valid.');
    }
    return this.apollo.query({
      query: getBalanceHistory,
      variables: {
        timeString: actualTimeString,
        todaysDate: actualTodaysDate,
        key: key,
        scale: scale,
        _nextKey: nextKey
      }
    });
  }
}
