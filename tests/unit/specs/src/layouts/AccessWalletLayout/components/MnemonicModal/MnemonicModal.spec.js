/** HARD CODED TEST VALUES
 *  - The ID prefix used to identify the input element for each mnemonic word
 */
import { shallowMount } from '@vue/test-utils';
import MnemonicModal from '@/layouts/AccessWalletLayout/components/MnemonicModal';
import {
  Mnemonic,
  Tooling
} from '@@/helpers';

const longMnemonic = Mnemonic.long;
const shortMnemonic = Mnemonic.short;

describe('MnemonicModal.vue', () => {

  describe('MnemonicModal.vue', () => {
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

    it('should check the switch to change the number of words', () => {
      const checkboxInput = wrapper.find('input[type="checkbox"]');
      expect(checkboxInput.element.checked).toEqual(false);
      checkboxInput.setChecked();
      expect(checkboxInput.element.checked).toEqual(true);
    });

    it('should click the element that changes the number of words display', () => {
      expect(wrapper.vm.mnemonic24).toEqual(false);
      let btn = wrapper.find('.slider');
      btn.trigger('click');
      expect(wrapper.vm.mnemonic24).toEqual(true);
    });

    it('should start with 12 input fields', () => {
      let btn = wrapper.findAll('input[type="text"]');
      for (let i = 0; i < 12; i++) {
        const inputField = btn.at(i);
        expect(inputField.element.value).toEqual('');
      }
    });

    it('should not have more than 12 input fields', () => {
      let btn = wrapper.findAll('input[type="text"]');
      let didFail = false;
      try {
        btn.at(14);
        expect(didFail).toEqual(true);
      } catch (e) {
        didFail = true;
        expect(didFail).toEqual(true);
      }
    });

    it('should start with 12 input fields then change to 24', () => {
      let btn = wrapper.find('.slider');
      btn.trigger('click');
      let input = wrapper.findAll('input[type="text"]');
      for (let i = 0; i < 24; i++) {
        const inputField = input.at(i);
        expect(inputField.element.value).toEqual('');
      }
    });

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
