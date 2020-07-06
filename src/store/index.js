import Vue from 'vue';
import Vuex from 'vuex';
import main from './main';
import mewcx from './mewcx';
import aave from './dappsAave';

Vue.use(Vuex);
let obj;
if (BUILD_TYPE === 'mewcx') {
  obj = {
    modules: {
      main: main,
      aave: aave,
      mewcx: mewcx
    }
  };
} else {
  obj = {
    modules: {
      main: main,
      aave: aave
    }
  };
}
export default new Vuex.Store(obj);
