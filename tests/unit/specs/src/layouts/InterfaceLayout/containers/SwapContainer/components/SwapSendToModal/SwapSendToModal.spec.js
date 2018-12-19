import Vue from 'vue';
import sinon from 'sinon';
import { shallowMount } from '@vue/test-utils'
import SwapSendToModal from '@/layouts/InterfaceLayout/containers/SwapContainer/components/SwapSendToModal/SwapSendToModal.vue';
import {
  Tooling
} from '@@/helpers';

const showModal = sinon.stub();
const hideModal = sinon.stub();
const BModalStub = {
  name:'b-modal',
  template:'<div><slot></slot></div>',
  props:['to'],
  methods: {
    show: showModal,
    hide: hideModal
  }  
};

describe('SwapSendToModal.vue', () => {
   let localVue, i18n, wrapper, store;

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
        Vue.config.errorHandler = () => {};
        Vue.config.warnHandler = () => {};
    });

    beforeEach(() => {
        wrapper = shallowMount(SwapSendToModal, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          stubs: {
            'b-modal':BModalStub
          }
        });
    });

    it('should render correct fromAddress data', () => {
      expect(wrapper.vm.$el.querySelector('.from-address .value').textContent.trim()).toEqual(wrapper.vm.$data.fromAddress.value + " " + wrapper.vm.$data.fromAddress.name); 
      expect(wrapper.vm.$el.querySelector('.from-address .address').textContent).toEqual(wrapper.vm.$data.fromAddress.address);
    });


    it('should render correct toAddress data', () => {
      expect(wrapper.vm.$el.querySelector('.to-address .value').textContent.trim()).toEqual(wrapper.vm.$data.toAddress.value + " " + wrapper.vm.$data.toAddress.name); 
      expect(wrapper.vm.$el.querySelector('.to-address .address').textContent).toEqual(wrapper.vm.$data.toAddress.address);
    });

    it('should render correct confirm send button' , () => {
      expect(wrapper.vm.$el.querySelector('.confirm-send-button h4').textContent.trim().indexOf(wrapper.vm.$data.fromAddress.value)).toBeGreaterThan(-1);
      expect(wrapper.vm.$el.querySelector('.confirm-send-button h4').textContent.trim().indexOf(wrapper.vm.$data.fromAddress.name)).toBeGreaterThan(-1);
    });

    it('should render correct fromFiat data', () => {
       expect(wrapper.find('.confirm-send-button').isVisible()).toBe(true);
       wrapper.setData({fromFiat:true});
       expect(wrapper.find('.confirm-send-button').isVisible()).toBe(false);
    }); 

    it('should render correct swapDetails props' , () => {
       let swapDetails  = {
                dataForInitialization:true,
                fromCurrency: 'ETC',
                fromValue: '1.0000000',
                fromAddress: '0xF54F78F67feCDd37e0C009aB4cCD6549A69540D4',
                toCurrency: 'ETH',
                toValue : '0.0034523',
                toAddress: '0xF54F78F67feCDd37e0C009aB4cCD6549A69540D4'
              };  
      wrapper.setProps({swapDetails});
      
      expect(wrapper.vm.$data.fromAddress.value).toEqual(swapDetails.fromValue);
      expect(wrapper.vm.$data.fromAddress.name).toEqual(swapDetails.fromCurrency);
      expect(wrapper.vm.$data.fromAddress.address).toEqual(swapDetails.fromAddress);
      
      expect(wrapper.vm.$data.toAddress.value).toEqual(swapDetails.toValue);
      expect(wrapper.vm.$data.toAddress.name).toEqual(swapDetails.toCurrency);
      expect(wrapper.vm.$data.toAddress.address).toEqual(swapDetails.toAddress);
    });

    describe('SwapSendToModal.vue Methods', () => {
      it('should render correct redirectToPartner method', () => {
        let swapDetails  = {
          dataForInitialization:true,
        };


        wrapper.setProps({swapDetails})
        wrapper.vm.redirectToPartner();
        expect(hideModal.called).toBe(true);
      });
    });
});
