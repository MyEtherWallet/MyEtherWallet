import Vuex from 'vuex';
import { mount } from '@vue/test-utils';
import PrivateKeyModal from '@/layouts/AccessWalletLayout/components/PrivateKeyModal/PrivateKeyModal.vue';
import sinon from 'sinon';
import { Tooling } from '@@/helpers';

describe('PrivateKeyModal.vue', () => {
  describe('PrivateKeyModal.vue', () => {
    let localVue, i18n, wrapper, store;
    window.matchMedia =
      window.matchMedia ||
      function() {
        return {
          matches: false,
          addListener: jest.fn(),
          removeListener: jest.fn()
        };
      };

    beforeAll(() => {
      const baseSetup = Tooling.createLocalVueInstance();
      localVue = baseSetup.localVue;
      i18n = baseSetup.i18n;
      store = baseSetup.store;
    });

    beforeEach(() => {
      wrapper = mount(PrivateKeyModal, {
        localVue,
        i18n,
        store,
        attachToDocument: true
      });
    });

    xit('should reset the privateKey via input element', () => {
      const privateKey =
        'b7420d4287f425479375c7f6eab7338cabd8a61c7b85fd51b00dac3d7443a8ea';
      const textInput = wrapper.find('.input-container input');
      textInput.setValue(privateKey);
      expect(wrapper.vm.$data.privateKey).toBe(privateKey);
    });
  });

  describe('PrivateKeyModal.vue Methods', () => {
    let localVue, i18n, wrapper, store;
    const spy = sinon.stub();
    const mockRoute = {
      push: spy
    };

    beforeAll(() => {
      const baseSetup = Tooling.createLocalVueInstance();
      localVue = baseSetup.localVue;
      i18n = baseSetup.i18n;
      store = baseSetup.store;

      const actions = {
        decryptWallet: jest.fn()
      };

      store = new Vuex.Store({
        actions
      });
    });

    beforeEach(() => {
      wrapper = mount(PrivateKeyModal, {
        localVue,
        i18n,
        store,
        attachToDocument: true,
        mocks: {
          $router: mockRoute
        }
      });
    });

    xit('should reset the privateKey directly', () => {
      const privateKey =
        'b7420d4287f425479375c7f6eab7338cabd8a61c7b85fd51b00dac3d7443a8ea';
      const btnSubmit = wrapper.find('.submit-button');
      wrapper.setData({ privateKey });
      btnSubmit.trigger('click');
      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.$data.privateKey).toBe('');
      });
    });

    xit('should navigate to interface page', () => {
      const privateKey =
        'b7420d4287f425479375c7f6eab7338cabd8a61c7b85fd51b00dac3d7443a8ea';
      const btnSubmit = wrapper.find('.submit-button');
      wrapper.setData({ privateKey });
      btnSubmit.trigger('click');
      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.$data.privateKey).toBe('');
        btnSubmit.trigger('click');
        expect(spy.calledWith({ path: 'interface' })).toBe(true);
      });
    });
  });
});
