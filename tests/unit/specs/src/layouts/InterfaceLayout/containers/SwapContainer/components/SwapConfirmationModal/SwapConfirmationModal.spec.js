import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import SwapConfirmationModal from '@/layouts/InterfaceLayout/containers/SwapContainer/components/SwapConfirmationModal/SwapConfirmationModal.vue';
import {
  Tooling
} from '@@/helpers';


import ButtonWithQrCode from '@/components/Buttons/ButtonWithQrCode/ButtonWithQrCode.vue';
import DetailInformation from '@/layouts/InterfaceLayout/containers/SwapContainer/components/SwapConfirmationModal/components/DetailInformation/DetailInformation.vue';

const RouterLinkStub = {
  name:'router-link',
  template:'<p> <slot> </slot></p>',
  // render: ()=>{},
  props:['to']  
}


describe('SwapConfirmationModal.vue', () => {
    let localVue, i18n, wrapper, store;
    const resetView = jest.fn(()=> console.log('resetView function called'))
    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(SwapConfirmationModal, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          stubs: {
            'router-link':RouterLinkStub,
            'detail-information':DetailInformation
          }
        });
    });

    it('should render correct fromArray to currenPicker element', () => { 
      wrapper.find('.detail-information input').trigger('click')
      expect(wrapper.find('.detail-information .expending-block').exists()).toBe(true)

      const liElements = wrapper.vm.$el.querySelectorAll('.detail-information .expending-block li')
      for(var i=0; i<liElements.length; i++) {
        const liElement = liElements[i];
        const detailInfo = wrapper.vm.$data.detailInfo[i]
        expect(liElement.querySelector('p.name').textContent.trim()).toEqual(detailInfo.name)
        expect(liElement.querySelector('p.value').textContent.trim()).toEqual(detailInfo.value)
      }
    });
    describe('SwapConfirmationModal.vue Methods', () => {
       
    });
});
