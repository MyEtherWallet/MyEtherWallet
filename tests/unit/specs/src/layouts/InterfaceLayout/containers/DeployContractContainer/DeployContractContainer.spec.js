import Vue from 'vue';
import Vuex from 'vuex';
import { shallowMount } from '@vue/test-utils'
import DeployContractContainer from '@/layouts/InterfaceLayout/containers/DeployContractContainer/DeployContractContainer.vue';
import BackButton from '@/layouts/InterfaceLayout/components/BackButton/BackButton.vue';
import PopOver from '@/components/PopOver/PopOver.vue';
import nodeList from '@/networks';
import url from 'url';
import Web3 from 'web3';
import store from 'store';

import {
  Tooling
} from '@@/helpers';


describe('DeployContractContainer.vue', () => {
    let localVue, i18n, wrapper, store;
    const resetView = jest.fn()
    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
        Vue.config.warnHandler = ()=>{};
        Vue.config.errorHandler = ()=>{};

        let actions = {
          setGasPrice: jest.fn()
        };

         const network = nodeList['ETH'][3];
        const hostUrl = url.parse(network.url);
        
        const newWeb3 = new Web3(
          `${hostUrl.protocol}//${hostUrl.hostname}:${network.port}${
            hostUrl.pathname
          }`
        );

        store = new Vuex.Store({
          actions,
          state:{
            web3: newWeb3,
            network:network
          }
        });
    });

    beforeEach(() => {
        wrapper = shallowMount(DeployContractContainer, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          stubs: {
            'back-button':BackButton,
            'popover':PopOver
          },
          propsData: {
            resetView:resetView,
          }
        });
    });

    it('should render correct bytecode', () => {
      const bytecode = 'bytecode';
      wrapper.setData({bytecode});
      expect(wrapper.vm.$el.querySelectorAll('textarea')[0].value).toEqual(wrapper.vm.$data.bytecode)
    });

    it('should render correct abi', () => {
      const abi = 'abi';
      wrapper.setData({abi});
      expect(wrapper.vm.$el.querySelectorAll('textarea')[1].value).toEqual(wrapper.vm.$data.abi);
    });

    it('should render correct contractName', () => {
      const contractName = 'contractName';
      wrapper.setData({contractName});
      expect(wrapper.vm.$el.querySelectorAll('.domain-name input')[0].value).toEqual(contractName);
    });

    it('should render correct contractName placeholder', () => {
      expect(wrapper.vm.$el.querySelectorAll('.domain-name input')[0].placeholder).toEqual(wrapper.vm.$data.contractNamePlaceholder);
    });

    it('should render correct transactionFee', () => {
      expect(wrapper.vm.$el.querySelectorAll('.send-form2 .title-container .title p')[1].textContent.indexOf(wrapper.vm.$data.transactionFee)).toBeGreaterThan(-1)
    });
    
    it('should render correct gas limit', () => {
      expect(wrapper.vm.$el.querySelector('.gas-amount input').value).toEqual(String(wrapper.vm.$data.gasLimit));
    });

    it('should render correct validAbi', () => {
      expect(wrapper.vm.$el.querySelector('i.good-button').className.indexOf('not-good')).toBeGreaterThan(-1)
    });

    describe('DeployContractContainer.vue Methods', () => {
        it('should changeGas when click button', () => {
          const btnElements = wrapper.findAll('.small-circle-button-green-border');
          btnElements.at(0).trigger('click');
          expect(wrapper.vm.$data.gasAmount).toEqual(5);
          btnElements.at(1).trigger('click');
          expect(wrapper.vm.$data.gasAmount).toEqual(45);
          btnElements.at(2).trigger('click');
          expect(wrapper.vm.$data.gasAmount).toEqual(75);
        });

       it('should Open confirmationModal when click button', () => {
          window.pageXOffset = 100;
          window.pageYOffset = 100;
          wrapper.find('.submit-button').trigger('click')
          expect(window.pageXOffset).toBe(0);
          expect(window.pageYOffset).toBe(0);
       });

        it('should delete Input when click button', () => {
          const bytecode = 'bytecode';
          wrapper.setData({bytecode});
          console.log(wrapper.vm.$el.querySelectorAll('textarea')[0].value)
          wrapper.find('.copy-buttons span').trigger('click')
          // console.log(wrapper.vm.$data.bytecode)
        });
    });
});
