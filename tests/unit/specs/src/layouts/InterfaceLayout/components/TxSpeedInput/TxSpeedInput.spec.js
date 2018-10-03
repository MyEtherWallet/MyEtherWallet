import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import TxSpeedInput from '@/layouts/InterfaceLayout/components/TxSpeedInput/TxSpeedInput.vue';

import {
  Tooling
} from '@@/helpers';

describe('TxSpeedInput.vue', () => {
    let localVue, i18n, wrapper, store;

 
    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(TxSpeedInput, {
          localVue,
          i18n,
          store,
          attachToDocument: true
        });
    });

    it('should render correct content', () => {
    
    });

  describe('TxSpeedInput.vue Methods', () => {
  });
});
