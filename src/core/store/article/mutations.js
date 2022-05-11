import localStore from 'store';
import Configs from '../configs';

const INIT_STORE = function (state) {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.article)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.article);
    if (savedStore.stateVersion === Configs.VERSION.article) {
      Object.assign(state, savedStore);
    }
  }
};

const SET_ARTICLES = function (state, articles) {
  state.articleStore = articles;
};

const UPDATE_TIMESTAMP = function (state, timestamp) {
  state.timestamp = timestamp;
};

export default { SET_ARTICLES, UPDATE_TIMESTAMP, INIT_STORE };
