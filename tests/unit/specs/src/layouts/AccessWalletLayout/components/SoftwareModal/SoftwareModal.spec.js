import Vue from 'vue';
import { shallowMount, mount } from '@vue/test-utils'
import SoftwareModal from '@/layouts/AccessWalletLayout/components/SoftwareModal/SoftwareModal.vue';
import sinon from 'sinon'

import {
  Tooling
} from '@@/helpers';

const CloseButtonStub = {
  name:'b-btn',
  template:'<div><slot> </slot></div>'
}
const RouterLinkStub = {
  name:'router-link',
  template:'<p> <slot> </slot></p>',
  props:['to']  
}

const BModalStub = {
  name:'b-modal',
  template:'<div><slot></slot></div>',
  props:['to']
}

const BBtnStub = {
  name:'b-btn',
  template:'<div><slot></slot></div>',
  props:['to']
}


describe('SoftwareModal.vue', () => {
    const openMnemonicPhraseInput = sinon.stub()  
    const openPrivateKeyInput = sinon.stub() 
    describe('SoftwareModal.vue', () => {
        let localVue, i18n, wrapper, store;
     

        beforeAll(() => {
            const baseSetup = Tooling.createLocalVueInstance();
            localVue = baseSetup.localVue;
            i18n = baseSetup.i18n;
            store = baseSetup.store;
        });

        beforeEach(() => {
            wrapper = shallowMount(SoftwareModal, {
              localVue,
              i18n,
              store,
              attachToDocument: true,
              stubs:{
                'router-link':RouterLinkStub,
                'b-btn':BBtnStub,
                'b-modal':BModalStub
              }
            });
        });

      it('should render correct contents', () => {
        const liElements = wrapper.findAll('li')
        var liElement = liElements.at(0)
        liElement.trigger('click')
        expect(wrapper.vm.$data.selected).toBe('byJson')
        liElement = liElements.at(1)
        liElement.trigger('click')
        expect(wrapper.vm.$data.selected).toBe('byMnem')
        liElement = liElements.at(2)
        liElement.trigger('click')
        expect(wrapper.vm.$data.selected).toBe('byPriv')
      });

    });


    describe('SoftwareModal.vue Methods', () => {

         let localVue, i18n, wrapper, store;
     

        beforeAll(() => {
            const baseSetup = Tooling.createLocalVueInstance();
            localVue = baseSetup.localVue;
            i18n = baseSetup.i18n;
            store = baseSetup.store;
        });
        beforeEach(() => {
            wrapper = mount(SoftwareModal, {
              // mocks: { $t: () => 'some specific text' },
              localVue,
              i18n,
              store,
              attachToDocument: true,
              propsData: { 
                openMnemonicPhraseInput: openMnemonicPhraseInput,
                openPrivateKeyInput:openPrivateKeyInput
              },
              stubs:{
                'router-link':RouterLinkStub
              }
            });
        });
        
      it('should trigger openMnemonicPhraseInput method when continueAccess button is clicked', () => {
          wrapper.setData({selected:'byMnem'})
          const btn = wrapper.find('.mid-round-button-green-filled');
          btn.trigger('click')
          expect(openMnemonicPhraseInput.called).toBe(true)
      });

      it('should trigger openPrivateKeyInput method when continueAccess button is clicked', () => {
          wrapper.setData({selected:'byPriv'})
          const btn = wrapper.find('.mid-round-button-green-filled').trigger('click');
          expect(openPrivateKeyInput.called).toBe(true)
      });
    });
});
