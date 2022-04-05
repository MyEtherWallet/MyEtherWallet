const setPoolSupply = function ({ commit }, val) {
  commit('SET_POOL_SUPPLY', val);
};
const setStakingFee = function ({ commit }, val) {
  commit('SET_STAKING_FEE', val);
};
const setValidatorApr = function ({ commit }, val) {
  commit('SET_VALIDATOR_APR', val);
};
const addToPendingTxs = function ({ commit }, val) {
  commit('ADD_TO_PENDING_TXS', val);
};
const addToPendingTxsGoerli = function ({ commit }, val) {
  commit('ADD_TO_PENDING_TXS_GOERLI', val);
};
const removePendingTxs = function ({ commit }, val) {
  commit('REMOVE_TO_PENDING_TXS', val);
};
const removePendingTxsGoerli = function ({ commit }, val) {
  commit('REMOVE_TO_PENDING_TXS_GOERLI', val);
};

const closeStakewisePromo = function ({ commit }) {
  commit('CLOSE_STAKEWISE_PROMO');
};

const hideForSeven = function ({ commit }) {
  commit('HIDE_FOR_SEVEN');
};

const hideForFourteen = function ({ commit }) {
  commit('HIDE_FOR_FOURTEEN');
};

export default {
  setPoolSupply,
  setStakingFee,
  setValidatorApr,
  addToPendingTxs,
  addToPendingTxsGoerli,
  removePendingTxs,
  removePendingTxsGoerli,
  closeStakewisePromo,
  hideForSeven,
  hideForFourteen
};
