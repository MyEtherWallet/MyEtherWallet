import Vue from 'vue';
import Vuex from 'vuex';
import { shallowMount } from '@vue/test-utils';
import AccessWalletLayout from '@/layouts/AccessWalletLayout/AccessWalletLayout.vue';
import { Tooling } from '@@/helpers';
import { state, getters } from '@@/helpers/mockStore';

import PriceBar from '@/layouts/AccessWalletLayout/components/PriceBar/PriceBar.vue';

const RouterLinkStub = {
  name: 'router-link',
  template: '<div class="routerlink"><slot> </slot></div>',
  props: ['to']
};

//xdescribe
describe('AccessWalletLayout.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;

    Vue.config.errorHandler = () => {};
    Vue.config.warnHandler = () => {};

    store = new Vuex.Store({
      getters,
      state
    });
  });

  beforeEach(() => {
    wrapper = shallowMount(AccessWalletLayout, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'router-link': RouterLinkStub,
        'price-bar': PriceBar
      }
    });
  });

  xit('[Failing] should render correct tokens data', () => {
    const tokens = [
      {
        symbol: 'BURNER',
        quotes: {
          USD: {
            percent_change_24h: '50',
            price: '5000'
          }
        }
      },
      {
        symbol: '$FFC',
        quotes: {
          USD: {
            percent_change_24h: '70',
            price: '9000'
          }
        }
      }
    ];

    wrapper.setData({ tokens });
    const tokenElements = wrapper.vm.$el.querySelectorAll(
      '.slider-container div'
    );

    for (let i = 0; i < tokenElements.length; i++) {
      const tokenElement = tokenElements[i];
      expect(tokenElement.querySelectorAll('p')[0].textContent.trim()).toEqual(
        tokens[i].symbol
      );
      expect(tokenElement.querySelectorAll('p')[1].textContent.trim()).toEqual(
        '$' + tokens[i].quotes.USD.price
      );
      expect(tokenElement.querySelectorAll('p')[2].textContent.trim()).toEqual(
        tokens[i].quotes.USD.percent_change_24h + '%'
      );
    }
  });

  describe('AccessWalletLayout.vue Methods', () => {});
});
