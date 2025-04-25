import State from './state';
import Mutations from './mutations';
import Actions from './actions';

const trendingTokens = {
  namespaced: true,
  state: State,
  mutations: Mutations,
  actions: Actions,
  strict: true
};

export default trendingTokens;
