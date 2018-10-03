import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import InterfaceBalanceModal from '@/layouts/InterfaceLayout/components/InterfaceBalanceModal/InterfaceBalanceModal.vue';

import {
  Tooling
} from '@@/helpers';


describe('InterfaceBalanceModal.vue', () => {
    let localVue, i18n, wrapper, store;
    const balance = '100';
    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(InterfaceBalanceModal, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          propsData: {
            balance:balance
          }
        });
    });

    it('should render correct content', () => {        
        expect( wrapper.vm.$el.querySelector('.total-balance-amount span').textContent.trim() ).toEqual(balance)
        const valuesElements = wrapper.vm.$el.querySelectorAll('.equivalent-values')
        for(var i =0 ; i<valuesElements.length; i++) {
          const valuesElement = valuesElements[i];
          expect(valuesElement.querySelector('p').textContent.trim()).toEqual(wrapper.vm.$data.equivalentValues[i].name)
          expect(valuesElement.querySelector('p.ev-value').textContent.trim()).toEqual(wrapper.vm.$data.equivalentValues[i].value)
        }
    });

  describe('InterfaceBalanceModal.vue Methods', () => {

  });
});
