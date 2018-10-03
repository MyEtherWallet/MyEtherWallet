import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import DappButtons from '@/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue';

import {
  Tooling
} from '@@/helpers';

describe('DappButtons.vue', () => {
    let localVue, i18n, wrapper, store;
    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(DappButtons, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
        });
    });

    it('should render correct content', () => {

    });

  describe('DappButtons.vue Methods', () => {

  });
});
