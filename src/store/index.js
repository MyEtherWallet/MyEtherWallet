import Vue from 'vue';
import Vuex from 'vuex';
import main from './main';
import mewcx from './mewcx';
import aave from './dappsAave';
import VuexWebextensions from '@/helpers/vuexWebextensions';

Vue.use(Vuex);
let obj;
if (BUILD_TYPE === 'mewcx') {
  obj = {
    modules: {
      main: main,
      aave: aave,
      mewcx: mewcx
    },
    plugins: [
      VuexWebextensions({
        persistentStates: [
          'mewcx.accounts',
          'mewcx.defChainId',
          'mewcx.defNetwork',
          'mewcx.favorites',
          'mewcx.sites',
          'main.web3'
        ]
      })
    ]
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
