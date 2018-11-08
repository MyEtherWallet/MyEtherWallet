import { shallowMount } from '@vue/test-utils'
// import PasswordModal from '@/layouts/AccessWalletLayout/components/PasswordModal/PasswordModal.vue';
import  sinon from 'sinon' 
import {
  Tooling
} from '@@/helpers';

describe('PasswordModal.vue', () => {

  describe('PasswordModal.vue', () => {
    let localVue, i18n, wrapper, store;

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        // wrapper = shallowMount(PasswordModal, {
        //   localVue,
        //   i18n,
        //   store,
        //   attachToDocument: true
        // });
    });

    it('should render content', () => {

    });
  });

  describe('PasswordModal.vue Methods', () => {
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
        // wrapper = shallowMount(PasswordModal, {
        //   localVue,
        //   i18n,
        //   store,
        //   attachToDocument: true,
        //   mocks: {
        //     $router: mockRoute,
        //   }
        // });
    });

    it('should render content', () => {

    });
});
});
