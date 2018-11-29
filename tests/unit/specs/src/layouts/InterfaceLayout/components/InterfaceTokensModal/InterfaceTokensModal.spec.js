import Vue from 'vue';
import Vuex from 'vuex';
import store from 'store';
import nodeList from '@/networks';
import url from 'url';
import Web3 from 'web3';
import { shallowMount } from '@vue/test-utils'
import InterfaceTokensModal from '@/layouts/InterfaceLayout/components/InterfaceTokensModal/InterfaceTokensModal.vue';
import sinon from 'sinon'
import {
  Tooling
} from '@@/helpers';

describe('InterfaceTokensModal.vue', () => {
    let localVue, i18n, wrapper, store;
    const tokenDecimal = '100';
    const tokenAddress = '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D';
    const tokenSymbol = 'tokenSymbol'
    var addToken = sinon.stub();
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

         let getters = {
          web3: () =>  {
              return newWeb3
            }
        };

        store = new Vuex.Store({
          getters
        });
    });

    beforeEach(() => {
        store.replaceState({
          web3: {
            utils: {
              isAddress: function(val){}
            }
          }
        })
        wrapper = shallowMount(InterfaceTokensModal, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          propsData: { addToken }
        });

        wrapper.setData({tokenSymbol, tokenAddress, tokenDecimal, validAddress: true})
    });

    xit('[FAILING MAX STACK] should render correct tokenAddress', () => {
      const inputElements = wrapper.vm.$el.querySelectorAll('.tokens-modal-body input')
      expect(inputElements[0].value).toEqual(tokenAddress)
    });

    xit('[FAILING MAX STACK] should render correct tokenSymbol', () => {
      const inputElements = wrapper.vm.$el.querySelectorAll('.tokens-modal-body input')
      expect(inputElements[1].value).toEqual(tokenSymbol)
    });

    xit('[FAILING MAX STACK] should render correct tokenDecimal', () => {
      const inputElements = wrapper.vm.$el.querySelectorAll('.tokens-modal-body input')
      expect(inputElements[2].value).toEqual(tokenDecimal)
    });

    describe('InterfaceTokensModal.vue Methods', () => {
      xit('[FAILING MAX STACK] should add token when button click', () => {
        wrapper.find('.save-button').trigger('click')
        expect(addToken.called).toBe(true);
      })
    });
});
