import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import PrivateKeyModal from '@/layouts/AccessWalletLayout/components/PrivateKeyModal/PrivateKeyModal.vue';

import {
  Mnemonic,
  Tooling
} from '@@/helpers';

const longMnemonic = Mnemonic.long;

describe('PrivateKeyModal.vue', () => {
  it('should render correct contents', () => {
    
  });

  describe('PrivateKeyModal.vue Methods', () => {
    let localVue, i18n, wrapper, store;

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(PrivateKeyModal, {
          localVue,
          i18n,
          store,
          attachToDocument: true
        });
    });

    it('should reset the privateKey directly', () => {
      const button = wrapper.find('button');
      
      console.log('manuall longMnemonic:%O', longMnemonic);
      wrapper.setData({privateKey:longMnemonic})
      // wrapper.vm.$nextTick(() => {
      //   // wrapper.vm.unlockWallet();
      //   expect(wrapper.vm.$data.privateKey).toBe('')
      // });

      button.trigger('click')
      expect(wrapper.vm.$data.privateKey).toBe('')
    });

  });
});
