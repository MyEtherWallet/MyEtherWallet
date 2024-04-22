import localStore from 'store';
import Configs from '../configs';

import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';

const Url =
  'https://raw.githubusercontent.com/MyEtherWallet/dynamic-data/main/articles.json';

const initStore = () => {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.custom)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.custom);
    if (savedStore.stateVersion === Configs.VERSION.custom) {
      this.$state = Object.assign(this.$state, savedStore);
    }
  }
};

/**
 * Update the articles array
 */
const updateArticles = async function (stateObj) {
  const temp = new Date(stateObj.timestamp);
  temp.setHours(72); // Add 3 days to saved timestamp
  if (
    temp.getTime() <= Date.now() ||
    !Object.keys(stateObj.articleList).length
  ) {
    try {
      const res = await fetch(Url);
      const articles = await res.json();
      this.articleStore = articles;
      this.timestamp = new Date().getTime();
    } catch (err) {
      Toast(err, {}, ERROR);
    }
  }
};

export default { updateArticles, initStore };
