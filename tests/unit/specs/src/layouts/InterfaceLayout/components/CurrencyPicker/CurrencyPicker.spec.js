import { shallowMount } from '@vue/test-utils';
import CurrencyPicker from '@/layouts/InterfaceLayout/components/CurrencyPicker/CurrencyPicker.vue';
import { Tooling } from '@@/helpers';

const currency = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'Aug', name: 'Augur' },
  { symbol: 'OMG', name: 'OhMyGod' }
];

describe('CurrencyPicker.vue', () => {
  let localVue, i18n, wrapper, store;
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(CurrencyPicker, {
      localVue,
      i18n,
      store,
      attachToDocument: true
    });
  });

  it('should render correct localCurrency data', () => {
    const currencyElements = wrapper.vm.$el.querySelectorAll(
      '.item-container div'
    );

    for (const [i, currencyElement] of currencyElements.entries()) {
      const { name } = wrapper.vm.localCurrency[i];
      expect(
        currencyElement
          .querySelectorAll('p')[0]
          .textContent.trim()
          .indexOf(name)
      ).toBeGreaterThan(-1);
      expect(
        currencyElement.querySelectorAll('p')[2].textContent.trim()
      ).toEqual(name);
    }
  });

  it('should render correct selectedCurrency data', () => {
    const pDropdownContainer = wrapper.vm.$el.querySelectorAll('.dropdown-container p');
    expect(
      wrapper.vm.$el
        .querySelectorAll('.dropdown-container p')[0]
        .textContent.trim()
        .indexOf(wrapper.vm.$data.selectedCurrency.name)
    ).toBeGreaterThan(-1);
    expect(
      wrapper.vm.$el
        .querySelectorAll('.dropdown-container p')[1]
        .textContent.trim()
        .indexOf(wrapper.vm.$data.selectedCurrency.name)
    ).toBeGreaterThan(-1);
  });

  it('should show elements according to token props', () => {
    expect(
      wrapper
        .findAll('.dropdown-container p')
        .at(0)
        .isVisible()
    ).toBe(true);
    expect(
      wrapper
        .findAll('.dropdown-container p')
        .at(1)
        .isVisible()
    ).toBe(false);
    wrapper.setProps({ token: false });
    expect(
      wrapper
        .findAll('.dropdown-container p')
        .at(0)
        .isVisible()
    ).toBe(false);
    expect(
      wrapper
        .findAll('.dropdown-container p')
        .at(1)
        .isVisible()
    ).toBe(true);
  });

  it('should render correct search data', () => {
    const search = 'search';
    wrapper.setData({ search });
    expect(
      wrapper.vm.$el.querySelector('.dropdown-search-container input').value
    ).toEqual(search);
  });

  it('should render correct currency props', () => {
    wrapper.setProps({ currency });

    const currencyElements = wrapper.vm.$el.querySelectorAll(
      '.item-container div'
    );

    for (const [i, currencyElement] of currencyElements.entries()) {
      const { name } = wrapper.vm.localCurrency[i];
      expect(
        currencyElement
          .querySelectorAll('p')[0]
          .textContent.trim()
          .indexOf(name)
      ).toBeGreaterThan(-1);
      expect(
        currencyElement.querySelectorAll('p')[2].textContent.trim()
      ).toEqual(name);
    }
  });

  it('should render correct search method', () => {
    const search = 'Bit';
    wrapper.setProps({ currency });
    const inputElement = wrapper.find('.dropdown-search-container input');
    inputElement.setValue(search);
    inputElement.trigger('change');

    const { localCurrency } = wrapper.vm;
    const { name, symbol } = currency[0];
    expect(localCurrency[0].name).toEqual(name);
    expect(localCurrency[0].symbol).toEqual(symbol);
  });

  describe('CurrencyPicker.vue Methods', () => {
    it('should change open data when open dropdown method is called', () => {
      const dropdownContainer = wrapper.find('.dropdown-container');
      dropdownContainer.trigger('click');
      expect(wrapper.vm.$data['open']).toBe(true);
      dropdownContainer.trigger('click');
      expect(wrapper.vm.$data['open']).toBe(false);
    });

    it('should render correct localCurrency data when button is triggered', () => {
      const currencyElements = wrapper.findAll('.item-container div');
      for (let i = 0; i < currencyElements.length; i++) {
        const currencyElement = currencyElements.at(i);
        const currency = wrapper.vm.localCurrency[i];
        currencyElement.trigger('click');
        const { name, symbol } = wrapper.vm.$data.selectedCurrency;
        expect(currency.name).toEqual(name);
        expect(currency.symbol).toEqual(symbol);
      }
    });
  });
});
