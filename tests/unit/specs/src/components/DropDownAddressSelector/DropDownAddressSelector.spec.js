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

    it('validate address when dropdown is selected', () => {
      const wrapper = shallowMount(DropDownAddressSelector);
      const dropdownOpen = wrapper.find('.dropdown-open-button');
      dropdownOpen.trigger('click');
      const dropdown = wrapper.find('li');
      dropdown.trigger('click');
      
      console.log(wrapper.vm.$el.querySelector('div div input').value.trim());  
      expect(wrapper.vm.$el.querySelector('div div input').value.trim()).toEqual('0x7545566a4339daf3fad6979208b2042f06e8c881');
  });

  describe('DropDownAddressSelector.vue Methods', () => {
  });
});

