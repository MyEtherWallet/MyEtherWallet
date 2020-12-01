import Vue from 'vue';
import VueX from 'vuex';
import { shallowMount } from '@vue/test-utils';
import SendCurrencyContainer from '@/layouts/InterfaceLayout/containers/SendCurrencyContainer/SendCurrencyContainer.vue';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle/InterfaceContainerTitle.vue';
import PopOver from '@/components/PopOver/PopOver.vue';
import CurrencyPicker from '@/layouts/InterfaceLayout/components/CurrencyPicker/CurrencyPicker.vue';
import { Tooling } from '@@/helpers';
import { state, getters } from '@@/helpers/mockStore';

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
    store = new VueX.Store({
      modules: { main: { namespaced: true, state, getters } }
    });
    Vue.config.warnHandler = () => {};
  });

  afterEach(() => setTimeout(() => process.exit(), 1000));

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

  afterEach(() => {
    wrapper.destroy();
  });

  it('should be a vue instance', () => {
    expect(wrapper.isVueInstance).toBeTruthy();
  });

  it('should set the correct data', () => {
    const data = {
      address: 'address',
      valid: true
    };

    wrapper.vm.getToAddress(data);
    expect(wrapper.vm.$data.address).toBe('address');
    expect(wrapper.vm.$data.isValidAddress).toBe(true);
  });

  xit('should render correct amount data', () => {
    expect(wrapper.vm.$el.querySelector('.amount-number input').value).toEqual(
      String(wrapper.vm.$data.value)
    );
  });

  xit('should render correct "data" data', () => {
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
    xit('should render correct selectedCurrency data', () => {
      const currencyElements = wrapper.findAll(
        '.currency-picker-container .item-container div'
      );
      for (let i = 0; i < currencyElements.length; i++) {
        const currencyElement = currencyElements.at(i);
        currencyElement.trigger('click');
        const selectedCurrency = wrapper.vm.$data.selectedCurrency;
        expect(
          currencyElement.find('p').text().trim().indexOf(selectedCurrency.name)
        ).toBeGreaterThan(-1);
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

  it('should clear the form', () => {
    wrapper.setData({
      toData: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
      toValue: '5',
      hexAddress: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
      address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
      isValidAddress: true,
      gasLimit: '3000',
      advancedExpand: true,
      selectedCurrency: {
        name: 'Bitcoin',
        symobl: 'ETH'
      }
    });
    wrapper.find('.clear-all-btn').trigger('click');
    expect(wrapper.vm.$data.toData).toEqual('');
    expect(wrapper.vm.$data.toValue).toEqual('0');
    expect(wrapper.vm.$data.hexAddress).toEqual('');
    expect(wrapper.vm.$data.address).toEqual('');
    expect(wrapper.vm.$data.gasLimit).toEqual('21000');
    expect(wrapper.vm.$data.isValidAddress).toEqual(false);
    expect(wrapper.vm.$data.advancedExpand).toEqual(false);
    expect(wrapper.vm.$data.selectedCurrency).toEqual({
      name: 'Ethereum',
      symbol: 'ETH'
    });
  });
});
