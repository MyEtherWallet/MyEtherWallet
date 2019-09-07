import Vue from 'vue';
import CreateWalletLayout from '@/layouts/CreateWalletLayout/CreateWalletLayout.vue';
import { shallowMount } from '@vue/test-utils';
import ByMnemonicContainer from '@/layouts/CreateWalletLayout/containers/ByMnemonicContainer/ByMnemonicContainer.vue';
import ByJsonFileContainer from '@/layouts/CreateWalletLayout/containers/ByJsonFileContainer/ByJsonFileContainer.vue';
import CreateWalletInput from '@/layouts/CreateWalletLayout/components/CreateWalletInput/CreateWalletInput.vue';
import TutorialModal from '@/layouts/CreateWalletLayout/components/TutorialModal/TutorialModal.vue';
import PageTitle from '@/layouts/CreateWalletLayout/components/PageTitle/PageTitle.vue';
import PageFooter from '@/layouts/CreateWalletLayout/components/PageFooter/PageFooter.vue';
import ScanToDownloadModal from '@/layouts/CreateWalletLayout/components/ScanToDownloadModal/ScanToDownloadModal.vue';
import CreateWalletInputFooter from '@/layouts/CreateWalletLayout/components/CreateWalletInputFooter/CreateWalletInputFooter.vue';
import sinon from 'sinon';
import { Tooling } from '@@/helpers';
import { RouterLinkStub } from '@@/helpers/setupTooling';
import IpadModal from '@/components/IpadModal';

describe('CreateWalletLayout.vue', () => {
  let localVue, i18n, wrapper, store, showModal, hideModal;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;

    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    initWrapper(false);
  });

  function initWrapper(sync) {
    showModal = sinon.stub();
    hideModal = sinon.stub();

    const BModalStub = {
      name: 'b-modal',
      template: '<div><slot></slot></div>',
      props: ['to'],
      methods: {
        show: showModal,
        hide: hideModal
      }
    };

    wrapper = shallowMount(CreateWalletLayout, {
      localVue,
      i18n,
      store,
      sync: sync,
      stubs: {
        'by-json-file-container': ByJsonFileContainer,
        'by-mnemonic-container': ByMnemonicContainer,
        'tutorial-modal': TutorialModal,
        'scan-to-download-modal': ScanToDownloadModal,
        'by-json-page-title': PageTitle,
        'create-wallet-input': CreateWalletInput,
        'create-wallet-input-footer': CreateWalletInputFooter,
        'by-json-page-footer': PageFooter,
        'ipad-modal': IpadModal,
        'router-link': RouterLinkStub,
        'b-modal': BModalStub
      }
    });
  }
  it('should render correct byMnemonic data', () => {
    expect(wrapper.find('.nav-tab-user-input-box').isVisible()).toBe(true);
  });

  describe('CreateWalletLayout.vue Methods', () => {
    beforeAll(() => {
      const baseSetup = Tooling.createLocalVueInstance();
      localVue = baseSetup.localVue;
      i18n = baseSetup.i18n;
      store = baseSetup.store;

      Vue.config.warnHandler = () => {};
    });

    beforeEach(() => {
      initWrapper(false);
    });

    it('should render correct skip method', () => {
      wrapper.vm.skip();
      expect(hideModal.called).toBe(true);
    });

    it('should render correct scanToDownloadModalOpen method', () => {
      localStorage.setItem('skipTutorial', true);
      expect(showModal.called).toBe(false);
      wrapper.vm.scanToDownloadModalOpen();
      expect(showModal.called).toBe(true);
    });

    it('should render correct switcher method', () => {
      wrapper.vm.switcher('Json');
      expect(wrapper.vm.$data.byJson).toBe(true);
      expect(wrapper.vm.$data.byMnemonic).toBe(false);
      wrapper.vm.switcher('Mnemonic');
      expect(wrapper.vm.$data.byJson).toBe(false);
      expect(wrapper.vm.$data.byMnemonic).toBe(true);
      wrapper.vm.switcher('Mnemonic111');
      expect(wrapper.vm.$data.byJson).toBe(false);
      expect(wrapper.vm.$data.byMnemonic).toBe(false);
    });
  });
});
