const SET_DARK_LIST = async function (state, darkList) {
  state.darkList = darkList;
};
const SET_FOREX_RATES = async function (state, rates) {
  state.forexRates = rates;
};
const SET_LAST_PATH = function (state, val) {
  state.path = val;
};
const SET_ETH_USD_VALUE = function (state, val) {
  state.ETHUSDValue = val;
};
export default {
  SET_DARK_LIST,
  SET_LAST_PATH,
  SET_FOREX_RATES,
  SET_ETH_USD_VALUE
};
