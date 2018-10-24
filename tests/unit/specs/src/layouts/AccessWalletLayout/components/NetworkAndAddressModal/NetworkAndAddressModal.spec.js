import { shallowMount } from '@vue/test-utils'
import NetworkAndAddressModal from '@/layouts/AccessWalletLayout/components/NetworkAndAddressModal/NetworkAndAddressModal.vue';
import  sinon from 'sinon' 
import {
  Tooling
} from '@@/helpers';

describe('NetworkAndAddressModal.vue', () => {

  describe('NetworkAndAddressModal.vue', () => {
    let localVue, i18n, wrapper, store;

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(NetworkAndAddressModal, {
          localVue,
          i18n,
          store,
          attachToDocument: true
        });
    });

    it('should reset the privateKey via input element', () => {

    });
  });

  describe('NetworkAndAddressModal.vue Methods', () => {
    let localVue, i18n, wrapper, store, spy;
    spy = sinon.stub()
    const mockRoute = {
      push: spy
    };

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(NetworkAndAddressModal, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          mocks: {
            $router: mockRoute,
          }
        });
    });

    it('should reset the privateKey via input element', () => {
      expect(wrapper.vm.$data.accessMyWalletBtnDisabled).toBe(true)
      const checkboxElement = wrapper.find('.checkbox-container input');
      checkboxElement.trigger('click')
      expect(wrapper.vm.$data.accessMyWalletBtnDisabled).toBe(false)
    });

});
});
