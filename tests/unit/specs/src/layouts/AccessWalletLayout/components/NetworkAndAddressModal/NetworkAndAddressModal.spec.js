import Vue from 'vue';
import Vuex from 'vuex';
import nodeList from '@/networks';
import { shallowMount } from '@vue/test-utils';
import NetworkAndAddressModal from '@/layouts/AccessWalletLayout/components/NetworkAndAddressModal/NetworkAndAddressModal.vue';
import sinon from 'sinon';
import { Tooling, ETH_NETWORK_INDEX } from '@@/helpers';
// import {
//   LedgerWallet,
//   TrezorWallet,
//   DigitalBitboxWallet,
//   SecalotWallet
// } from '@/wallets';

const showModal = sinon.stub();
const hideModal = sinon.stub();

const BModalStub = {
  name: 'b-modal',
  template: '<div><slot></slot></div>',
  props: ['to'],
  methods: {
    show: showModal,
    hide: hideModal
  }
};

describe('NetworkAndAddressModal.vue', () => {
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

    const network = nodeList['ETH'][ETH_NETWORK_INDEX];

    const getters = {
      customPaths: () => {},
      network: () => {
        return network;
      },
      Networks: () => {
        return nodeList;
      },
      path: () => {}
    };

    store = new Vuex.Store({
      actions,
      getters,
      state: {
        network: network
      }
    });

    Vue.config.errorHandler = () => {};
    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(NetworkAndAddressModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      mocks: {
        $router: mockRoute
      },
      stubs: {
        'b-modal': BModalStub
      }
    });
  });

  describe('NetworkAndAddressModal.vue Methods', () => {
    it('should reset the privateKey via input element', () => {
      expect(wrapper.vm.$data.accessMyWalletBtnDisabled).toBe(true);
      const checkboxElement = wrapper.find('.checkbox-container input');
      checkboxElement.trigger('click');
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
