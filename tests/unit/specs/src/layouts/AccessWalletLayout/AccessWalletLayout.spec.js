import Vue from 'vue';
import Vuex from 'vuex';
import { shallowMount } from '@vue/test-utils'
import AccessWalletLayout from '@/layouts/AccessWalletLayout/AccessWalletLayout.vue';
import {
  Tooling
} from '@@/helpers';

import PriceBar from '@/layouts/AccessWalletLayout/components/PriceBar/PriceBar.vue';

const RouterLinkStub = {
  name:'router-link',
  template:'<div class="routerlink"><slot> </slot></div>',
  props:['to']  
}

describe('AccessWalletLayout.vue', () => {
    let localVue, i18n, wrapper, store;
    
    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
        
        Vue.config.errorHandler = () => {};
        Vue.config.warnHandler = () => {};

        let getters = {
          online:() => {
            return true;
          }
        };

        store = new Vuex.Store({
          getters
        });

    });

    beforeEach(() => {
        wrapper = shallowMount(AccessWalletLayout, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          stubs:{
            'router-link':RouterLinkStub,
            'price-bar':PriceBar
          }
        });
    });


  it('should render correct tokens data', () => {
    const tokens = [{
      symbol: "BURNER",
      quotes: {
        USD: {
          percent_change_24h: '50',
          price: '5000'
        }
      }
    },
    {
      symbol: "$FFC",
      quotes: {
        USD: {
          percent_change_24h: '70',
          price: '9000'
        }
      }
    }
    ];

    wrapper.setData({tokens});
    const tokenElements = wrapper.vm.$el.querySelectorAll('.slider-container div');
    
    for (var i = 0; i < tokenElements.length; i++) {
      let tokenElement = tokenElements[i];
      expect(tokenElement.querySelectorAll('p')[0].textContent.trim()).toEqual(tokens[i].symbol);
      expect(tokenElement.querySelectorAll('p')[1].textContent.trim()).toEqual('$' + tokens[i].quotes.USD.price);
      expect(tokenElement.querySelectorAll('p')[2].textContent.trim()).toEqual(tokens[i].quotes.USD.percent_change_24h + '%');
    }
  });

  describe('AccessWalletLayout.vue Methods', () => {});
});
