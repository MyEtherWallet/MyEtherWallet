import BigNumber from 'bignumber.js';
/**
 * Get Eth Fiat value
 */
const fiatValue = function (state) {
  const ethUSDValue = state.ETHUSDValue.value || 0;
  const rate = state.currencyRate.data?.exchange_rate;
  return new BigNumber(ethUSDValue).times(rate);
};

export default {
  fiatValue
};
