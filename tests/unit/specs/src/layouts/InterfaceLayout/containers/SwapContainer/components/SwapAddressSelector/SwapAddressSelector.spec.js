import { shallowMount } from '@vue/test-utils';
import SwapAddressSelector from '@/layouts/InterfaceLayout/containers/SwapContainer/components/SwapAddressSelector/SwapAddressSelector.vue';
import VueX from 'vuex';
import { state, getters } from '@@/helpers/mockStore';
import { Tooling } from '@@/helpers';

describe('SwapAddressSelector.vue', () => {
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
  });

  beforeEach(() => {
    wrapper = shallowMount(SwapAddressSelector, {
      localVue,
      i18n,
      store,
      attachToDocument: true
    });
  });

  xit('should render correct validAddress data', () => {
    expect(wrapper.find('.blockie-place-holder-image').exists()).toBe(true);
    expect(wrapper.find('.selected-address-blockie').exists()).toBe(false);
    wrapper.setData({ isValidAddress: true });
    expect(wrapper.find('.blockie-place-holder-image').exists()).toBe(false);
    expect(wrapper.find('.selected-address-blockie').exists()).toBe(true);
  });

  xit('should render correct selectedAddress data', () => {
    const selectedAddress = 'selectedAddress';
    wrapper.setData({ selectedAddress });
    expect(
      wrapper.vm.$el.querySelector('.dropdown-input-box input').value
    ).toEqual(selectedAddress);
  });

  xit('should validate address when address is changed', () => {
    let selectedAddress = '0x7545196a7339daf3fad6979208b2042f06e8c882';
    wrapper.setData({ selectedAddress });
    expect(wrapper.vm.$data.validAddress).toBe(true);
    selectedAddress = 'address';
    wrapper.setData({ selectedAddress });
    expect(wrapper.vm.$data.validAddress).toBe(false);
  });
});
