const FIAT_EXCHANGE_RATE_ENDPOINT =
  'https://mainnet.mewwallet.dev/v2/prices/exchange-rates';
const REFRESH_DELAY = 1000 * 60 * 5;

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
  state.lastTimestamp.timestamp = timestamp;
};

const SET_FIAT_EXCHANGE_RATES = function (state, tokens) {
  state.fiatInfo = tokens;
};

const SET_MARKET_INFO = async function (state) {
  const lastTimestamp = state.lastTimestamp;
  if (lastTimestamp && lastTimestamp >= new Date().getTime() - REFRESH_DELAY)
    return;
  const fiatMarketData = await fetch(`${FIAT_EXCHANGE_RATE_ENDPOINT}`)
    .then(res => res.json())
    .then(json => {
      const topMarkets = json;
      const tokens = {};
      topMarkets.forEach(token => {
        tokens[token.fiat_currency] = token;
      });
      return tokens;
    });
  await this.setFiatExchangeRates(fiatMarketData);
  await this.setLastTimestamp(new Date().getTime());
};
export default {
  SET_LAST_PATH,
  SET_CURRENCY_RATE,
  SET_COIN_GECKO_TOKENS,
  SET_NETWORK_TOKENS,
  SET_MARKET_INFO,
  SET_FIAT_EXCHANGE_RATES,
  SET_LAST_TIMESTAMP
};
