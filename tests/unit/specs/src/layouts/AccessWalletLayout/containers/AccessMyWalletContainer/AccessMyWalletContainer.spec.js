import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import sinon from 'sinon';
import AccessMyWalletContainer from '@/layouts/AccessWalletLayout/containers/AccessMyWalletContainer/AccessMyWalletContainer.vue';
import HardwarePasswordModal from '@/layouts/AccessWalletLayout/components/HardwarePasswordModal/HardwarePasswordModal.vue';
import AccessWalletButton from '@/layouts/AccessWalletLayout/components/AccessWalletButton/AccessWalletButton.vue';
import HardwareModal from '@/layouts/AccessWalletLayout/components/HardwareModal/HardwareModal.vue';
import Web3WalletModal from '@/layouts/AccessWalletLayout/components/Web3WalletModal/Web3WalletModal.vue';
import MewConnectModal from '@/layouts/AccessWalletLayout/components/MewConnectModal/MewConnectModal.vue';
import SoftwareModal from '@/layouts/AccessWalletLayout/components/SoftwareModal/SoftwareModal.vue';
import MnemonicModal from '@/layouts/AccessWalletLayout/components/MnemonicModal';
import PasswordModal from '@/layouts/AccessWalletLayout/components/PasswordModal/PasswordModal.vue';
import PrivateKeyModal from '@/layouts/AccessWalletLayout/components/PrivateKeyModal/PrivateKeyModal.vue';
import { Tooling } from '@@/helpers';

const BBtnStub = {
  name: 'b-btn',
  template: '<div class="b-btn">{{title}}</div>',
  props: ['title']
};

describe('AccessMyWalletContainer.vue', () => {
  let localVue, i18n, wrapper, store, showModal, hideModal;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;

    Vue.config.warnHandler = () => {};
  });

  function resetWrapper() {
    showModal = sinon.stub();
    hideModal = sinon.stub();

    const BModalStub = {
      name: 'b-modal',
      template: '<div><slot></slot></div>',
      props: ['to', 'ref'],
      methods: {
        show: showModal,
        hide: hideModal,
        $on: sinon.stub()
      }
    };
    wrapper = shallowMount(AccessMyWalletContainer, {
      localVue,
      i18n,
      store,
      attachToDocument: true,

      stubs: {
        'b-btn': BBtnStub,
        'b-modal': BModalStub,
        'hardware-password-modal': HardwarePasswordModal,
        'access-wallet-button': AccessWalletButton,
        'hardware-modal': HardwareModal,
        'metamask-modal': Web3WalletModal,
        'mew-connect-modal': MewConnectModal,
        'software-modal': SoftwareModal,
        'mnemonic-modal': MnemonicModal,
        'password-modal': PasswordModal,
        'private-key-modal': PrivateKeyModal,
        'another-component': true
      }
    });
    // wrapper.$options.mounted = [
    //   () => console.log('this is the successful mock of mounted')
    // ];
  }

  beforeEach(() => {
    resetWrapper();
  });

  it('should render correct hardwareBrand props', () => {
    const hardwareBrand = 'hardwareBrand';
    wrapper.setData({ hardwareBrand });
    expect(
      wrapper
        .find('.submit-button')
        .text()
        .indexOf(hardwareBrand)
    ).toBeGreaterThan(-1);
  });

  it('should render correct softwareModalOpen method', () => {
    expect(showModal.called).toBe(false);
    wrapper.vm.softwareModalOpen();
    expect(showModal.called).toBe(true);
  });

  it('should render correct buttons data', () => {
    const accessWalletButtons = wrapper.vm.$el.querySelectorAll(
      '.wrap .page-container .buttons-container div.button-block'
    );

    for (const [i, accessWalletButton] of accessWalletButtons.entries()) {
      expect(
        accessWalletButton.querySelector('.small-note').textContent.trim()
      ).toEqual(wrapper.vm.$data.buttons[i].recommend);
      expect(accessWalletButton.querySelector('h3').textContent.trim()).toEqual(
        wrapper.vm.$data.buttons[i].title
      );
      expect(accessWalletButton.querySelector('p').textContent.trim()).toEqual(
        wrapper.vm.$data.buttons[i].desc
      );
      expect(
        accessWalletButton.querySelector('.b-btn').textContent.trim()
      ).toEqual(wrapper.vm.$data.buttons[i].tooltip);
    }
  });
  describe('AccessMyWalletContainer.vue Methods', () => {
    it('should render correct mewConnectModalOpen method', () => {
      expect(showModal.called).toBe(false);
      wrapper.vm.mewConnectModalOpen();
      expect(showModal.called).toBe(true);
    });

    it('should render correct hardwareModalOpen method', () => {
      expect(showModal.called).toBe(false);
      wrapper.vm.hardwareModalOpen();
      expect(showModal.called).toBe(true);
    });

    it('should render correct softwareModalOpen  method', () => {
      expect(showModal.called).toBe(false);
      wrapper.vm.softwareModalOpen();
      expect(showModal.called).toBe(true);
    });

    it('should render correct passwordOpen method', () => {
      expect(showModal.called).toBe(false);
      wrapper.vm.passwordOpen();
      expect(showModal.called).toBe(true);
    });

    it('should render correct privateKeyOpen method', () => {
      expect(showModal.called).toBe(false);
      wrapper.vm.privateKeyOpen();
      expect(showModal.called).toBe(true);
      expect(hideModal.called).toBe(true);
    });
  });
});
