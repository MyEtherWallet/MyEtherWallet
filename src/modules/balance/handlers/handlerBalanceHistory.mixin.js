import utils from 'web3-utils';
import BigNumber from 'bignumber.js';

export default {
  name: 'HandlerBalanceHistory',
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
