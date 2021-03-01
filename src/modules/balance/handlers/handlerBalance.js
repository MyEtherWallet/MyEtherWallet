import WalletCalls from '@/apollo/queries/wallets/index';
import utils from 'web3-utils';
import BigNumber from 'bignumber.js';

export default class Balance {
  constructor(apollo, address) {
    this.apollo = apollo;
    this.address = address;
    this.chartData = [];
  }
  // get balance history
  getBalanceHistory(timeString, scale, nextKey) {
    const todaysDate = new Date().getTime();
    const wallet = new WalletCalls(this.apollo);
    return wallet
      .getBalanceHistory(timeString, todaysDate, this.address, scale, nextKey)
      .then(res => {
        const parsedResult = res.data.getTimeseriesData.items.map(item => {
          const fromWei = utils.fromWei(item.value);
          const value = BigNumber(fromWei).toFixed(4);
          const returnedValue = BigNumber(value).toNumber();
          const actualTimeStamp = BigNumber(item.timestamp)
            .times(1000)
            .toNumber();
          return [actualTimeStamp, returnedValue];
        });
        do {
          if (!res.data.getTimeseriesData.nextKey) {
            // when null
            this.chartData = parsedResult;
          } else {
            // when key exists
            const key = res.data.getTimeseriesData.nextKey;
            const timeString = new Date();
            const lastYear = timeString.getTime() - 1000 * 60 * 60 * 24 * 365;
            this.chartData.push(parsedResult);
            this.getBalanceHistory(lastYear, 'days', key);
          }
        } while (res.data.getTimeseriesData.nextKey);
        return this.chartData;
      });
  }
}
