import { shallowMount } from '@vue/test-utils';
import SwapCurrencyPicker from '@/layouts/InterfaceLayout/containers/SwapContainer/components/SwapCurrencyPicker/SwapCurrencyPicker.vue';

import { Tooling } from '@@/helpers';

describe('SwapCurrencyPicker.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(SwapCurrencyPicker, {
      localVue,
      i18n,
      store,
      attachToDocument: true
    });
  });

  it('should render correct search data', () => {
    const search = 'search';
    wrapper.setData({ search });
    expect(
      wrapper.vm.$el.querySelector('.dropdown-search-container input').value
    ).toEqual(search);
  });

  it('should render correct open data', () => {
    expect(
      wrapper
        .find('.dropdown-item-container')
        .classes()
        .indexOf('hide')
    ).toBeGreaterThan(-1);
    wrapper.setData({ open: true });
    expect(
      wrapper
        .find('.dropdown-container')
        .classes()
        .indexOf('open')
    ).toBeGreaterThan(-1);
  });

  it('should render correct token props', () => {
    expect(
      wrapper
        .find('.dropdown-container')
        .classes()
        .indexOf('dropdown-text-container')
    ).toBeGreaterThan(-1);
    wrapper.setProps({ token: false });
    expect(
      wrapper
        .find('.dropdown-container')
        .classes()
        .indexOf('dropdown-text-container')
    ).toBe(-1);
  });

  it('should render correct selectedCurrency data', () => {
    const dropDownContainer = wrapper.vm.$el.querySelector(
      '.dropdown-container'
    );
    // expect(dropDownContainer.querySelector('span').textContent.trim()).toEqual("- " + wrapper.vm.$data.selectedCurrency.name);
    expect(dropDownContainer.querySelectorAll('p')[1].textContent).toBe(
      wrapper.vm.$data.selectedCurrency.name
    );
  });

  it('should render correct fromSource data', () => {
    wrapper.setProps({ fromSource: false });
    expect(wrapper.vm.$data.selectedCurrency.name).toEqual('Bitcoin');
    expect(wrapper.vm.$data.selectedCurrency.symbol).toEqual('BTC');
  });

  describe('SwapCurrencyPicker.vue Methods', () => {
    it('should render correct openDropdown method', () => {
      wrapper.find('.dropdown-container').trigger('click');
      expect(wrapper.vm.$data['open']).toBe(true);
      wrapper.find('.dropdown-container').trigger('click');
      expect(wrapper.vm.$data['open']).toBe(false);
    });
  });
});
