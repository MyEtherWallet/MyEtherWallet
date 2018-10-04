import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import InterfaceNetwork from '@/layouts/InterfaceLayout/components/InterfaceNetwork/InterfaceNetwork.vue';

import {
  Tooling
} from '@@/helpers';

describe('InterfaceNetwork.vue', () => {
    let localVue, i18n, wrapper, store;

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        // wrapper = shallowMount(InterfaceNetwork, {
        //   localVue,
        //   i18n
        // });
    });

    it('should render correct content', () => {
    });

  describe('InterfaceNetwork.vue Methods', () => {
  });
});
