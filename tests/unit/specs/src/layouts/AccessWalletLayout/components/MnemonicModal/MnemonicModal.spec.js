import { shallowMount, createLocalVue } from '@vue/test-utils';
import VueI18n from 'vue-i18n';
import BootstrapVue from 'bootstrap-vue';
import MnemonicModal from '@/layouts/AccessWalletLayout/components/MnemonicModal';
import Vue from 'vue';
import languages from '@/translations';

describe('MnemonicModal.vue', () => {


  it('should render correct contents', () => {
  });

  describe('MnemonicModal.vue Methods', () => {
    let localVue, i18n;

    beforeAll(() => {
      localVue = createLocalVue();
      localVue.use(VueI18n);
      localVue.use(BootstrapVue);
      i18n = new VueI18n({
        locale: 'en_US',
        fallbackLocale: 'en_US',
        messages: languages,
        silentTranslationWarn: true
      });
    });

    it('should update the mnemonic phrase array length', () => {
      const mount = shallowMount(MnemonicModal, {
        localVue,
        i18n,
        attachToDocument: true,
        propsData: {
          mnemonicPhrasePasswordModalOpen: function() {}
        }
      });
      mount.vm.mnemonicSize = 24;
      mount.vm.mnemonicValueBitSizeChange();
      console.log(mount.vm.mnemonicPhrase); // todo remove dev item

      // expect(mount.vm.mnemonicPhrase).toEqual(24);
    });
  });

});
