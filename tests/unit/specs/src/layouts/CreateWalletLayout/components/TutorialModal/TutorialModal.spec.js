import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import TutorialModal from '@/layouts/CreateWalletLayout/components/TutorialModal/TutorialModal.vue';

import {
  Tooling
} from '@@/helpers';

const RouterLinkStub = {
  name:'router-link',
  template:'<div><slot></slot></div>',
  props:['to']  
}

describe('TutorialModal.vue', () => {
    let localVue, i18n, wrapper, store;
    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(TutorialModal, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          stubs: {'router-link':RouterLinkStub }
        });
    });

    it('should call skip function when trigger click skip', () => {
        const skip = jest.fn(()=> console.log('skip function called'))
        wrapper.setProps({skip:skip})
        const spanElement = wrapper.find('.content span');
        spanElement.trigger('click')
        expect( skip ).toHaveBeenCalled()
    });
});
