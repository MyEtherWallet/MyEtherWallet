import { shallowMount } from '@vue/test-utils'
import SendCurrencyContainer from '@/layouts/InterfaceLayout/containers/SendCurrencyContainer/SendCurrencyContainer.vue';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle/InterfaceContainerTitle.vue';
import PopOver from '@/components/PopOver/PopOver.vue';
import {
  Tooling
} from '@@/helpers';


xdescribe('[BEFORE EACH ERROR] SendCurrencyContainer.vue', () => {
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
