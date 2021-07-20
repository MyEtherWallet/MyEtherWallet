import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';

const unstoppable = {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters,
  strict: false
};

export default unstoppable;
