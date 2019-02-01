import Vue from 'vue';
import VueX from 'vuex';
import { shallowMount } from '@vue/test-utils';
import InteractWithContractContainer from '@/layouts/InterfaceLayout/containers/InteractWithContractContainer/InteractWithContractContainer.vue';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle/InterfaceContainerTitle.vue';
import InterfaceBottomText from '@/components/InterfaceBottomText/InterfaceBottomText.vue';
import CurrencyPicker from '@/layouts/InterfaceLayout/components/CurrencyPicker/CurrencyPicker.vue';
import PopOver from '@/components/PopOver/PopOver.vue';
import nodeList from '@/networks';
import url from 'url';
import Web3 from 'web3';

import { Tooling } from '@@/helpers';

describe('InteractWithContractContainer.vue', () => {
  let localVue, i18n, wrapper, store, getters;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;

    const network = nodeList['ETH'][3];
    const hostUrl = url.parse(network.url);

    const newWeb3 = new Web3(
      `${hostUrl.protocol}//${hostUrl.hostname}:${network.port}${
        hostUrl.pathname
      }`
    );

    getters = {
      network: () => {
        return network;
      },
      web3: () => {
        return newWeb3;
      }
    };

    store = new VueX.Store({
      getters,
      state: {
        gasPrice: '',
        web3: newWeb3,
        Networks: nodeList,
        wallet: {
          getAddressString: jest.fn(() => 0)
        }
      }
    });

    Vue.config.errorHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(InteractWithContractContainer, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      sync: false,
      stubs: {
        'interface-bottom-text': InterfaceBottomText,
        'interface-container-title': InterfaceContainerTitle,
        'currency-picker': CurrencyPicker,
        popover: PopOver
      }
    });
  });

  it('should render correct abi data', () => {
    const abi = 'abi';
    wrapper.setData({ abi });
    wrapper.vm.$nextTick(() => {
      expect(
        wrapper.vm.$el.querySelector('.domain-name textarea').value
      ).toEqual(abi);
    });
  });

  it('should render correct address data', () => {
    Vue.nextTick(() => {
      const address = 'address';
      wrapper.setData({ interact: true, address });
      wrapper.vm.$nextTick(() => {
        expect(wrapper.find('.address').text()).toEqual(
          'Contract Address: ' + address
        );
      });
    });
  });

  it('should render isValidAbi abi', () => {
    const abi = { value: 'val' };
    wrapper.setData({ abi: JSON.stringify(abi) });
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.$data.isValidAbi).toBe(true);
      wrapper.setData({ abi });
      expect(wrapper.vm.$data.isValidAbi).toBe(false);
    });
  });

  it('should render correct result data', () => {
    const selectedMethod = {
      constant: false,
      inputs: []
    };
    wrapper.setData({ selectedMethod });
  });

  it('should render correct interact data', () => {
    wrapper.setData({ interact: true });
    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('.interact-buttons').exists()).toBe(true);
    });
  });

  it('should render correct value data', () => {
    const value = 'value';
    wrapper.setData({ interact: true });
    wrapper.setData({ value: value });
    wrapper.vm.$nextTick(() => {
      expect(
        wrapper.vm.$el.querySelector('.send-form .result-container input').value
      ).toEqual(value);
    });
  });

  xit('should render correct resType data', () => {
    wrapper.setData({ result: 'resType' });
    expect(wrapper.vm.$data.resType).toEqual('string');
    wrapper.vm.$nextTick(() => {
      wrapper.setData({ result: 1212 });
      expect(wrapper.vm.$data.resType).toEqual('number');
    });
  });

  it('should render correct loading data', () => {
    const selectedMethod = {
      constant: false,
      inputs: []
    };
    wrapper.setData({ selectedMethod: selectedMethod, interact: true });
    wrapper.setData({ loading: true });
    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('.fa-spinner').isVisible()).toBe(true);
    });
  });

  describe('InteractWithContractContainer.vue Methods', () => {
    it('should verify message when click button', () => {
      wrapper.setData({ writeInputs: 'ww' });
      const currencyElements = wrapper.findAll(
        '.functions .item-container div'
      );
      for (let i = 0; i < currencyElements.length; i++) {
        const currencyElement = currencyElements.at(i);
        currencyElement.trigger('click');
      }
      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.$data.inputsFilled).toBe(true);
      });
    });

    it('should verify message when click button', () => {
      wrapper.setData({ interact: true });
      const currencyElements = wrapper.findAll(
        '.functions .item-container div'
      );
      for (let i = 0; i < currencyElements.length; i++) {
        const currencyElement = currencyElements.at(i);
        currencyElement.trigger('click');
      }
    });

    it('should switch view when submit button clicked', () => {
      const abi = [
        {
          constant: true,
          inputs: [],
          name: 'name',
          outputs: [
            {
              name: '',
              type: 'string'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        }
      ];

      wrapper.setData({ interact: true, abi: JSON.stringify(abi) });
      wrapper.vm.$nextTick(() => {
        wrapper.find('.interact-buttons .submit-button').trigger('click');
      });
    });

    it('should delete input when button clicked', () => {
      const abi = 'abi';
      wrapper.setData({ abi });
      wrapper.vm.$nextTick(() => {
        expect(
          wrapper.vm.$el.querySelector('.domain-name textarea').value
        ).toEqual(abi);
        wrapper.find('.copy-buttons span').trigger('click');
        expect(
          wrapper.vm.$el.querySelector('.domain-name textarea').value
        ).toEqual('');
      });

      // wrapper.findAll('.copy-buttons span').at(1).trigger('click');
    });
  });
});
