import Vue from 'vue';
import Vuex from 'vuex';
import { shallowMount } from '@vue/test-utils';
import GenerateInfo from '@/layouts/InterfaceLayout/containers/SendOfflineContainer/components/GenerateInfo';
import TxSpeedInput from '@/layouts/InterfaceLayout/containers/SendOfflineContainer/components/TxSpeedInput';
import PopOver from '@/components/PopOver/PopOver.vue';
import nodeList from '@/networks';
import Web3 from 'web3';

import { Tooling } from '@@/helpers';
import url from 'url';

describe('GenerateInfo.vue', () => {
  let localVue, i18n, wrapper, store;

  const gasLimit = 1000;
  const nonce = 1;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => {};
    Vue.config.errorHandler = () => {};
  });

  beforeEach(() => {
    const network = nodeList['ETH'][3];
    const hostUrl = url.parse(network.url);
    const newWeb3 = new Web3(
      `${hostUrl.protocol}//${hostUrl.hostname}:${network.port}${
        hostUrl.pathname
      }`
    );

    const wallet = {
      getChecksumAddressString: jest.fn(x => 0),
      getAddressString: function() {
        return '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D';
      }
    };

    const getters = {
      wallet: () => {
        return wallet;
      },
      gasPrice: () => {},
      web3: () => {
        return newWeb3;
      }
    };

    store = new Vuex.Store({
      getters
    });

    wrapper = shallowMount(GenerateInfo, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'tx-speed-input': TxSpeedInput,
        popover: PopOver
      },
      propsData: { gasLimit, nonce }
    });
  });

  xit('[Failing 1-16-19] should render correct content', () => {
    expect(wrapper.vm.$data.isValid).toBe(false);
    const inputElements = wrapper.vm.$el.querySelectorAll('.gas-amount input');
    expect(inputElements[2].value).toEqual(String(nonce));
    expect(inputElements[3].value).toEqual(String(gasLimit));
  });

  describe('GenerateInfo.vue Methods', () => {
    xit('[Failing 1-16-19] should generate Info when button click', () => {
      wrapper
        .find('.submit-button-container div.submit-button')
        .trigger('click');
      expect(wrapper.vm.$data.moreInfoGenerated).toBe(true);
    });

    xit('[Failing 1-16-19] should generate tx when button click', () => {
      wrapper
        .find('.submit-button-container div.submit-button')
        .trigger('click');
      wrapper
        .find('.submit-button-container div.submit-button')
        .trigger('click');
      expect(wrapper.emitted().pathUpdate).toBeTruthy();
    });

    it('should emit locNonce update when input changed', () => {
      const inputElement = wrapper.findAll('.gas-amount input').at(2);
      const inputText = 11;
      inputElement.setValue(inputText);
      inputElement.trigger('change');
      expect(wrapper.emitted().nonceUpdate).toBeTruthy();
    });

    xit('[Failing 1-16-19] should emit gasLimitUpdate update when input changed', () => {
      const inputElement = wrapper.findAll('.gas-amount input').at(3);
      const inputText = 11;
      inputElement.setValue(inputText);
      inputElement.trigger('change');
      expect(wrapper.emitted().gasLimitUpdate).toBeTruthy();
    });

    it('should delete FromAddress when button clicked', () => {
      const inputElement = wrapper.findAll('.gas-amount input').at(0);
      const inputText = 11;
      inputElement.setValue(inputText);
      inputElement.trigger('change');
      expect(
        wrapper.vm.$el.querySelectorAll('.gas-amount input')[0].value
      ).toEqual(String(inputText));
      wrapper
        .findAll('.prevent-user-select')
        .at(0)
        .trigger('click');
      expect(
        wrapper.vm.$el.querySelectorAll('.gas-amount input')[0].value
      ).toEqual('');
    });
  });
});
