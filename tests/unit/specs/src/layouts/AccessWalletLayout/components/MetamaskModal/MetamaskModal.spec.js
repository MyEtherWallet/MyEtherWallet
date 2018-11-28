import Vue from 'vue';
import Vuex from 'vuex';
import { shallowMount } from '@vue/test-utils'
import MetamaskModal from '@/layouts/AccessWalletLayout/components/MetamaskModal/MetamaskModal.vue';
import languages from '@/translations';
import {
  Tooling
} from '@@/helpers';

import nodeList from '@/networks';
import url from 'url';
import Web3 from 'web3';
import store from 'store';


const RouterLinkStub = {
  name:'router-link',
  template:'<div class="routerlink"><slot></slot></div>',
  props:['to']  
}

describe('MetamaskModal.vue', () => {
  let localVue, i18n, wrapper, store, getters, newWeb3;

  beforeAll(() => {
      const baseSetup = Tooling.createLocalVueInstance();
      localVue = baseSetup.localVue;
      i18n = baseSetup.i18n;

      Vue.config.warnHandler = ()=>{};
      Vue.config.errorHandler = ()=>{};

        const wallet = {
              getAddressString: function(){
                return '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D';
              }
        };
        const network = nodeList['ETH'][3];
        const hostUrl = url.parse(network.url);
        
         getters = {
          network: () => {
            return network;
          },
          wallet: () => {
            return wallet;
          }
        };

        let actions = {
          setGasPrice: jest.fn()
        };
        
       newWeb3 = new Web3(
          `${hostUrl.protocol}//${hostUrl.hostname}:${network.port}${
            hostUrl.pathname
          }`
        );

        store = new Vuex.Store({
          actions,
          getters,
          state:{
            web3: newWeb3,
            network:network,
          }
        });
  });

  beforeEach(() => {
      wrapper = shallowMount(MetamaskModal, {
        localVue,
        i18n,
        store,
        attachToDocument: true,
        stubs: {'router-link':RouterLinkStub }
      });
  });

  it('should check the switch to enable accessMyWallet Button', () => {
    expect(wrapper.vm.$el.querySelectorAll('.modal-multi-icons img').length).toEqual(1);
    wrapper.setData({web3WalletExists:true});
    expect(wrapper.vm.$el.querySelectorAll('.modal-multi-icons img').length).toEqual(3);
    var checkboxInput = wrapper.find('input[type=checkbox]');
    checkboxInput.trigger('click');
    expect(wrapper.vm.$data.accessMyWalletBtnDisabled).toBe(false);
    checkboxInput.trigger('click');
    expect(wrapper.vm.$data.accessMyWalletBtnDisabled).toBe(true);
  });

  it('should render correct refreshPage data', () => {
    expect(wrapper.findAll('.close-button').at(0).isVisible()).toBe(true);
    wrapper.find('a.close-button').trigger('click');
    expect(wrapper.vm.$data.refreshPage).toBe(true);
    expect(wrapper.findAll('.close-button').at(0).isVisible()).toBe(false);
  });

  it('should render correct unlockWeb3Wallet data', () => {
      wrapper.setData({web3WalletExists:true});
      expect(wrapper.findAll('.content-container h4').at(0).isVisible()).toEqual(true);
      expect(wrapper.findAll('.content-container h4').at(1).isVisible()).toEqual(false);
      wrapper.setData({unlockWeb3Wallet:true});
      expect(wrapper.findAll('.content-container h4').at(0).isVisible()).toEqual(false);
      expect(wrapper.findAll('.content-container h4').at(1).isVisible()).toEqual(true);
  });

  describe('MetamaskModal.vue Methods', () => {

    it('should render correct getWeb3Wallet methods' , () => {
        window.web3 = newWeb3;
        wrapper.vm.getWeb3Wallet();
    })
  });
});
