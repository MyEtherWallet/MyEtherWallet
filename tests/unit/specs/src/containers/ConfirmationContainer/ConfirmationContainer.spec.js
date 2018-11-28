import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import ConfirmationContainer from '@/containers/ConfirmationContainer/ConfirmationContainer.vue';

import {
  Tooling
} from '@@/helpers';


   const mockRoute = {
      $on: jest.fn()
    };

describe('ConfirmationContainer.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
      const baseSetup = Tooling.createLocalVueInstance();
      localVue = baseSetup.localVue;
      i18n = baseSetup.i18n;
      store = baseSetup.store;
  });

  beforeEach(() => {
      // wrapper = shallowMount(ConfirmationContainer, {
      //   localVue,
      //   i18n,
      //   store,
      //   attachToDocument: true,
      //   mocks: {
      //     $eventHub:  mockRoute,
      //   }
      
      // });
  });

  it('should render correct contents', () => {
    /*    const Constructor = Vue.extend(Component)
        const vm = new Constructor({
          propsData: {
            // address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
          }
        }).$mount()
        expect(vm.$el.style['background-image'])
          .toEqual('')
          */
  });

  describe('ConfirmationContainer.vue Methods', () => {});
});
