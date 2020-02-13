const SET_TOKEN = function(state, token) {
  state.token = token;
};

const SET_RATE_HISTORY = function(state, rateHistory) {
  state.rateHistory = rateHistory;
};

export default {
  SET_TOKEN,
  SET_RATE_HISTORY
};
