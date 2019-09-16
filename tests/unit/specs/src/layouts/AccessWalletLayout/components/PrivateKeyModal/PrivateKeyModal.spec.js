import Vue from 'vue';
import Vuex from 'vuex';
import { mount } from '@vue/test-utils';
import PrivateKeyModal from '@/layouts/AccessWalletLayout/components/PrivateKeyModal/PrivateKeyModal.vue';
import WarningMessage from '@/components/WarningMessage';
import CustomerSupport from '@/components/CustomerSupport';
import StandardButton from '@/components/Buttons/StandardButton';

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

      Vue.config.warnHandler = () => {};
    });

    beforeEach(() => {
      const mockRouter = {
        history: {
          current: {
            fullPath: '/'
          }
        }
      };

      wrapper = mount(PrivateKeyModal, {
        localVue,
        i18n,
        store,
        attachToDocument: true,
        stubs: {
          'customer-support': CustomerSupport,
          'warning-message': WarningMessage,
          'standard-button': StandardButton
        },
        mocks: {
          $router: mockRouter
        }
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
      const mockRouter = {
        push: spy,
        history: {
          current: {
            fullPath: '/'
          }
        }
      };

      wrapper = mount(PrivateKeyModal, {
        localVue,
        i18n,
        store,
        attachToDocument: true,
        mocks: {
          $router: mockRouter
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
