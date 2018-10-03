import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import InterfaceTokensModal from '@/layouts/InterfaceLayout/components/InterfaceTokensModal/InterfaceTokensModal.vue';

import {
  Tooling
} from '@@/helpers';

describe('InterfaceTokensModal.vue', () => {
    let localVue, i18n, wrapper, store;

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(InterfaceTokensModal, {
          localVue,
          i18n,
          store,
          attachToDocument: true
        });
    });

    it('should render correct content', () => {
    });

  describe('InterfaceTokensModal.vue Methods', () => {
  });
});
