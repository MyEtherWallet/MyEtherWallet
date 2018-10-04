import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import ByJsonFileContainer from '@/containers/ByJsonFileContainer/ByJsonFileContainer.vue';
import {
  Tooling
} from '@@/helpers';

xdescribe('ByJsonFileContainer.vue', () => {
    let localVue, i18n, wrapper, store;
    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(ByJsonFileContainer, {
          localVue,
          i18n,
          store,
          attachToDocument: true
        });
    });

  it('should render correct contents', () => {

  });

  describe('ByJsonFileContainer.vue Methods', () => { });
});
