import { shallowMount } from '@vue/test-utils';
import CurrencyPicker from '@/layouts/InterfaceLayout/components/CurrencyPicker/CurrencyPicker.vue';
import { Tooling } from '@@/helpers';
import VueX from 'vuex';
import { state, getters } from '@@/helpers/mockStore';

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
    wrapper = shallowMount(CurrencyPicker, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: {
        currency: currency,
        localCurrency: currency
      }
    });
  });

  afterEach(() => {
    wrapper.destroy();
    wrapper = null;
  });

  it('should render correct localCurrency data', () => {
    expect(wrapper.find('.item-container').isVisible()).toBe(true);
  });

  it('should render correct selectedCurrency data', () => {
    const pDropdownContainers = wrapper.vm.$el.querySelectorAll(
      '.dropdown-container p'
    );
    expect(
      pDropdownContainers[0].textContent
        .trim()
        .indexOf(wrapper.vm.$data.selectedCurrency.name)
    ).toBeGreaterThan(-1);
    expect(
      pDropdownContainers[1].textContent
        .trim()
        .indexOf(wrapper.vm.$data.selectedCurrency.name)
    ).toBeGreaterThan(-1);
  });

  it('should show elements according to token props', () => {
    expect(wrapper.findAll('.dropdown-container p').at(0).isVisible()).toBe(
      false
    );
    expect(wrapper.findAll('.dropdown-container p').at(1).isVisible()).toBe(
      true
    );
    wrapper.setProps({ token: false });
    expect(wrapper.findAll('.dropdown-container p').at(0).isVisible()).toBe(
      false
    );
    expect(wrapper.findAll('.dropdown-container p').at(1).isVisible()).toBe(
      false
    );
  });

  xit('should render correct search data', () => {
    const search = 'search';
    wrapper.setData({ search });
    expect(
      wrapper.vm.$el.querySelector('.dropdown-search-container input').value
    ).toEqual(search);
  });

  xit('should render correct currency props', () => {
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

  xit('should render correct search method', () => {
    const search = 'Bit';
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

    xit('should render correct localCurrency data when button is triggered', () => {
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
