import Vue from 'vue';
import VueX from 'vuex';
import TransactionEntry from '@/components/Transactions/TransactionEntry/TransactionEntry.vue';
import { shallowMount } from '@vue/test-utils'
import nodeList from '@/networks';
import url from 'url';
import Web3 from 'web3';
import {
  Tooling
} from '@@/helpers';

const RouterLinkStub = {
  name:'title',
  template:'<p></p>',
  props:['to']  
}

describe('TransactionEntry.vue', () => {
    let localVue, i18n, wrapper, store, getters;

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
        Vue.config.warnHandler = ()=>{};
        Vue.config.errorHandler = () => {};
        const network = nodeList['ETH'][3];
       let wallet =  {
        getChecksumAddressString: jest.fn(x=> 0),
        getAddressString: () => { return 0 }
      }
      getters = {
        notifications: () => [],
        transactions: () => [],
        network: () => {
          return network
        },
      }

      store = new VueX.Store({
        getters,
        state: {
          wallet: wallet,
          network:network
        }
      });
    });

    beforeEach(() => {
        let provider = {
          parseOrder: function(value) {
            return {}
          }
        };
        let details = {
            fromCurrency: 'ETC',
            fromValue: '1.0000000',
            fromAddress: '0xF54F78F67feCDd37e0C009aB4cCD6549A69540D4',
            toCurrency: 'ETH',
            toValue : '0.0034523',
            toAddress: '0xF54F78F67feCDd37e0C009aB4cCD6549A69540D4'
        };

        wrapper = shallowMount(TransactionEntry, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          propsData:{
            provider:provider, 
            details: details
          }
        });
    });

    it('should render correct dropdownOpen data', () => {
      wrapper.setData({timeRemaining:100});
      expect(wrapper.vm.$el.querySelector('.status-timer p').textContent.trim()).toEqual(wrapper.vm.parseTimeRemaining);
    });

    it('should render correct details props', () => {
      expect(wrapper.vm.$el.querySelector('.from-address .currency').textContent.trim()).toEqual(wrapper.vm.details.fromCurrency);
      expect(wrapper.vm.$el.querySelector('.from-address .value').textContent.trim()).toEqual(wrapper.vm.details.fromValue);
      expect(wrapper.vm.$el.querySelector('.to-address .currency').textContent.trim()).toEqual(wrapper.vm.details.toCurrency);
      expect(wrapper.vm.$el.querySelector('.to-address .value').textContent.trim()).toEqual(wrapper.vm.details.toValue);
    });

    it('should render currentStatus data', () => {
      let currentStatus = 'currentStatus';
      wrapper.setData({currentStatus})
      expect(wrapper.html().indexOf(currentStatus)).toBeGreaterThan(-1);
    })
});