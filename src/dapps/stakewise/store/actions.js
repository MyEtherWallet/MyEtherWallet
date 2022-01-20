const setPoolSupply = function ({ commit }, val) {
  commit('SET_POOL_SUPPLY', val);
};
const setStakingFee = function ({ commit }, val) {
  commit('SET_STAKING_FEE', val);
};
const setValidatorApr = function ({ commit }, val) {
  commit('SET_VALIDATOR_APR', val);
};

export default { setPoolSupply, setStakingFee, setValidatorApr };
