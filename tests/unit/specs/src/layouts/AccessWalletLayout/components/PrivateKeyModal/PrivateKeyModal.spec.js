import Vue from 'vue';
import Vuex from 'vuex';
import { shallowMount } from '@vue/test-utils'
import PrivateKeyModal from '@/layouts/AccessWalletLayout/components/PrivateKeyModal/PrivateKeyModal.vue';
import sinon from 'sinon'
import {
  Mnemonic,
  Tooling
} from '@@/helpers';

const longMnemonic = Mnemonic.long;
import { BasicWallet } from '@/wallets';
describe('PrivateKeyModal.vue', () => {

  describe('PrivateKeyModal.vue', () => {
    let localVue, i18n, wrapper, store;

    beforeAll(() => {
      const baseSetup = Tooling.createLocalVueInstance();
      localVue = baseSetup.localVue;
      i18n = baseSetup.i18n;
      store = baseSetup.store;
    });

    beforeEach(() => {
      wrapper = shallowMount(PrivateKeyModal, {
        localVue,
        i18n,
        store,
        attachToDocument: true
      });
    });

    it('should reset the privateKey via input element', () => {
      const privateKey = 'b7420d4287f425479375c7f6eab7338cabd8a61c7b85fd51b00dac3d7443a8ea';
      const textInput = wrapper.find('.input-container input')
      textInput.setValue(privateKey);
      expect(wrapper.vm.$data.privateKey).toBe(privateKey);
    });

  });

  describe('PrivateKeyModal.vue Methods', () => {
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

      let actions = {
        decryptWallet: jest.fn()
      };

      store = new Vuex.Store({
        actions
      });

    });

    beforeEach(() => {
      wrapper = shallowMount(PrivateKeyModal, {
        localVue,
        i18n,
        store,
        attachToDocument: true,
        mocks: {
          $router: mockRoute,
        }
      });
    });

    it('should reset the privateKey directly', () => {
      const privateKey = 'b7420d4287f425479375c7f6eab7338cabd8a61c7b85fd51b00dac3d7443a8ea';
      const button = wrapper.find('button');
      wrapper.setData({ privateKey });
      button.trigger('click');
      expect(wrapper.vm.$data.privateKey).toBe('')
    });

    it('should navigate to interface page', () => {
      const privateKey = 'b7420d4287f425479375c7f6eab7338cabd8a61c7b85fd51b00dac3d7443a8ea';
      const button = wrapper.find('button');
      wrapper.setData({ privateKey });
      button.trigger('click');
      expect(wrapper.vm.$data.privateKey).toBe('')
      button.trigger('click')
      expect(spy.calledWith({ path: 'interface' })).toBe(true)
    });
  });
});
