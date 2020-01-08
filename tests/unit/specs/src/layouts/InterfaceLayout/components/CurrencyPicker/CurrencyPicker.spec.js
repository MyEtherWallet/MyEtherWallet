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
      attachToDocument: true,
      computed: {
        networkToken() {
          return { symbol: 'ETH', name: 'Ethereum' };
        }
      },
      propsData: {
        currency: currency
      }
    });
  });

  it('should render correct localCurrency data', () => {
    expect(wrapper.find('.item-container').isVisible()).toBe(true);
  });

  it('should render correct selectedCurrency data', () => {
    const pDropdownContainers = wrapper.findAll('.dropdown-container p');
    expect(
      pDropdownContainers
        .at(0)
        .text()
        .indexOf(wrapper.vm.$data.selectedCurrency.name)
    ).toBeGreaterThan(-1);
    expect(
      pDropdownContainers
        .at(1)
        .text()
        .indexOf(wrapper.vm.$data.selectedCurrency.name)
    ).toBeGreaterThan(-1);
  });

  it('should show elements according to token props', () => {
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
    wrapper.setProps({ token: false });
    wrapper.vm.$nextTick(() => {
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
      ).toBe(false);
    });
  });

  it('should render correct search data', () => {
    const search = 'search';
    wrapper.setData({ search: search });
    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('.dropdown-search-container input').text()).toEqual(
        search
      );
    });
  });

  xit('should render correct currency props', () => {
    const currencyElements = wrapper.findAll('.item-container div');
    const wrappers = currencyElements.wrappers;

    wrappers.forEach((currencyElement, i) => {
      console.log(wrapper.vm.localCurrency[i]);
      const name = wrapper.vm.localCurrency[i].name;
      expect(
        currencyElement
          .findAll('p')
          .at(0)
          .text()
          .indexOf(name)
      ).toBeGreaterThan(-1);
      expect(
        currencyElement
          .findAll('p')
          .at(2)
          .text()
      ).toEqual(name);
    });
  });

  it('should render correct search method', () => {
    const search = 'Bit';
    const inputElement = wrapper.find('.dropdown-search-container input');
    inputElement.setValue(search);
    inputElement.trigger('change');
    wrapper.vm.$nextTick(() => {
      const { localCurrency } = wrapper.vm;
      const { name, symbol } = currency[0];
      expect(localCurrency[0].name).toEqual(name);
      expect(localCurrency[0].symbol).toEqual(symbol);
    });
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
        wrapper.vm.$nextTick(() => {
          const { name, symbol } = wrapper.vm.$data.selectedCurrency;
          expect(currency.name).toEqual(name);
          expect(currency.symbol).toEqual(symbol);
        });
      }
    });
  });

  it('dismounts', () => {
    wrapper.destroy();
    expect(wrapper.exists()).toBe(false);
  });
});
