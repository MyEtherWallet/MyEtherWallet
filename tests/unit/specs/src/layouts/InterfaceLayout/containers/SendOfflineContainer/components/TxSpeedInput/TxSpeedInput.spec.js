import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import TxSpeedInput from '@/layouts/InterfaceLayout/containers/SendOfflineContainer/components/TxSpeedInput/TxSpeedInput.vue';
import PopOver from '@/components/PopOver/PopOver.vue';
import {
  Tooling
} from '@@/helpers';

describe('TxSpeedInput.vue', () => {
    let localVue, i18n, wrapper, store;


    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(TxSpeedInput, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          stubs: {
            popover: PopOver
          },
          propsData: {
            data: '',
            toAddress: '',
            value: '0',
            gasLimit: 21000,
            nonce: 0
          }
        });
    });

    it('should render correct content', () => {
      const speedButtons = wrapper.vm.$el.querySelectorAll('.send-form .buttons div');
      expect(speedButtons[0].textContent.trim()).toEqual('Slow')
      expect(speedButtons[1].textContent.trim()).toEqual('Regular')
      expect(speedButtons[2].textContent.trim()).toEqual('Fast')
      expect(wrapper.vm.data).toEqual('')
      expect(wrapper.vm.toAddress).toEqual('')
      expect(wrapper.vm.value).toEqual('0')
      expect(wrapper.vm.gasLimit).toEqual(21000)
      expect(wrapper.vm.nonce).toEqual(0)
      expect(wrapper.vm.$data.locNonce).toEqual(0)
      expect(wrapper.vm.$data.locGasLimit).toEqual(21000)
    });

    it('should emit locNonce update when input changed', () => {
      var inputElement = wrapper.findAll('.gas-amount input').at(1)
      var inputText= 11
      inputElement.setValue(inputText)
      inputElement.trigger('change')
      expect(wrapper.emitted().nonceUpdate).toBeTruthy();
    })

    it('should emit gasLimitUpdate update when input changed', () => {
      var inputElement = wrapper.findAll('.gas-amount input').at(2)
      var inputText= 11
      inputElement.setValue(inputText)
      inputElement.trigger('change')
      expect(wrapper.emitted().gasLimitUpdate).toBeTruthy();
    })

  describe('TxSpeedInput.vue Methods', () => {
  });
});
