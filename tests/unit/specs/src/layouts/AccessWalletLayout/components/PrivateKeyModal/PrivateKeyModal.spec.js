import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import PrivateKeyModal from '@/layouts/AccessWalletLayout/components/PrivateKeyModal/PrivateKeyModal.vue';
import  sinon from 'sinon' 
import {
  Mnemonic,
  Tooling
} from '@@/helpers';

const longMnemonic = Mnemonic.long;
import { BasicWallet } from '@/wallets';
describe('PrivateKeyModal.vue', () => {

  describe('PrivateKeyModal.vue', () => {
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

    it('should reset the privateKey via input element', () => {
      const textInput = wrapper.find('.input-container input')
      textInput.setValue(longMnemonic);
      expect(wrapper.vm.$data.privateKey).toBe(longMnemonic)
    });
  });

  describe('PrivateKeyModal.vue Methods', () => {
    let localVue, i18n, wrapper, store, spy;
    spy = sinon.stub()
    const mockRoute = {
      push: spy
    };

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
          attachToDocument: true,
          mocks: {
            $router: mockRoute,
          }
        });
        spy = jest.spyOn(wrapper.vm.$router,'push')
    });

    it('should reset the privateKey directly', () => {
      // const button = wrapper.find('button');
      // wrapper.setData({privateKey:longMnemonic})
      // button.trigger('click')
      // expect(wrapper.vm.$data.privateKey).toBe('')
    });

    it('should navigate to interface page', () => {
      // wrapper.setData({privateKey:'0ADD'})
      // const button = wrapper.find('button');
      // wrapper.setData({privateKey:longMnemonic})
      // button.trigger('click')
      // expect(spy.called).toBe(true)

    });
});
});
