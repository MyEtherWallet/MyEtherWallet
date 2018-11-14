import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import SendOfflineContainer from '@/layouts/InterfaceLayout/containers/SendOfflineContainer/SendOfflineContainer.vue';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle/InterfaceContainerTitle.vue';
import PopOver from '@/components/PopOver/PopOver.vue';
import {
  Tooling
} from '@@/helpers';


describe('SendOfflineContainer.vue', () => {
    let localVue, i18n, wrapper, store;
    const resetView = jest.fn()
    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
        Vue.config.warnHandler = ()=>{};
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
        wrapper = shallowMount(SendOfflineContainer, {
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

    xit('[FAILING] should render correct nonce data', () => {
        expect(wrapper.vm.$el.querySelectorAll('.gas-amount input')[2].value).toEqual(String(wrapper.vm.$data.nonce));
    });

    xit('[FAILING] should render correct gasLimit data', () => {
        expect(wrapper.vm.$el.querySelectorAll('.gas-amount input')[3].value).toEqual(String(wrapper.vm.$data.gasLimit))
    });

    xit('[FAILING] should render correct rawTx data', () => {
        wrapper.setData({currentPage:'sendPubTx'})
        expect(wrapper.vm.$el.querySelector('.gas-amount textarea').textContent).toEqual('')
    });

    xit('[FAILING] should render correct currentPage data', () => {
        const currentPage = wrapper.vm.$el.getElementsByClassName(wrapper.vm.$data.currentPage)[0]
        expect(currentPage.className.indexOf('active')).toBeGreaterThan(-1)
    })

    describe('SendOfflineContainer.vue Methods', () => {
      xit('[FAILING] should change currentPage when click button', () => {
        const processElements = wrapper.findAll('div.prevent-pointer-events');
        for(var i=0; i<processElements.length; i++) {
          var processElement = processElements.at(i);
          processElement.trigger('click')
          const currentPage = wrapper.vm.$el.getElementsByClassName(wrapper.vm.$data.currentPage)[0]
          expect(currentPage.className.indexOf('active')).toBeGreaterThan(-1)
        }
      });
    });
});
