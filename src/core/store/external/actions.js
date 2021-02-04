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
const setForexRates = async function ({ commit }) {
  const rates = await fetch('https://api.exchangeratesapi.io/latest?base=USD')
    .then(res => res.json())
    .catch(e => {
      Toast(e.message, {}, ERROR);
    });
  commit('SET_FOREX_RATES', {
    data: rates.rates,
    timestamp: Date.now()
  });
};
const setLastPath = function ({ commit }, val) {
  commit('SET_LAST_PATH', val);
};
const setETHUSDValue = function ({ commit }, val) {
  commit('SET_ETH_USD_VALUE', val);
};
export default {
  setDarkList,
  setLastPath,
  setForexRates,
  setETHUSDValue
};
