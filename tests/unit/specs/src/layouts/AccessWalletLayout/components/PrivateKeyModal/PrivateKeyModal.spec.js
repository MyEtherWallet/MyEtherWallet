import VueX from 'vuex';
import { shallowMount } from '@vue/test-utils';
import PrivateKeyModal
  from '@/layouts/AccessWalletLayout/components/PrivateKeyModal/PrivateKeyModal.vue';
import debugLogger from 'debug';
import {
  Wallets,
  PrivateKey,
  Tooling
} from '@@/helpers';

const testLog = debugLogger('test:PrivateKeyModal.spec');

jest.mock('@/wallets');
// localVue.use(VueX)

describe('PrivateKeyModal.vue', () => {
  it('should render correct contents', () => {

  });

  describe('PrivateKeyModal.vue Methods', () => {
    let localVue, router, i18n, wrapper, store, state, actions;

    beforeAll(() => {
      const baseSetup = Tooling.createLocalVueInstance();
      localVue = baseSetup.localVue;
      router = baseSetup.router
      i18n = baseSetup.i18n;
      // store = baseSetup.store;
    });

    beforeEach(() => {
      state = {
        wallet: {}
      };

      actions = {
        decryptWallet: (value) => {state.wallet = value;}
      };

      store = new VueX.Store({
        actions,
        state
      });

      wrapper = shallowMount(PrivateKeyModal, {
        localVue,
        i18n,
        router,
        store,
        attachToDocument: true
      });
    });

    it('should reset the privateKey directly', () => {
      console.log(wrapper); // todo remove dev item
      const button = wrapper.find('button');

      wrapper.setData({privateKey: PrivateKey.key});

      // wrapper.vm.$nextTick(() => {
      //   // wrapper.vm.unlockWallet();
      //   expect(wrapper.vm.$data.privateKey).toBe('')
      // });
      expect(wrapper.vm.$data.privateKey).toBe(PrivateKey.key);
      button.trigger('click');
      expect(wrapper.vm.$data.privateKey).toBe('');
    });

  });
});
