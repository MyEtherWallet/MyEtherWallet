import { shallowMount } from '@vue/test-utils';
import SwapAddressSelector from '@/layouts/InterfaceLayout/containers/SwapContainer/components/SwapAddressSelector/SwapAddressSelector.vue';

import { Tooling } from '@@/helpers';

describe('SwapAddressSelector.vue', () => {
  let localVue, i18n, wrapper, store;

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

  it('should render correct validAddress data', () => {
    expect(wrapper.find('.blockie-place-holder-image').exists()).toBe(true);
    expect(wrapper.find('.selected-address-blockie').exists()).toBe(false);
    wrapper.setData({ validAddress: true });
    expect(wrapper.find('.blockie-place-holder-image').exists()).toBe(false);
    expect(wrapper.find('.selected-address-blockie').exists()).toBe(true);
  });

  it('should render correct dropdownOpen data', () => {
    expect(wrapper.find('.fa-chevron-down').exists()).toBe(true);
    expect(wrapper.find('.fa-chevron-up').exists()).toBe(false);
    wrapper.setData({ dropdownOpen: true });
    expect(wrapper.find('.fa-chevron-down').exists()).toBe(false);
    expect(wrapper.find('.fa-chevron-up').exists()).toBe(true);
  });

  it('should render correct selectedAddress data', () => {
    const selectedAddress = 'selectedAddress';
    wrapper.setData({ selectedAddress });
    expect(
      wrapper.vm.$el.querySelector('.dropdown-input-box input').value
    ).toEqual(selectedAddress);
  });

  it('should render correct addresses data', () => {
    wrapper.setData({ dropdownOpen: true });
    const liElements = wrapper.vm.$el.querySelectorAll(
      '.dropdown-list-box ul li'
    );
    for (const [i, liElement] of liElements.entries()) {
      const address = wrapper.vm.$data.addresses[i].address;
      const currency = wrapper.vm.$data.addresses[i].currency;
      expect(
        liElement
          .querySelector('.listed-address')
          .textContent.trim()
          .indexOf(address)
      ).toBeGreaterThan(-1);
      if (liElement.querySelector('.address-note') != null) {
        expect(
          liElement.querySelector('.address-note').textContent.indexOf(currency)
        ).toBeGreaterThan(-1);
      }
    }
  });

  it('should validate address when address is changed', () => {
    let selectedAddress = '0x7545196a7339daf3fad6979208b2042f06e8c882';
    wrapper.setData({ selectedAddress });
    expect(wrapper.vm.$data.validAddress).toBe(true);
    selectedAddress = 'address';
    wrapper.setData({ selectedAddress });
    expect(wrapper.vm.$data.validAddress).toBe(false);
  });

  describe('SwapAddressSelector.vue Methods', () => {
    it('should render correct listedAddressClick method', () => {
      let dropdownOpen = true;
      wrapper.setData({ dropdownOpen: true });
      const liElements = wrapper.findAll('.dropdown-list-box ul li');

      for (let i = 0; i < liElements.length; i++) {
        liElements.at(i).trigger('click');
        dropdownOpen = !dropdownOpen;
        expect(wrapper.vm.$data.dropdownOpen).toBe(dropdownOpen);
        expect(wrapper.vm.$data.selectedAddress).toEqual(
          wrapper.vm.$data.addresses[i].address
        );
      }
    });
  });
});
