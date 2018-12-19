import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import ProvidersRadioSelector from '@/layouts/InterfaceLayout/containers/SwapContainer/components/ProvidersRadioSelector/ProvidersRadioSelector.vue';


import {
  Tooling
} from '@@/helpers';

describe('ProvidersRadioSelector.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(ProvidersRadioSelector, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
    });
  });

  it('should render correct loadingData data', () => {
    expect(wrapper.find('.animated-background').isVisible()).toBe(wrapper.vm.loadingData);
    wrapper.setProps({ loadingData: false });
    expect(wrapper.find('.animated-background').isVisible()).toBe(wrapper.vm.loadingData);
  });

  it('should render correct noProvidersPair data', () => {
    let noProvidersPair = {
      fromCurrency: 'BTC',
      toCurrency: 'ETH'
    };

    wrapper.setProps({ noProvidersPair });


    const radioButtonContainer = wrapper.vm.$el.querySelectorAll('.radio-button-container')[2];
    const errorElement = radioButtonContainer.querySelectorAll('ul li div')[2];


    let msg = 'No provider found for ' + noProvidersPair.fromCurrency + ' to ' + noProvidersPair.toCurrency;
    expect(errorElement.textContent.trim()).toEqual(msg);
  });

  it('should render correct providerData data', () => {
    let providerData = [
      { provider: 'kybernetwork', fromValue: '100', rate: '2', fromCurrency: 'BTC', toCurrency: 'ETH' },
      { provider: 'bity', fromValue: '100', rate: '2', fromCurrency: 'BTC', toCurrency: 'ETH' },
      { provider: 'simplex', fromValue: '100', rate: '2', fromCurrency: 'BTC', toCurrency: 'ETH' },
      { provider: 'changelly', fromValue: '100', rate: '2', fromCurrency: 'BTC', toCurrency: 'ETH' }];
    wrapper.setProps({ providerData });

    const liElements = wrapper.vm.$el.querySelectorAll('.radio-button-container ul li');
    for (var i = 0; i < liElements.length; i++) {
      var liElement = liElements[i];

      if (providerData[i] != undefined) {
        let rateDisplay = providerData[i].fromValue + " " + providerData[i].fromCurrency + " = "
          + Number(providerData[i].fromValue) * Number(providerData[i].rate) + " " + providerData[i].toCurrency
        expect(liElement.querySelectorAll('div')[2].textContent.trim()).toEqual(rateDisplay);
      }
    }
  });
});
