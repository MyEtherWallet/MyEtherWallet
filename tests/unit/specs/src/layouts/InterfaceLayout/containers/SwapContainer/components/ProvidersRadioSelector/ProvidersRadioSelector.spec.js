import { shallowMount } from '@vue/test-utils';
import ProvidersRadioSelector from '@/layouts/InterfaceLayout/containers/SwapContainer/components/ProvidersRadioSelector/ProvidersRadioSelector.vue';
import BigNumber from 'bignumber.js';

import { Tooling } from '@@/helpers';

function valueForRate(rate, value) {
  return new BigNumber(value)
    .times(rate)
    .toFixed(6)
    .toString(10);
}

xdescribe('ProvidersRadioSelector.vue', () => {
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
      attachToDocument: true
    });
  });

  it('should render correct loadingData data', () => {
    expect(wrapper.find('.animated-background').isVisible()).toBe(
      wrapper.vm.loadingData
    );
    wrapper.setProps({ loadingData: false });
    expect(wrapper.find('.animated-background').isVisible()).toBe(
      wrapper.vm.loadingData
    );
  });

  it('should render correct noProvidersPair data', () => {
    const noProvidersPair = {
      fromCurrency: 'BTC',
      toCurrency: 'ETH'
    };

    wrapper.setProps({ noProvidersPair });
    const radioButtonContainer = wrapper.vm.$el.querySelectorAll(
      '.radio-button-container'
    )[4];
    const errorElement = radioButtonContainer.querySelectorAll('ul li div')[2];
    expect(
      errorElement.textContent.indexOf(noProvidersPair.fromCurrency)
    ).toBeGreaterThan(-1);
    expect(
      errorElement.textContent.indexOf(noProvidersPair.toCurrency)
    ).toBeGreaterThan(-1);
  });

  it('should render correct providerData data', () => {
    const providerData = [
      {
        provider: 'kybernetwork',
        fromValue: '100',
        rate: '2',
        fromCurrency: 'BTC',
        toCurrency: 'ETH'
      },
      {
        provider: 'bity',
        fromValue: '100',
        rate: '2',
        fromCurrency: 'BTC',
        toCurrency: 'ETH'
      },
      {
        provider: 'simplex',
        fromValue: '100',
        rate: '2',
        fromCurrency: 'BTC',
        toCurrency: 'ETH'
      },
      {
        provider: 'changelly',
        fromValue: '100',
        rate: '2',
        fromCurrency: 'BTC',
        toCurrency: 'ETH'
      }
    ];
    wrapper.setProps({ providerData });

    const liElements = wrapper.vm.$el.querySelectorAll(
      '.radio-button-container ul li'
    );

    for (const [i, liElement] of liElements.entries()) {
      if (providerData[i] != undefined) {
        const rateDisplay =
          providerData[i].fromValue +
          ' ' +
          providerData[i].fromCurrency +
          ' = ' +
          valueForRate(
            Number(providerData[i].rate),
            Number(providerData[i].fromValue)
          ) +
          ' ' +
          providerData[i].toCurrency;
        expect(liElement.querySelectorAll('div')[2].textContent.trim()).toEqual(
          rateDisplay
        );
      }
    }
  });
});
