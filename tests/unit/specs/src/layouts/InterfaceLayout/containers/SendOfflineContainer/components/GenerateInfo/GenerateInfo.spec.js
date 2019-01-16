import Vue from 'vue';
import Vuex from 'vuex';
import { shallowMount } from '@vue/test-utils'
import GenerateInfo from '@/layouts/InterfaceLayout/containers/SendOfflineContainer/components/GenerateInfo/GenerateInfo.vue';
import TxSpeedInput from '@/layouts/InterfaceLayout/containers/SendOfflineContainer/components/TxSpeedInput/TxSpeedInput.vue';
import PopOver from '@/components/PopOver/PopOver.vue';
import nodeList from '@/networks';
import url from 'url';
import Web3 from 'web3';
import {
  Tooling
} from '@@/helpers';

describe('GenerateInfo.vue', () => {
  let localVue, i18n, wrapper, store;

  const gasLimit = 1000;
  const nonce = 1;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => { }
    Vue.config.errorHandler = () => { }
  });

  beforeEach(() => {

    const wallet = {
      getChecksumAddressString: jest.fn(x => 0),
      getAddressString: function () {
        return '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D';
      }
    };

     const network = nodeList['ETH'][3];
    const hostUrl = url.parse(network.url);

    const newWeb3 = new Web3(
      `${hostUrl.protocol}//${hostUrl.hostname}:${network.port}${
      hostUrl.pathname
      }`
    );

    let getters = {
      wallet: () => {
        return wallet;
      },
      gasPrice: () => { },
      web3: () => {
        return newWeb3
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
        'popover': PopOver
      },
      propsData: { gasLimit, nonce }
    });

  });

  it('should render correct content', () => {
    var inputElements = wrapper.vm.$el.querySelectorAll('.gas-amount input');
    expect(inputElements[2].value).toEqual(String(nonce));
  });

  describe('GenerateInfo.vue Methods', () => {
    it('should generate Info when button click', () => {
      wrapper.find('.submit-button-container div.submit-button').trigger('click');

      console.log(wrapper.vm.$data.moreInfoGenerated)
      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.$data.moreInfoGenerated).toBe(true);  
      })
      
      
    });

    it('should render correct generateTx method', () => {
      wrapper.vm.generateTx();
      expect(wrapper.emitted().pathUpdate).toBeTruthy();
    });

    it('should emit locNonce update when input changed', () => {
      var inputElement = wrapper.findAll('.gas-amount input').at(2);
      var inputText = 11;
      inputElement.setValue(inputText);
      inputElement.trigger('change');
      expect(wrapper.emitted().nonceUpdate).toBeTruthy();
    })

    it('should delete FromAddress when button clicked', () => {
      var inputElement = wrapper.findAll('.gas-amount input').at(0);
      var inputText = 11;
      inputElement.setValue(inputText);
      inputElement.trigger('change');
      expect(wrapper.vm.$el.querySelectorAll('.gas-amount input')[0].value).toEqual(String(inputText));
      wrapper.findAll('.prevent-user-select').at(0).trigger('click');
      expect(wrapper.vm.$el.querySelectorAll('.gas-amount input')[0].value).toEqual('');
    })
  });
});