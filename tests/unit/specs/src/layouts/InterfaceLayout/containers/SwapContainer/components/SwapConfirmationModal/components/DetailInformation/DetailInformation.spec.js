import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import DetailInformation from '@/layouts/InterfaceLayout/containers/SwapContainer/components/SwapConfirmationModal/components/DetailInformation/DetailInformation.vue';
import {
  Tooling
} from '@@/helpers';

const  detailInfos = [
        {
          name: 'Network',
          value: 'ETH by mytherapi.com'
        },
        {
          name: 'Gas Limit',
          value: '21000'
        },
        {
          name: 'Gas Price',
          value: '210000 Gwei (0.00321 ETH=$1.234)'
        },
        {
          name: 'Max Transaction Fee',
          value: '441000 Gwei (0.000441 ETH)'
        },
        {
          name: 'Nonce',
          value: '0'
        },
        {
          name: 'Data',
          value: 'None'
        }
      ]

describe('DetailInformation.vue', () => {
    let localVue, i18n, wrapper, store;
    const resetView = jest.fn(()=> console.log('resetView function called'))
    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(DetailInformation, {
          localVue,
          i18n,
          store,
          attachToDocument: true
        });
    });

    it('should render correct fromArray to currenPicker element', () => { 
      wrapper.find('.detail-information input').trigger('click')
      expect(wrapper.find('.detail-information .expending-block').exists()).toBe(true)

      const liElements = wrapper.vm.$el.querySelectorAll('.detail-information .expending-block li')
      for(var i=0; i<liElements.length; i++) {
        const liElement = liElements[i];
        const detailInfo = detailInfos[i]
        expect(liElement.querySelector('p.name').textContent.trim()).toEqual(detailInfo.name)
        expect(liElement.querySelector('p.value').textContent.trim()).toEqual(detailInfo.value)
      }
    });

    describe('DetailInformation.vue Methods', () => {
       it('should change isExpended when checkbutton clicked', () => { 
        expect(wrapper.vm.$data.isExpended).toBe(false)
        wrapper.find('.detail-information input').trigger('click')
        expect(wrapper.vm.$data.isExpended).toBe(true)
      });
    });
});
