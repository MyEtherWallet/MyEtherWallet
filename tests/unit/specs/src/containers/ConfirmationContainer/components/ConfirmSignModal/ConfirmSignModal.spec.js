import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import ConfirmSignModal from '@/containers/ConfirmationContainer/components/ConfirmSignModal/ConfirmSignModal.vue';
import VueQrcode from '@xkeshi/vue-qrcode';

import {
  Tooling
} from '@@/helpers';
    const confirmSignMessage = jest.fn()

const signedMessage = 'signedMessage'
const messageToSign = 'messageToSign'
const from = 'from'
const isHardwareWallet = false

describe('ConfirmSignModal.vue', () => {
    let localVue, i18n, wrapper, store;

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(ConfirmSignModal, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          stubs:{
            'qrcode':VueQrcode
          },
           propsData: { signedMessage, messageToSign, from ,confirmSignMessage, isHardwareWallet}
        });
    });


    it('should render correct contents', () => {
        expect(wrapper.vm.$el.querySelector('.tx-from .address-info').getElementsByTagName('p')[1].textContent.trim()).toEqual(from);
        expect(wrapper.vm.$el.querySelector('.tx-to .address-info').getElementsByTagName('p')[1].textContent.trim()).toEqual(messageToSign);
        expect(wrapper.vm.modalDetailInformation).toBe(false)
        expect(wrapper.vm.transactionSigned).toBe(false)
        expect(wrapper.vm.signedMessageSignature).toEqual(signedMessage)
    });


    describe('ConfirmSignModal.vue Methods', () => {
      it('should confirm SignMessage when click submit button', () => {
      const submitButton = wrapper.find('div.submit-button')
      submitButton.trigger('click')
      expect( confirmSignMessage ).toHaveBeenCalled()
    })
  });
});
