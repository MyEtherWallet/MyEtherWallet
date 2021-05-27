import BigNumber from 'bignumber.js';
/**
 * Get Eth Fiat value
 */
const fiatValue = function (state) {
  const ethUSDValue = state.ETHUSDValue.value || 0;
  const rate = state.currencyRate.data?.exchange_rate || 1;
  return new BigNumber(ethUSDValue).times(rate);
};

/**
 * Get Eth Balance Fiat value
 */
const balanceFiatValue = function (state, getters, rootState, rootGetters) {
  const balanceInETH = rootGetters['wallet/balanceInETH'];
  return new BigNumber(balanceInETH).times(getters.fiatValue);
};

export default {
  fiatValue,
  balanceFiatValue
};
