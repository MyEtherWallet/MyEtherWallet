const addValidatorIndex = function ({ commit }, val) {
  commit('ADD_VALIDATOR_INDEX', val);
};
const addWithdrawalValidatorIndex = function ({ commit }, val) {
  commit('ADD_WITHDRAWAL_INDEX', val);
};

export default {
  addValidatorIndex,
  addWithdrawalValidatorIndex
};
