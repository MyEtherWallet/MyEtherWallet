import { shallowMount } from '@vue/test-utils';
import MnemonicPasswordModal from '@/layouts/AccessWalletLayout/components/MnemonicPasswordModal';
import { MnemonicWallet } from '@/wallets';
import {
  Mnemonic,
  Tooling
} from '@@/helpers';

const longMnemonic = Mnemonic.long;
const shortMnemonic = Mnemonic.short;

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
          expect(walletObject.addressesToIndexMap[0]).toEqual(Mnemonic.longAddresses[0].toLowerCase());
          done();
        },
        phrase: longMnemonic
      });
      wrapper.setData({ password: Mnemonic.longPassword });
      wrapper.vm.$nextTick(() => {
        wrapper.vm.unlockWallet();
      });
    });

    it('should supply the mnemonic password via the v-model on the input element', (done) => {
      wrapper.setProps({
        hardwareWalletOpen: function(walletObject) {
          expect(walletObject).toBeInstanceOf(MnemonicWallet);
          expect(walletObject.addressesToIndexMap[0]).toEqual(Mnemonic.shortAddresses[0].toLowerCase());
          done();
        },
        phrase: shortMnemonic
      });

      const input = wrapper.find('input');
      input.setValue(Mnemonic.shortPassword);
      wrapper.vm.$nextTick(() => {
        wrapper.vm.unlockWallet();
      });
    });

    it('should accept an empty password to create an instance of MnemonicWallet and pass it to the hardwareWalletOpen prop function', (done) => {
      wrapper.setProps({
        hardwareWalletOpen: function(walletObject) {
          expect(walletObject).toBeInstanceOf(MnemonicWallet);
          expect(walletObject.addressesToIndexMap[0]).toEqual(Mnemonic.noPasswordShortAddresses[0].toLowerCase());
          done();
        },
        phrase: Mnemonic.noPasswordShort
      });
      // wrapper.setData({ password: Tooling.shortMnemonicPassword });
      wrapper.vm.$nextTick(() => {
        wrapper.vm.unlockWallet();
      });
    });

  });
});
