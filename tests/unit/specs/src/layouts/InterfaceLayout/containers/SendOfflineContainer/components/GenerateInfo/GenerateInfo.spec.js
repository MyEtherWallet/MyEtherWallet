import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import GenerateInfo from '@/layouts/InterfaceLayout/containers/SendOfflineContainer/components/GenerateInfo/GenerateInfo.vue';
import TxSpeedInput from '@/layouts/InterfaceLayout/containers/SendOfflineContainer/components/TxSpeedInput/TxSpeedInput.vue';
import PopOver from '@/components/PopOver/PopOver.vue';

import {
  Tooling
} from '@@/helpers';

describe('GenerateInfo.vue', () => {
    let localVue, i18n, wrapper, store;

    const gasLimit = 1000;
    const nonce = 1;

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
       store.replaceState({
          wallet: {
            getAddressString: function(){}
          }
        })
        wrapper = shallowMount(GenerateInfo, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          stubs:{
            'tx-speed-input':TxSpeedInput,
            'popover':PopOver
          },
          propsData: { gasLimit, nonce }
        });

    });

    xit('[FAILING] should render correct content', () => {
      expect(wrapper.vm.$data.isValid).toBe(false)

       var inputElements = wrapper.vm.$el.querySelectorAll('.gas-amount input')

       expect(inputElements[2].value).toEqual(String(nonce))
       expect(inputElements[3].value).toEqual(String(gasLimit))

    });



  describe('GenerateInfo.vue Methods', () => {
    xit('[FAILING] should generate Info when button click', () => {
      wrapper.find('.submit-button-container div.submit-button').trigger('click')
      expect(wrapper.vm.$data.moreInfoGenerated).toBe(true)
    });

    xit('[FAILING] should generate tx when button click', () => {
      wrapper.find('.submit-button-container div.submit-button').trigger('click')
      wrapper.find('.submit-button-container div.submit-button').trigger('click')
      expect(wrapper.emitted().pathUpdate).toBeTruthy();
    });

    xit('[FAILING] should emit locNonce update when input changed', () => {
      var inputElement = wrapper.findAll('.gas-amount input').at(2)
      var inputText= 11
      inputElement.setValue(inputText)
      inputElement.trigger('change')
      expect(wrapper.emitted().nonceUpdate).toBeTruthy();
    })

    xit('[FAILING] should emit gasLimitUpdate update when input changed', () => {
      var inputElement = wrapper.findAll('.gas-amount input').at(3)
      var inputText= 11
      inputElement.setValue(inputText)
      inputElement.trigger('change')
      expect(wrapper.emitted().gasLimitUpdate).toBeTruthy();
    })

    xit('[FAILING] should delete FromAddress when button clicked', () => {
      var inputElement = wrapper.findAll('.gas-amount input').at(0);
      var inputText= 11
      inputElement.setValue(inputText)
      inputElement.trigger('change')
      expect(wrapper.vm.$el.querySelectorAll('.gas-amount input')[0].value).toEqual(String(inputText))
      wrapper.findAll('.prevent-user-select').at(0).trigger('click')
      expect(wrapper.vm.$el.querySelectorAll('.gas-amount input')[0].value).toEqual('')
    })
  });
});
