import WalletCalls from '@/apollo/queries/wallets/index';
import utils from 'web3-utils';
import BigNumber from 'bignumber.js';

export default class Balance extends WalletCalls {
  constructor(address) {
    super(address);
    this.address = address;
    this.chartData = [];
  }
  /**
   * Get Balance History
   * using Apollo query: getBalanceHistory
   * from WalletCalls
   */
  getHistory(timeString, scale, nextKey) {
    const todaysDate = new Date().getTime();
    return this.getBalanceHistory(
      timeString,
      todaysDate,
      this.address,
      scale,
      nextKey
    ).then(res => {
      const parsedResult = this._parseResult(res.data.getTimeseriesData.items);
      const nextKey = res.data.getTimeseriesData.nextKey;
      do {
        if (!nextKey) {
          /**
           * when nextKey null
           */
          this.chartData = parsedResult;
        } else {
          /**
           * when nextKey exists
           */
          const key = nextKey;
          const timeString = new Date();
          const lastYear = timeString.getTime() - 1000 * 60 * 60 * 24 * 365;
          this.chartData.push(parsedResult);
          this.getBalanceHistory(lastYear, 'days', key);
        }
      } while (nextKey);
      return this.chartData;
    });
  }
  /**
   * Parse the history result correctly
   */
  _parseResult(data) {
    return data.map(item => {
      const fromWei = utils.fromWei(item.value);
      const value = BigNumber(fromWei).toFixed(4);
      const returnedValue = BigNumber(value).toNumber();
      const actualTimeStamp = BigNumber(item.timestamp).times(1000).toNumber();
      return [actualTimeStamp, returnedValue];
    });
  }
}
