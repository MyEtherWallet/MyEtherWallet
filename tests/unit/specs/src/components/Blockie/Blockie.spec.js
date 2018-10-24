import Vue from 'vue';
import Blockie from '@/components/Blockie';
import { shallowMount } from '@vue/test-utils';

import {
  Tooling
} from '@@/helpers';


describe('Blockie.vue', () => {
    let localVue, i18n, wrapper, store;
    const address = '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D';

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(Blockie, {
            localVue,
            i18n,
            store,
            attachToDocument: true,
            propsData: {
             address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
            }  
        });
    });

  it('should render correct contents', () => {

  });
});
