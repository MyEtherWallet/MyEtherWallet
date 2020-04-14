const setToken = function ({ commit }, token) {
  commit('SET_TOKEN', token);
};

const setRateHistory = function ({ commit }, rateHistory) {
  commit('SET_RATE_HISTORY', rateHistory);
};

export default {
  setToken,
  setRateHistory
};
