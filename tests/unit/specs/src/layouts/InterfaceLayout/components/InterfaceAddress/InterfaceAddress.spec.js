import Vue from 'vue';
import Vuex from 'vuex';
import { shallowMount } from '@vue/test-utils'
import InterfaceAddress from '@/layouts/InterfaceLayout/components/InterfaceAddress/InterfaceAddress.vue';

import {
  Tooling
} from '@@/helpers';


describe('InterfaceAddress.vue', () => {
  let localVue, i18n, wrapper, store;
  const address = 'InterfaceAddress address';
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;

     const wallet = {
      identifier: function () {
        return '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D';
      }
    };

    let getters = {
      wallet: () => {return wallet }
    };

    store = new Vuex.Store({
      getters
    });
  });

  beforeEach(() => {
    wrapper = shallowMount(InterfaceAddress, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: {
        address: address
      }
    });
  });

  it('should render correct address props', () => {
    expect(wrapper.vm.$el.querySelector('.information-container p.address').textContent.trim()).toEqual(address)
  });

  it('should render correct hasMultipleAddr data', () => {
    expect(wrapper.vm.$data.hasMultipleAddr).toBe(true);
  });
  
  describe('InterfaceAddress.vue Methods', () => {
  });
});
