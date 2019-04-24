import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import SendCurrencyContainer from '@/layouts/InterfaceLayout/containers/SendCurrencyContainer/SendCurrencyContainer.vue';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle/InterfaceContainerTitle.vue';
import PopOver from '@/components/PopOver/PopOver.vue';
import CurrencyPicker from '@/layouts/InterfaceLayout/components/CurrencyPicker/CurrencyPicker.vue';
import { Tooling } from '@@/helpers';

describe('SendCurrencyContainer.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    window.scrollTo = jest.fn().mockImplementation((valX, valY) => {
      window.pageXOffset = valX;
      window.pageYOffset = valY;
    });

    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => {};
  });

  afterAll(() => setTimeout(() => process.exit(), 1000));

  beforeEach(() => {
    wrapper = shallowMount(SendCurrencyContainer, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      sync: false,
      stubs: {
        'interface-container-title': InterfaceContainerTitle,
        popover: PopOver,
        'currency-picker': CurrencyPicker
      }
    });
  });

  it('should render correct isValidAddress data', () => {
    const address = '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D';
    wrapper.setData({ address });
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.$data.isValidAddress).toBe(true);
    });
  });

  it('should render correct amount data', () => {
    expect(wrapper.vm.$el.querySelector('.amount-number input').value).toEqual(
      String(wrapper.vm.$data.value)
    );
  });

  it('should render correct "data" data', () => {
    wrapper.setData({ advancedExpand: true });
    expect(wrapper.vm.$el.querySelector('.user-input input').value).toEqual(
      wrapper.vm.$data.data
    );
  });

  it('should render correct gasLimit data', () => {
    wrapper.setData({ advancedExpand: true });
    expect(
      wrapper.vm.$el.querySelectorAll('.user-input input')[1].value
    ).toEqual(String(wrapper.vm.$data.gasLimit));
  });

  describe('SendCurrencyContainer.vue Methods', () => {
    it('should render correct selectedCurrency data', () => {
      const currencyElements = wrapper.findAll(
        '.currency-picker-container .item-container div'
      );
      for (let i = 0; i < currencyElements.length; i++) {
        const currencyElement = currencyElements.at(i);
        currencyElement.trigger('click');
        const selectedCurrency = wrapper.vm.$data.selectedCurrency;

        expect(selectedCurrency.symbol + ' - ' + selectedCurrency.name).toEqual(
          currencyElement
            .find('p')
            .text()
            .trim()
        );
      }
    });

    it('should open confirm modal when button click', () => {
      window.pageXOffset = 100;
      window.pageYOffset = 100;
      wrapper.find('.submit-button-container .submit-button').trigger('click');
      expect(window.pageXOffset).toBe(0);
      expect(window.pageYOffset).toBe(0);
    });
  });
});
