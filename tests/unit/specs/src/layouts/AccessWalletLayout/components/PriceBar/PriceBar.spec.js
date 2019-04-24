import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import PriceBar from '@/layouts/AccessWalletLayout/components/PriceBar/PriceBar.vue';

import { Tooling } from '@@/helpers';

describe('PriceBar.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(PriceBar, {
      localVue,
      i18n,
      store,
      attachToDocument: true
    });
  });

  it('should render correct tokens props', () => {
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
    wrapper.setData({ tokens1: tokens });
    wrapper.setData({ tokens2: tokens });
    wrapper.setData({ hidden: false });
    const tokenElements = wrapper.vm.$el.querySelectorAll(
      '.slider-container .token-container'
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

  describe('PriceBar.vue Methods', () => {});
});
