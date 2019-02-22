import { shallowMount } from '@vue/test-utils';
import ByMnemonicContainer from '@/layouts/CreateWalletLayout/containers/ByMnemonicContainer/ByMnemonicContainer.vue';
import VerificationModal from '@/layouts/CreateWalletLayout/containers/ByMnemonicContainer/components/VerificationModal/VerificationModal.vue';
import FinishModal from '@/layouts/CreateWalletLayout/containers/ByMnemonicContainer/components/FinishModal/FinishModal.vue';
import CreateWalletInputFooter from '@/layouts/CreateWalletLayout/components/CreateWalletInputFooter';
import PopOver from '@/components/PopOver/PopOver.vue';
import { Tooling } from '@@/helpers';
import { RouterLinkStub } from '@@/helpers/setupTooling';

describe('ByMnemonicContainer.vue', () => {
  let localVue, i18n, wrapper, store;
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(ByMnemonicContainer, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'finish-modal': FinishModal,
        'verification-modal': VerificationModal,
        'input-footer': CreateWalletInputFooter,
        popover: PopOver,
        'router-link': RouterLinkStub
      }
    });
  });

  describe('ByMnemonicContainer.vue Methods', () => {
    it('should render correct mnemonicValueRefresh method', () => {
      wrapper.setData({ mnemonicValues: [] });
      wrapper.find('.random-button').trigger('click');
      expect(wrapper.vm.$data.mnemonicValues.length).toBeGreaterThan(0);
    });

    it('should refresh mnemonicValues when button clicked', () => {
      wrapper.setData({ mnemonicValues: [] });
      wrapper.vm.mnemonicValueRefresh();
      expect(wrapper.vm.$data.mnemonicValues.length).toBeGreaterThan(0);
    });

    it('should render correct mnemonicValueBitSizeChange method', () => {
      expect(wrapper.vm.$data.mnemonic24).toBe(false);
      wrapper.vm.mnemonicValueBitSizeChange();
      expect(wrapper.vm.$data.mnemonic24).toBe(true);
    });

    it('should change mnemonicValueBitSize when button clicked', () => {
      expect(wrapper.vm.$data.mnemonic24).toBe(false);
      wrapper.find('.sliding-switch label.switch span').trigger('click');
      expect(wrapper.vm.$data.mnemonic24).toBe(true);
    });
  });
});
