import BigNumber from 'bignumber.js';

const fiatValue = function (state) {
  const ethUSDValue = state.ETHUSDValue;
  const rate = state.currencyRate;
  return new BigNumber(ethUSDValue.value).times(rate.data.exchange_rate);
};

export default {
  fiatValue
};
