import Vue from 'vue';
import VueX from 'vuex';
import { shallowMount } from '@vue/test-utils';
import InteractWithContractContainer from '@/layouts/InterfaceLayout/containers/InteractWithContractContainer/InteractWithContractContainer.vue';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle/InterfaceContainerTitle.vue';
import InterfaceBottomText from '@/components/InterfaceBottomText/InterfaceBottomText.vue';
import CurrencyPicker from '@/layouts/InterfaceLayout/components/CurrencyPicker/CurrencyPicker.vue';
import PopOver from '@/components/PopOver/PopOver.vue';
import BackButton from '@/layouts/InterfaceLayout/components/BackButton/BackButton.vue';
import nodeList from '@/networks';
import url from 'url';
import Web3 from 'web3';
import sinon from 'sinon';

import { Tooling, ERC20 } from '@@/helpers';

describe('InteractWithContractContainer.vue', () => {
  let localVue, i18n, wrapper, store, getters;
  const resetView = jest.fn();

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
          getAddressString: jest.fn(x => 0)
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

  it('should render correct abi data', done => {
    const abi = 'abi';
    wrapper.setData({ abi });
    Vue.nextTick(() => {
      expect(
        wrapper.vm.$el.querySelector('.domain-name textarea').value
      ).toEqual(abi);
      done();
    });
  });

  it('should render correct address data', done => {
    const address = 'address';
    wrapper.setData({ interact: true, address });
    Vue.nextTick(() => {
      expect(wrapper.find('.address').text()).toEqual(
        'Contract Address: ' + address
      );
      done();
    });
  });

  it('should render valid abi', done => {
    const abi = { value: 'val' };
    wrapper.setData({ abi: JSON.stringify(abi) });
    Vue.nextTick(() => {
      expect(wrapper.vm.$data.validAbi).toBe(true);
      done();
    });
    wrapper.setData({ abi });
    Vue.nextTick(() => {
      expect(wrapper.vm.$data.validAbi).toBe(false);
      done();
    });
  });

  it('should render valid address', done => {
    const address = 'address';
    wrapper.setData({ address });
    Vue.nextTick(() => {
      expect(wrapper.vm.$data.validAddress).toBe(false);
      done();
    });
    wrapper.setData({ address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D' });
    Vue.nextTick(() => {
      expect(wrapper.vm.$data.validAddress).toBe(true);
      done();
    });
  });

  it('should render correct result data', () => {
    const selectedMethod = {
      constant: false,
      inputs: []
    };
    wrapper.setData({ selectedMethod });
  });

  it('should render correct interact data', done => {
    wrapper.setData({ interact: true });
    Vue.nextTick(() => {
      expect(wrapper.find('.interact-buttons').exists()).toBe(true);
      done();
    });
  });

  it('should render correct value data', done => {
    const value = 'value';
    wrapper.setData({ interact: true });
    wrapper.setData({ value });
    Vue.nextTick(() => {
      expect(
        wrapper.vm.$el.querySelector('.send-form .result-container input').value
      ).toEqual(value);
      done();
    });
  });

  it('should render correct resType data', done => {
    wrapper.setData({ result: 'resType' });
    Vue.nextTick(() => {
      expect(wrapper.vm.$data.resType).toEqual('string');
    });
    wrapper.setData({ result: 1212 });
    Vue.nextTick(() => {
      expect(wrapper.vm.$data.resType).toEqual('number');
      done();
    });
  });

  it('should render correct loading data', done => {
    const selectedMethod = {
      constant: false,
      inputs: []
    };
    wrapper.setData({ selectedMethod: selectedMethod, interact: true });
    wrapper.setData({ loading: true });
    Vue.nextTick(() => {
      expect(wrapper.find('.fa-spinner').isVisible()).toBe(true);
      done();
    });
  });

  describe('InteractWithContractContainer.vue Methods', () => {
    it('should verify message when click button', done => {
      wrapper.setData({ writeInputs: 'ww' });
      const currencyElements = wrapper.findAll(
        '.functions .item-container div'
      );
      for (var i = 0; i < currencyElements.length; i++) {
        const currencyElement = currencyElements.at(i);
        currencyElement.trigger('click');
      }
      Vue.nextTick(() => {
        expect(wrapper.vm.$data.inputsFilled).toBe(true);
        done();
      });
    });

    it('should verify message when click button', () => {
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

      wrapper.setData({ interact: true });
      const currencyElements = wrapper.findAll(
        '.functions .item-container div'
      );
      for (var i = 0; i < currencyElements.length; i++) {
        const currencyElement = currencyElements.at(i);
        currencyElement.trigger('click');
      }
    });

    xit('[FAILING MAX STACK] should switch view when submit button clicked', () => {
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
      wrapper.find('.interact-buttons .submit-button').trigger('click');
    });

    it('should delete input when button clicked', done => {
      const abi = 'abi';
      wrapper.setData({ abi });
      Vue.nextTick(() => {
        expect(
          wrapper.vm.$el.querySelector('.domain-name textarea').value
        ).toEqual(abi);
        wrapper.find('.copy-buttons span').trigger('click');
      });
      Vue.nextTick(() => {
        expect(
          wrapper.vm.$el.querySelector('.domain-name textarea').value
        ).toEqual('');
        done();
      });

      // wrapper.findAll('.copy-buttons span').at(1).trigger('click');
    });
  });
});
