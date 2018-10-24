import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import SignedTxModal from '@/layouts/InterfaceLayout/components/SignedTxModal/SignedTxModal.vue';
import sinon from 'sinon'
import {
  Tooling
} from '@@/helpers';

describe('SignedTxModal.vue', () => {
    let localVue, i18n, wrapper, store;

    const signedTx = 'signedTx'
    const rawTx = {data:'rawTx'}
    const spy = sinon.stub()    

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
            pathUpdate:spy()
          }
        });

        wrapper.setData({
          showRaw: true
        });
    });

    it('should render correct content', () => {
        expect(wrapper.vm.$el.querySelector('.signed-tx-container code').textContent.trim()).toEqual(signedTx)
        const closeButton = wrapper.find('.close-button')
        closeButton.trigger('click')
        expect(spy.calledOnce).toBe(true)
    });

  describe('SignedTxModal.vue Methods', () => {
  });
});
