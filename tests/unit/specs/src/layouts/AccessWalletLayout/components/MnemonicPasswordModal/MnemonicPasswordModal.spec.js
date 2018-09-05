import { shallowMount } from '@vue/test-utils';
import MnemonicPasswordModal from '@/layouts/AccessWalletLayout/components/MnemonicPasswordModal';
import { MnemonicWallet } from '@/wallets';
import {
  TestValues,
  Tooling
} from '@@/helpers';

const longMnemonic = TestValues.longMnemonic;
const shortMnemonic = TestValues.shortMnemonic;

describe('MnemonicPasswordModal.vue', () => {
  xit('should render correct contents', () => {
  });

  describe('MnemonicPasswordModal.vue Methods', () => {
    let localVue, i18n, wrapper;

    beforeAll(() => {
      const baseSetup = Tooling.createLocalVueInstance();
      localVue = baseSetup.localVue;
      i18n = baseSetup.i18n;
    });

    beforeEach(() => {
      wrapper = shallowMount(MnemonicPasswordModal, {
        localVue,
        i18n,
        attachToDocument: true
      });
    });

    it('should supply the mnemonic password directly', (done) => {
      wrapper.setProps({
        hardwareWalletOpen: function(walletObject) {
          expect(walletObject).toBeInstanceOf(MnemonicWallet);
          expect(walletObject.addressesToIndexMap[0]).toEqual(TestValues.longMnemonicAddresses[0].toLowerCase());
          done();
        },
        phrase: longMnemonic
      });
      wrapper.setData({ password: TestValues.longMnemonicPassword });
      wrapper.vm.$nextTick(() => {
        wrapper.vm.unlockWallet();
      });
    });

    it('should supply the mnemonic password via the v-model on the input element', (done) => {
      wrapper.setProps({
        hardwareWalletOpen: function(walletObject) {
          expect(walletObject).toBeInstanceOf(MnemonicWallet);
          expect(walletObject.addressesToIndexMap[0]).toEqual(TestValues.shortMnemonicAddresses[0].toLowerCase());
          done();
        },
        phrase: shortMnemonic
      });

      const input = wrapper.find('input');
      input.setValue(TestValues.shortMnemonicPassword);
      wrapper.vm.$nextTick(() => {
        wrapper.vm.unlockWallet();
      });
    });

    it('should accept an empty password to create an instance of MnemonicWallet and pass it to the hardwareWalletOpen prop function', (done) => {
      wrapper.setProps({
        hardwareWalletOpen: function(walletObject) {
          expect(walletObject).toBeInstanceOf(MnemonicWallet);
          expect(walletObject.addressesToIndexMap[0]).toEqual(TestValues.noPasswordShortMnemonicAddresses[0].toLowerCase());
          done();
        },
        phrase: TestValues.noPasswordShortMnemonic
      });
      // wrapper.setData({ password: Tooling.shortMnemonicPassword });
      wrapper.vm.$nextTick(() => {
        wrapper.vm.unlockWallet();
      });
    });

  });
});
