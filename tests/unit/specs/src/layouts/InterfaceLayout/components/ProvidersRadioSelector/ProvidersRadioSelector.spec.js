import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import ProvidersRadioSelector from '@/layouts/InterfaceLayout/components/ProvidersRadioSelector/ProvidersRadioSelector.vue';

import {
  Tooling
} from '@@/helpers';

describe('ProvidersRadioSelector.vue', () => {
    let localVue, i18n, wrapper, store;
    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(ProvidersRadioSelector, {
          localVue,
          i18n,
          store,
          attachToDocument: true
        });
    });

    it('should render correct content', () => {
        const containerElements = wrapper.vm.$el.querySelectorAll('.radio-button-container')
        for(var i =0 ; i<containerElements.length; i++) {
          const containerElement = containerElements[i];
          expect(containerElement.querySelector('input').id).toEqual(wrapper.vm.$data.providers[i].name)
          expect(containerElement.querySelectorAll('div')[2].textContent.trim()).toEqual(wrapper.vm.$data.providers[i].swapValue1)
          expect(containerElement.querySelectorAll('div')[3].textContent.trim()).toEqual(wrapper.vm.$data.providers[i].swapValue2)
        }
    });

  describe('ProvidersRadioSelector.vue Methods', () => {
  });
});
