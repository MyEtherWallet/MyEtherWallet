import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import SignedTxModal from '@/layouts/InterfaceLayout/components/SignedTxModal/SignedTxModal.vue';

import {
  Tooling
} from '@@/helpers';

describe('SignedTxModal.vue', () => {
    let localVue, i18n, wrapper, store;

    const signedTx = 'signedTx'
        const rawTx = jest.fn(()=> console.log('rawTx function called'))

    const pathUpdate = jest.fn(()=> console.log('pathUpdate function called'))
    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(SignedTxModal, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          propsData: {
            signedTx:signedTx,
            rawTx:rawTx,
            pathUpdate:pathUpdate
          }
        });
    });

    it('should render correct content', () => {
       expect(wrapper.vm.$el.querySelector('.signed-tx-container code').textContent.trim()).toEqual(signedTx)

       wrapper.setData({
        showRaw: true
       });
       console.log('trigger close button')
       console.log(wrapper.vm.$el.querySelector('.close-button').textContent)
       console.log(wrapper.find('.close-button').trigger('click'))
       
        // wrapper.find('.close-button').trigger('click')
    });

  describe('SignedTxModal.vue Methods', () => {
  });
});
