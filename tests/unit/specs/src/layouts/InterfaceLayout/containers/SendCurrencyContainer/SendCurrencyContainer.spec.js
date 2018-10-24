import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import SendCurrencyContainer from '@/layouts/InterfaceLayout/containers/SendCurrencyContainer/SendCurrencyContainer.vue';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle/InterfaceContainerTitle.vue';
import GenerateInfo from '@/layouts/InterfaceLayout/components/GenerateInfo/GenerateInfo.vue';
import GenerateTx from '@/layouts/InterfaceLayout/components/GenerateTx/GenerateTx.vue';
import SendTx from '@/layouts/InterfaceLayout/components/SendTx/SendTx.vue';
import PopOver from '@/components/PopOver/PopOver.vue';
import BackButton from '@/layouts/InterfaceLayout/components/BackButton/BackButton.vue';
import {
  Tooling
} from '@@/helpers';


xdescribe('SendCurrencyContainer.vue', () => {
    let localVue, i18n, wrapper, store;
    const resetView = jest.fn()
    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
       store.replaceState({
          account: {
              balance: {
                result:''
              }
          }, 
          wallet: {
            getAddressString: function(){}
          } 
        })
        wrapper = shallowMount(SendCurrencyContainer, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          stubs: {
            'send-tx':SendTx,
            'generate-tx':GenerateTx,
            'generate-info':GenerateInfo,
            'interface-container-title':InterfaceContainerTitle,
            'popover':PopOver
          }
        });
    });

    it('should render correct nonce data', () => {
        
    });
    describe('SendCurrencyContainer.vue Methods', () => {
     
    });
});
