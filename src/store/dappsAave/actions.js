const setToken = function({ commit }, token) {
  commit('SET_TOKEN', token);
};

export default {
  setToken
};
