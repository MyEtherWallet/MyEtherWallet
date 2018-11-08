import Vue from 'vue';
import VueX from 'vuex';
import { shallowMount } from '@vue/test-utils'
import InterfaceTokens from '@/layouts/InterfaceLayout/components/InterfaceTokens/InterfaceTokens.vue';

import {
  Tooling
} from '@@/helpers';

describe('InterfaceTokens.vue', () => {
    const customTokens = [
      { name :'ETH' , balance: 200 },
      { name :'BTH' , balance: 300 },
      { name :'ETC' , balance: 400 }
    ];

    const localTokens = [
      { name :'ETH' , balance: 200 },
      { name :'BTH' , balance: 300 },
      { name :'ETC' , balance: 400 }
    ];

    let localVue, i18n, wrapper, store;

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;

        let getters = {
          network: () => []
        }

        store = new VueX.Store({
          getters
        })

        Vue.config.warnHandler = ()=>{};
    });

    beforeEach(() => {
        wrapper = shallowMount(InterfaceTokens, {
          localVue,
          i18n,
          store
        });
    });

    it('should render correct search data', () => {
      const search = 'search'
      wrapper.setData({search});
      expect(wrapper.vm.$el.querySelector('.search-block input').value).toEqual(search);
    });

    it('should render correct customTokens data', () => {
      wrapper.setData({customTokens});

      const tableElement =  wrapper.vm.$el.querySelectorAll('.token-table-container table')[0];
      const trElements = tableElement.querySelectorAll('tr');
      for ( var i =0 ; i<trElements.length; i++) {
        const trElement = trElements[i];
        expect(trElement.querySelectorAll('td')[0].textContent).toEqual(customTokens[i].name)
        expect(trElement.querySelectorAll('td')[1].textContent).toEqual(String(customTokens[i].balance) + " ")
      }
    });

   it('should render correct localTokens data', () => {
      wrapper.setData({localTokens});
      const tableElement =  wrapper.vm.$el.querySelectorAll('.token-table-container table')[1];
      const trElements = tableElement.querySelectorAll('tr');
      for ( var i =0 ; i<trElements.length; i++) {
        const trElement = trElements[i];
        expect(trElement.querySelectorAll('td')[0].textContent).toEqual(localTokens[i].name)
        expect(trElement.querySelectorAll('td')[1].textContent).toEqual(String(localTokens[i].balance) )
      }
    });

    it('should render correct receivedTokens data', () => {
        expect(wrapper.findAll('.spinner-container').at(0).isVisible()).toBe(false);
        expect(wrapper.findAll('.spinner-container').at(1).isVisible()).toBe(true);
        wrapper.setData({receivedTokens: true});
        expect(wrapper.findAll('.spinner-container').at(0).isVisible()).toBe(true);
        expect(wrapper.findAll('.spinner-container').at(1).isVisible()).toBe(false);
        wrapper.setData({search: 'search'});
        expect(wrapper.findAll('.spinner-container').at(0).isVisible()).toBe(false);
    });

  describe('InterfaceTokens.vue Methods', () => {
  });
});
