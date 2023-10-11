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

const SET_SELECTED_EIP6963_PROVIDER = function (state, provider) {
  state.selectedEIP6963Provider = provider;
};

const STORE_EIP6963_WALLET = function (state, detail) {
  const newArr = state.eip6963Providers;
  const findInArr = newArr.findIndex(item => {
    return (
      detail.info.uuid.toLowerCase() === item.info.uuid.toLowerCase() ||
      detail.info.name.toLowerCase() === item.info.name.toLowerCase()
    );
  });
  if (findInArr > -1) {
    newArr[findInArr] = detail;
  } else {
    newArr.push(detail);
  }
  state.eip6963Providers = newArr;
};
export default {
  SET_LAST_PATH,
  SET_CURRENCY_RATE,
  SET_COIN_GECKO_TOKENS,
  SET_NETWORK_TOKENS,
  SET_SELECTED_EIP6963_PROVIDER,
  STORE_EIP6963_WALLET
};
