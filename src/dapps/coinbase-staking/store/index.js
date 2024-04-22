import State from './state';
import Actions from './actions';

const coinbaseStaking = {
  namespaced: true,
  state: State,
  actions: Actions,
  strict: false
};

export default coinbaseStaking;
