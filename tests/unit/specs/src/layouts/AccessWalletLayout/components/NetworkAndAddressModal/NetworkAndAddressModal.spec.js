import Vue from 'vue';
import Vuex from 'vuex';
import { shallowMount } from '@vue/test-utils'
import NetworkAndAddressModal from '@/layouts/AccessWalletLayout/components/NetworkAndAddressModal/NetworkAndAddressModal.vue';
import sinon from 'sinon'
import {
  Tooling
} from '@@/helpers';
import {
  LedgerWallet,
  TrezorWallet,
  DigitalBitboxWallet,
  SecalotWallet
} from '@/wallets';

describe('NetworkAndAddressModal.vue', () => {
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

    let getters = {
      customPaths: () => { }
    };

    store = new Vuex.Store({
      actions,
      getters
    });

    Vue.config.errorHandler = () => { };
    Vue.config.warnHandler = () => { };
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

  describe('NetworkAndAddressModal.vue Methods', () => {
    it('should reset the privateKey via input element', () => {
      expect(wrapper.vm.$data.accessMyWalletBtnDisabled).toBe(true)
      const checkboxElement = wrapper.find('.checkbox-container input');
      checkboxElement.trigger('click')
      expect(wrapper.vm.$data.accessMyWalletBtnDisabled).toBe(false);
    });

    it('should render correct unlockWallet method', () => {
      wrapper.vm.unlockWallet();
      expect(spy.calledWith({ path: 'interface' })).toBe(true);
    });

    it('should render correct showCustomPathInput method', () => {
      let customPath = { label: 'label', dpath: 'dpath' };
      wrapper.setData({ customPath });
      wrapper.vm.showCustomPathInput();
      expect(wrapper.vm.$data.customPathInput).toBe(true);
      customPath = { label: '', dpath: '' };
      expect(wrapper.vm.$data.customPath).toEqual(customPath);
    });
  });
});
