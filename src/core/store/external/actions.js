import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
const setDarkList = async function ({ commit }) {
  const darkList = await fetch(
    'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/addresses/addresses-darklist.json'
  )
    .then(res => res.json())
    .catch(e => {
      Toast(e.message, {}, ERROR);
    });
  commit('SET_DARK_LIST', {
    data: darkList,
    timestamp: Date.now()
  });
};
const setCurrency = async function ({ commit }, val) {
  const rates = await fetch(
    'https://mainnet.mewwallet.dev/v2/prices/exchange-rates'
  )
    .then(res => res.json())
    .catch(e => {
      Toast(e.message, {}, ERROR);
    });
  const currentRate = rates
    ? rates.find(rate => rate.fiat_currency === val)
    : {};
  commit('SET_CURRENCY_RATE', {
    data: currentRate,
    timestamp: Date.now()
  });
};
const setLastPath = function ({ commit }, val) {
  commit('SET_LAST_PATH', val);
};
const setCoinGeckoTokens = function ({ commit }, params) {
  commit('SET_COIN_GECKO_TOKENS', params);
};

export default {
  setDarkList,
  setLastPath,
  setCurrency,
  setCoinGeckoTokens
};
