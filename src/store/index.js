import Vue from 'vue';
import Vuex from 'vuex';
import global from './global';
import wallet from './wallet';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    global: global,
    wallet: wallet
  }
});
