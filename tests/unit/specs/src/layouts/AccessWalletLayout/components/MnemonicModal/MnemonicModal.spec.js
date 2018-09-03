/** HARD CODED TEST VALUES
 *  - The ID prefix used to identify the input element for each mnemonic word
 */
import { shallowMount } from '@vue/test-utils';
import MnemonicModal from '@/layouts/AccessWalletLayout/components/MnemonicModal';
import {
  TestValues,
  Tooling
} from '@@/helpers';

const longMnemonic = TestValues.longMnemonic;
const shortMnemonic = TestValues.shortMnemonic;

describe('MnemonicModal.vue', () => {

  it('should render correct contents', () => {
  });

  describe('MnemonicModal.vue Methods', () => {
    let localVue, i18n, wrapper;

    beforeAll(() => {
      const baseSetup = Tooling.createLocalVueInstance();
      localVue = baseSetup.localVue;
      i18n = baseSetup.i18n;
    });

    beforeEach(() => {
      wrapper = shallowMount(MnemonicModal, {
        localVue,
        i18n,
        attachToDocument: true,
        propsData: {
          mnemonicPhrasePasswordModalOpen: function(MnemonicPhrase) {
            expect(MnemonicPhrase).toEqual(longMnemonic);
          }
        }
      });
    });

    it('should convert the word array to a single string before passing it to the mnemonicPhrasePasswordModalOpen prop function', () => {
      wrapper.setData({ mnemonicPhrase: longMnemonic.split(' ') });
      wrapper.vm.openPasswordModal();
    });

    it('should populate and submit a 12 word mnemonic phrase', (done) => {
      wrapper.setProps({
        mnemonicPhrasePasswordModalOpen: function(MnemonicPhrase) {
          expect(MnemonicPhrase).toEqual(shortMnemonic);
          done();
        }
      });
      // wrapper.setData({ mnemonicSize: 12, mnemonic24: false, mnemonicPhrase: [].fill(' ', 0, 11) });
      const phrase = shortMnemonic.split(' ');
      for (let i = 0; i < 12; i++) {
        const textInput = wrapper.find('#word' + i);
        textInput.setValue(phrase[i]);
      }
      expect(wrapper.vm.mnemonicPhrase.length).toEqual(12);
      wrapper.vm.openPasswordModal();
    });

    it('should populate and submit a 24 word mnemonic phrase', (done) => {
      wrapper.vm.mnemonicValueBitSizeChange();
      const phrase = longMnemonic.split(' ');
      for (let i = 0; i < 24; i++) {
        const textInput = wrapper.find('#word' + i);
        textInput.setValue(phrase[i]);
      }
      expect(wrapper.vm.mnemonicPhrase.length).toEqual(24);
      wrapper.vm.$nextTick(() => {
        wrapper.vm.openPasswordModal();
        done();
      });
    });

    // Indicates the array length change mechanism is functioning properly
    it('should populate a 24 word mnemonic phrase and truncate it to 12 words', (done) => {
      wrapper.setProps({
        mnemonicPhrasePasswordModalOpen: function(MnemonicPhrase) {
          expect(MnemonicPhrase).toEqual(shortMnemonic);
          done();
        }
      });
      wrapper.vm.mnemonicValueBitSizeChange();
      const doubleLengthPhrase = shortMnemonic + ' ' + shortMnemonic;
      const phrase = doubleLengthPhrase.split(' ');
      for (let i = 0; i < 24; i++) {
        const textInput = wrapper.find('#word' + i);
        textInput.setValue(phrase[i]);
      }
      expect(wrapper.vm.mnemonicPhrase.length).toEqual(24);
      wrapper.vm.mnemonicValueBitSizeChange();
      expect(wrapper.vm.mnemonicPhrase.length).toEqual(12);
      wrapper.vm.$nextTick(() => {
        wrapper.vm.openPasswordModal();
      });
    });
  });

});
