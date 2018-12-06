import Vue from 'vue';
import SwapAddressSelector
  from '@/layouts/InterfaceLayout/containers/SwapContainer/components/SwapAddressSelector/SwapAddressSelector.vue';
import { shallowMount } from '@vue/test-utils';

import {
  Tooling
} from '@@/helpers';

describe('SwapAddressSelector.vue', () => {
  let localVue, i18n, wrapper, store, stubAddresses;

  stubAddresses = [{
    address: '0x7545196a7339daf3fad6979208b2042f06e8c882',
    currency: 'ETH'
  },
    {
      address: '0x7545193a4339daf3fad6979208b2042f06e8c883',
      currency: 'ETH'
    },
    {
      address: '0x7515196a4339daf3fad6979208b2042f06e8c884',
      currency: 'ETH'
    }];
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(SwapAddressSelector, {
      localVue,
      i18n,
      store,
      attachToDocument: true
    });
  });

  xit('[FAILING] render correct addresses', () => {
    const wrapper = shallowMount(SwapAddressSelector);
    wrapper.setData({ addresses: stubAddresses });
    const dropdownOpen = wrapper.find('.dropdown-open-button');
    dropdownOpen.trigger('click');
    expect(wrapper.vm.$data.dropdownOpen).toBe(true);
    const addressElements = wrapper.vm.$el.querySelectorAll('.dropdown-list-box .listed-address');
    for (var i = 0; i < addressElements.length; i++) {
      const addressElement = addressElements[i];
      expect(addressElement.textContent.trim()).toEqual(wrapper.vm.$data.addresses[i]);
    }
  });

  describe('DropDownAddressSelector.vue Methods', () => {
    xit('[FAILING] validate address when dropdown is selected', () => {
      const wrapper = shallowMount(SwapAddressSelector);
      wrapper.setData({ addresses: stubAddresses });
      const dropdownOpen = wrapper.find('.dropdown-open-button');
      dropdownOpen.trigger('click');
      expect(wrapper.vm.$data.validAddress).toBe(false);
      expect(wrapper.vm.$data.dropdownOpen).toBe(true);
      const dropdown = wrapper.find('li');
      dropdown.trigger('click');

      expect(wrapper.vm.$el.querySelector('div div input').value.trim()).toEqual('1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9');
      expect(wrapper.vm.$data.dropdownOpen).toBe(false);
      expect(wrapper.vm.$data.validAddress).toBe(true);
    });
  });
});

