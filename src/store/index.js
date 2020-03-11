import Vue from 'vue';
import Vuex from 'vuex';
import main from './main';
import aave from './dappsAave';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    main: main,
    aave: aave
  }
});
