import State from './state';
import Actions from './actions';

const ensManagerStore = {
  namespaced: true,
  state: State,
  actions: Actions,
  strict: false
};

export default ensManagerStore;
