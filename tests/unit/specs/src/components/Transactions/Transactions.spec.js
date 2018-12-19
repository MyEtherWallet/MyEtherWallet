import Vue from 'vue';
import VueX from 'vuex';
import Transactions from '@/components/Transactions/Transactions.vue';
import { shallowMount } from '@vue/test-utils'
import nodeList from '@/networks';
import url from 'url';
import Web3 from 'web3';
import {
  Tooling
} from '@@/helpers';


describe('Transactions.vue', () => {
  let localVue, i18n, wrapper, store, getters;
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => { };
    Vue.config.errorHandler = () => { };
    const network = nodeList['ETH'][3];
    let wallet = {
      getChecksumAddressString: jest.fn(x => 0),
      getAddressString: () => { return 0 }
    }
    getters = {
      notifications: () => [],
      transactions: () => [],
      network: () => {
        return network
      },
    }

    store = new VueX.Store({
      getters,
      state: {
        wallet: wallet,
        network: network
      }
    });

  });

  beforeEach(() => {
    wrapper = shallowMount(Transactions, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
    });
  });

  it('should render correct dropdownOpen data', () => {
    wrapper.setData({ dropdownOpen: true });
    expect(wrapper.find('.dropdown-list-box').exists()).toBe(true);
  });

  it('should change dropdownOpen data when toggle button', () => {
    wrapper.find('.notification-logo').trigger('click');
    expect(wrapper.vm.$data.dropdownOpen).toBe(true);
    wrapper.find('.notification-logo').trigger('click');
    expect(wrapper.vm.$data.dropdownOpen).toBe(false);
  });

  it('should render correct activeSwapCount data', () => {
    wrapper.setData({ activeSwapCount: 1 });
    expect(wrapper.find('.notification-dot').isVisible()).toBe(true);
    wrapper.setData({ activeSwapCount: 0 });
    expect(wrapper.find('.notification-dot').isVisible()).toBe(false);
  });
});