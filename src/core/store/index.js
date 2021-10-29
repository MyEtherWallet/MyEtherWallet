import Vue from 'vue';
import Vuex from 'vuex';
import globalModule from './global';
import wallet from './wallet';
import notifications from './notifications';
import externalData from './external';
import swap from './swap';
import custom from './custom';
import Configs from './configs';
import LocalStore from 'store';
import { dappStore } from '@/dapps/dappsStore';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    global: globalModule,
    wallet: wallet,
    external: externalData,
    notifications: notifications,
    swap: swap,
    custom: custom,
    ...dappStore
  }
});

store.subscribe((mutation, state) => {
  const modules = Object.keys(state);
  modules.forEach(m => {
    if (mutation.type.startsWith(m) && state[m].localStore) {
      LocalStore.set(Configs.LOCAL_STORAGE_KEYS[m], state[m]);
    }
  });
});
export default store;
