import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import CurrencyPicker from '@/layouts/InterfaceLayout/components/CurrencyPicker/CurrencyPicker.vue';

import {
  Tooling
} from '@@/helpers';

describe('CurrencyPicker.vue', () => {
    let localVue, i18n, wrapper, store;
    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(CurrencyPicker, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
        });
    });

    it('should render correct content', () => {

    });

  describe('CurrencyPicker.vue Methods', () => {

  });
});
