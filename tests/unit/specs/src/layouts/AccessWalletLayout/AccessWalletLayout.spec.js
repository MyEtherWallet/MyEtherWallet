import Vue from 'vue';
import { shallowMount, RouterLinkStub } from '@vue/test-utils';
import AccessWalletLayout from '@/layouts/AccessWalletLayout/AccessWalletLayout.vue';
import { Tooling } from '@@/helpers';
import BigNumber from 'bignumber.js';
import VueX from 'vuex';
import { state, getters } from '@@/helpers/mockStore';
import { fetch } from 'whatwg-fetch';

function roundPercentage(num) {
  return new BigNumber(num).toFixed(2);
}

describe('AccessWalletLayout.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = new VueX.Store({
      modules: {
        main: {
          namespaced: true,
          state,
          getters
        }
      }
    });

    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    global.fetch = fetch;

    wrapper = shallowMount(AccessWalletLayout, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'router-link': RouterLinkStub
      }
    });
  });

  it('should render correct tokens data', () => {
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

    for (const [i, tokenElement] of tokenElements.entries()) {
      expect(tokenElement.querySelectorAll('p')[0].textContent.trim()).toEqual(
        tokens[i].symbol
      );
      expect(tokenElement.querySelectorAll('p')[1].textContent.trim()).toEqual(
        '$' + tokens[i].quotes.USD.price
      );
      expect(tokenElement.querySelectorAll('p')[2].textContent.trim()).toEqual(
        roundPercentage(tokens[i].quotes.USD.percent_change_24h) + '%'
      );
    }
  });

  describe('AccessWalletLayout.vue Methods', () => {});

  it('should dismount properly', () => {
    expect(wrapper.destroy()).toBe(undefined);
  });
});
