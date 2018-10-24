import Vue from 'vue';
import DropDownAddressSelector from '@/components/DropDownAddressSelector/DropDownAddressSelector.vue';
import { shallowMount } from '@vue/test-utils'

import {
  Tooling
} from '@@/helpers';

describe('DropDownAddressSelector.vue', () => {
    let localVue, i18n, wrapper, store;

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(DropDownAddressSelector, {
          localVue,
          i18n,
          store,
          attachToDocument: true
        });
    });

  it('render correct addresses', () => {
      const wrapper = shallowMount(DropDownAddressSelector);
      const dropdownOpen = wrapper.find('.dropdown-open-button');
      dropdownOpen.trigger('click');
      expect(wrapper.vm.$data.dropdownOpen).toBe(true);
      const addressElements = wrapper.vm.$el.querySelectorAll('.dropdown-list-box .listed-address');
      for(var i=0; i<addressElements.length; i++) {
        const addressElement = addressElements[i];
        expect(addressElement.textContent.trim()).toEqual(wrapper.vm.$data.addresses[i]);
      }
  });

  describe('DropDownAddressSelector.vue Methods', () => {
    it('validate address when dropdown is selected', () => {
      const wrapper = shallowMount(DropDownAddressSelector);
      const dropdownOpen = wrapper.find('.dropdown-open-button');
      dropdownOpen.trigger('click');
      expect(wrapper.vm.$data.validAddress).toBe(false)
      expect(wrapper.vm.$data.dropdownOpen).toBe(true)
      const dropdown = wrapper.find('li');
      dropdown.trigger('click');

      expect(wrapper.vm.$el.querySelector('div div input').value.trim()).toEqual('0x7545566a4339daf3fad6979208b2042f06e8c881');
      expect(wrapper.vm.$data.dropdownOpen).toBe(false)
      expect(wrapper.vm.$data.validAddress).toBe(true)
  });
  });
});

