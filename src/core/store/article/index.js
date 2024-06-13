import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

import store from 'store';
import Configs from '../configs';

import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';

export const useArticleStore = defineStore('article', () => {
  const localStore = ref(true);
  const articleStore = ref({});
  const timestamp = ref(new Date().getTime());
  const stateVersion = ref('1.0.0');

  // actions
  const initStore = () => {
    if (store.get(Configs.LOCAL_STORAGE_KEYS.article)) {
      const savedStore = store.get(Configs.LOCAL_STORAGE_KEYS.article);
      if (savedStore.stateVersion === Configs.VERSION.article) {
        $patch(Object.assign($state, savedStore));
      }
    }
  };
  /**
   * Update the articles array
   */
  const updateArticles = async stateObj => {
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
        articleStore.value = articles;
        timestamp.value = new Date().getTime();
      } catch (err) {
        Toast(err, {}, ERROR);
      }
    }
  };

  // getters
  const articleList = computed(() => {
    return articleStore.value;
  });

  const getArticle = () => {
    return article => {
      return articleStore.value[article];
    };
  };

  return {
    localStore,
    articleStore,
    timestamp,
    stateVersion,
    initStore,
    updateArticles,
    articleList,
    getArticle
  };
});
