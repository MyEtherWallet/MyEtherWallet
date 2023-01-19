const SET_CURRENCY_RATE = async function (state, rate) {
  state.currencyRate = rate;
};
const SET_LAST_PATH = function (state, val) {
  state.path = val;
};
const SET_COIN_GECKO_TOKENS = function (state, tokens) {
  state.coinGeckoTokens = tokens;
};
const SET_NETWORK_TOKENS = function (state, tokens) {
  state.networkTokens = tokens;
};
const SET_LAST_TIMESTAMP = function (state, timestamp) {
  state.lastTimestamp = timestamp;
};
const SET_FIAT_EXCHANGE_RATES = function (state, tokens) {
  state.fiatInfo = tokens;
};
const SET_ALL_TOKENS = function (state, tokens) {
  state.allTokens = tokens;
};
const SET_CACHE = function (state, hash, data) {
  state.cache[hash] = data;
};
const CLEAR_CACHE = function (state) {
  state.cache = {};
};

export default {
  SET_LAST_PATH,
  SET_CURRENCY_RATE,
  SET_COIN_GECKO_TOKENS,
  SET_NETWORK_TOKENS,
  SET_FIAT_EXCHANGE_RATES,
  SET_LAST_TIMESTAMP,
  SET_ALL_TOKENS,
  SET_CACHE,
  CLEAR_CACHE
};
