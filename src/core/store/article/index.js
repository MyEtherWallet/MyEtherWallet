import { defineStore } from 'pinia';

import localStore from 'store';
import Configs from '../configs';

import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';

const article = {
  state: () => ({
    localStore: true,
    articleStore: {},
    timestamp: new Date().getTime(),
    stateVersion: '1.0.0'
  }),
  actions: {
    initStore() {
      if (localStore.get(Configs.LOCAL_STORAGE_KEYS.article)) {
        const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.article);
        if (savedStore.stateVersion === Configs.VERSION.article) {
          this.$patch(Object.assign(this.$state, savedStore));
        }
      }
    },
    /**
     * Update the articles array
     */
    async updateArticles(stateObj) {
      const Url =
        'https://raw.githubusercontent.com/MyEtherWallet/dynamic-data/main/articles.json';
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
    }
  },
  getters: {
    articleList(state) {
      return state.articleStore;
    },
    getArticle(state) {
      return article => {
        return state.articleStore[article];
      };
    }
  }
};

export const useArticleStore = defineStore('article', article);
