import { getBalanceHistory } from '@/apollo/queries/wallets/wallets.graphql';
import utils from 'web3-utils';
import BigNumber from 'bignumber.js';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';

export default {
  name: 'HandlerBalanceHistory',
  data() {
    return {
      getTimeseriesData: '',
      nextKey: ''
    };
  },
  apollo: {
    /**
     * Apollo query to return balance history
     */
    getTimeseriesData: {
      query: getBalanceHistory,
      variables() {
        return {
          timeString: Math.floor(this.timeString / 1000),
          todaysDate: Math.floor(new Date().getTime() / 1000),
          key: `ACCOUNT_BALANCE_PREFIX_AVG-0xETH-${this.address}`,
          scale: this.scale,
          _nextKey: this.nextKey
        };
      },
      update: data => data.getTimeseriesData,
      skip() {
        const acceptableScales = ['seconds', 'minutes', 'hours', 'days'];
        return !acceptableScales.includes(this.scale) || !this.isEthNetwork;
      },
      result() {
        const parsedResult = this._parseResult(this.getTimeseriesData.items);
        const nextKey = this.getTimeseriesData.nextKey;
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
            this.nextKey = nextKey;
            this.scale = 'days';
            this.timeString = new Date().getTime() - 1000 * 60 * 60 * 24 * 365;
            this.chartData.push(parsedResult);
            this.$apollo.queries.getBalanceHistory?.refetch();
          }
        } while (nextKey);
      },
      error(error) {
        Toast(error.message, {}, ERROR);
      }
    }
  },
  methods: {
    /**
     * Parse Apollo Data into chart format.
     */
    _parseResult(data) {
      return data
        ? data.map(item => {
            const fromWei = utils.fromWei(item.value);
            const value = BigNumber(fromWei).toFixed(4);
            const returnedValue = BigNumber(value).toNumber();
            const actualTimeStamp = BigNumber(item.timestamp)
              .times(1000)
              .toNumber();
            return [actualTimeStamp, returnedValue];
          })
        : [];
    }
  }
};
