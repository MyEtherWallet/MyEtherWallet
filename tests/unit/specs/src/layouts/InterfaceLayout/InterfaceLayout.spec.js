import Vue from 'vue';
import Vuex from 'vuex';
import { shallowMount } from '@vue/test-utils';
import InterfaceLayout from '@/layouts/InterfaceLayout/InterfaceLayout.vue';
import InterfaceBalance from '@/layouts/InterfaceLayout/components/InterfaceBalance/InterfaceBalance.vue';
import nodeList from '@/networks';
import url from 'url';
import Web3 from 'web3';
import store from 'store';
import {
  Tooling
} from '@@/helpers';


describe('InterfaceLayout.vue', () => {
    let localVue, i18n, wrapper, store, getters;
    beforeAll(() => {
            const baseSetup = Tooling.createLocalVueInstance();
            localVue = baseSetup.localVue;
            i18n = baseSetup.i18n;
            store = baseSetup.store;

            Vue.config.warnHandler = ()=>{};
        Vue.config.errorHandler = ()=>{};

        const wallet = {
              getChecksumAddressString: jest.fn(x=> 0)
        };

       

        const network = nodeList['ETH'][3];
        const hostUrl = url.parse(network.url);
        
  
         getters = {
           Networks: () =>  {
              return nodeList
            },
          network: () => {
                return network
          },
          wallet: () => {
            return wallet;
          },
          online: () => {
            return false
          }
        };

        let actions = {
          setGasPrice: jest.fn()
        };
        
        const newWeb3 = new Web3(
          `${hostUrl.protocol}//${hostUrl.hostname}:${network.port}${
            hostUrl.pathname
          }`
        );

        store = new Vuex.Store({
          actions,
          getters,
          state:{
            web3: newWeb3,
            network:network,
          }
        });

    });

    beforeEach(() => {
        wrapper = shallowMount(InterfaceLayout, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          stubs: {
             'interface-balance': InterfaceBalance,
          }
        });
    });

  it('should render correct contents', () => {
      let balance = '100';
      wrapper.setData({balance});
      expect(wrapper.vm.$el.querySelector('.balance-text p').textContent.trim()).toEqual(balance);
  });

  describe('InterfaceLayout.vue Methods', () => {});
});
