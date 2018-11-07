import Vue from 'vue';
// import InstallMetamaskModal from '@/layouts/AccessWalletLayout/components/InstallMetamaskModal/InstallMetamaskModal.vue';
import { shallowMount } from '@vue/test-utils'
import sinon from 'sinon'

import {
  Tooling
} from '@@/helpers';

const CloseButtonStub = {
  name:'b-btn',
  template:'<div><slot> </slot></div>'
}

xdescribe('InstallMetamaskModal.vue', () => {
    let localVue, i18n, wrapper, store;
    const spy = sinon.stub()    

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(InstallMetamaskModal, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          stubs: {
          'b-btn': CloseButtonStub
          },
          propsData: { 
            metamaskmodal: spy()
          }
        });
    });

   it('should render correct contents', () => {
    const closeButton = wrapper.find('.close-button')
    closeButton.trigger('click')
    expect(spy.calledOnce).toBe(true)

  });
  describe('InstallMetamaskModal.vue Methods', () => {});
});