import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import BackButton from '@/layouts/InterfaceLayout/components/BackButton/BackButton.vue';

import {
  Tooling
} from '@@/helpers';


describe('BackButton.vue', () => {
    let localVue, i18n, wrapper, store;
    const resetView = jest.fn(()=> console.log('resetView function called'))
    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(BackButton, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          propsData: {
            resetView:resetView
          }
        });
    });

    it('should render correct content', () => {
        wrapper.find('.back-container').trigger('click')
        expect( resetView ).toHaveBeenCalled()
    });

  describe('BackButton.vue Methods', () => {

  });
});
