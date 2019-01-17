import Vue from 'vue';
import VueX from 'vuex';
import { shallowMount } from '@vue/test-utils';
import SendCurrencyContainer from '@/layouts/InterfaceLayout/containers/SendCurrencyContainer/SendCurrencyContainer.vue';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle/InterfaceContainerTitle.vue';
import PopOver from '@/components/PopOver/PopOver.vue';
import CurrencyPicker from '@/layouts/InterfaceLayout/components/CurrencyPicker/CurrencyPicker.vue';
import nodeList from '@/networks';
import url from 'url';
import Web3 from 'web3';

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
    Vue.config.errorHandler = () => {};
  });

  afterAll(() => setTimeout(() => process.exit(), 1000));

  beforeEach(() => {
    const actions = {
      setGasPrice: jest.fn()
    };

    const network = nodeList['ETH'][3];
    const hostUrl = url.parse(network.url);

    const newWeb3 = new Web3(
      `${hostUrl.protocol}//${hostUrl.hostname}:${network.port}${
        hostUrl.pathname
      }`
    );

    const wallet = {
      getChecksumAddressString: jest.fn(() => 0),
      getAddressString: function() {
        return '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D';
      }
    };

    const getters = {
      network: () => {
        return network;
      },
      gasPrice: () => {},
      wallet: () => {
        return wallet;
      },
      web3: () => {
        return newWeb3;
      },
      account: () => {
        return {
          balance: {
            result: ''
          }
        };
      },
      ens: () => {}
    };

    store = new VueX.Store({
      getters,
      actions,
      state: {
        web3: newWeb3,
        network: network,
        wallet: {
          getAddressString: () => {
            return '0x72ea3508d9d817a91465abb59be10fef9857a055';
          }
        }
      }
    });

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
    })
  });

  it('should render correct amount data', () => {
    expect(wrapper.vm.$el.querySelector('.amount-number input').value).toEqual(
      String(wrapper.vm.$data.amount)
    );
  });

  it('should render correct "data" data', () => {
    wrapper.setData({ advancedExpend: true });
    expect(wrapper.vm.$el.querySelector('.user-input input').value).toEqual(
      wrapper.vm.$data.data
    );
  });

  it('should render correct gasLimit data', () => {
    wrapper.setData({ advancedExpend: true });
    expect(
      wrapper.vm.$el.querySelectorAll('.user-input input')[1].value
    ).toEqual(String(wrapper.vm.$data.gasLimit));
  });

  describe('SendCurrencyContainer.vue Methods', () => {
    it('should render correct verifyAddr method', () => {
      const address = '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D';
      wrapper.setData({ address });
      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.verifyAddr()).toBe(true);
      })
    });

    it('should render correct selectedCurrency data', () => {
      const currencyElements = wrapper.findAll(
        '.currency-picker-container .item-container div'
      );
      for (let i = 0; i < currencyElements.length; i++) {
        const currencyElement = currencyElements.at(i);
        currencyElement.trigger('click');
        const selectedCurrency = wrapper.vm.$data.selectedCurrency;
        expect(selectedCurrency.symbol + ' - ' + selectedCurrency.name).toEqual(
          currencyElement.find('p').text()
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
