const SET_CURRENCY_RATE = async function (state, rate) {
  state.currencyRate = rate;
};
const SET_LAST_PATH = function (state, val) {
  state.path = val;
};
const SET_COIN_GECKO_TOKENS = function (state, tokens) {
  state.coinGeckoTokens = tokens;
};
export default {
  SET_LAST_PATH,
  SET_CURRENCY_RATE,
  SET_COIN_GECKO_TOKENS
};
