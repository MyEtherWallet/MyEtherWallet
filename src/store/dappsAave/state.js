import store from 'store';

const token = store.get('token') !== undefined ? store.get('token') : {};
const rateHistory =
  store.get('rateHistory') !== undefined ? store.get('rateHistory') : {};

const state = {
  token: token,
  rateHistory: rateHistory
};

export default state;
