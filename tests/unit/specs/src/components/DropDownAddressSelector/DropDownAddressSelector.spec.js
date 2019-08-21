import DropDownAddressSelector from '@/components/DropDownAddressSelector/DropDownAddressSelector.vue';
import { shallowMount } from '@vue/test-utils';

import { Tooling } from '@@/helpers';

function shortenAddress(address) {
  const front = address.slice(0, 15);
  const end = address.slice(-4);
  return front + '...' + end;
}

describe('DropDownAddressSelector.vue', () => {
  let localVue, i18n, store, wrapper;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    shallowMount(DropDownAddressSelector, {
      localVue,
      i18n,
      store,
      attachToDocument: true
    });
  });

  xit('render correct addresses', () => {
    const dropdownOpen = wrapper.find('.dropdown-open-button');
    dropdownOpen.trigger('click');
    expect(wrapper.vm.$data.dropdownOpen).toBe(true);
    const addressElements = wrapper.vm.$el.querySelectorAll(
      '.dropdown-list-box .listed-address'
    );
    for (const [i, addressElement] of addressElements.entries()) {
      expect(addressElement.textContent.trim()).toEqual(
        shortenAddress(wrapper.vm.$data.addresses[i])
      );
    }
  });

  describe('DropDownAddressSelector.vue Methods', () => {
    xit('validate address when dropdown is selected', () => {
      const wrapper = shallowMount(DropDownAddressSelector);
      const dropdownOpen = wrapper.find('.dropdown-open-button');
      dropdownOpen.trigger('click');
      expect(wrapper.vm.$data.validAddress).toBe(false);
      expect(wrapper.vm.$data.dropdownOpen).toBe(true);
      const dropdown = wrapper.find('li');
      dropdown.trigger('click');
      expect(
        wrapper.vm.$el.querySelector('div div input').value.trim()
      ).toEqual('0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D');
      expect(wrapper.vm.$data.dropdownOpen).toBe(false);
      expect(wrapper.vm.$data.validAddress).toBe(true);
    });
  });
});
