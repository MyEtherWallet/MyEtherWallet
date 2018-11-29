import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import InterfaceBalance from '@/layouts/InterfaceLayout/components/InterfaceBalance/InterfaceBalance.vue';
import InterfaceBalanceModal from '@/layouts/InterfaceLayout/components/InterfaceBalanceModal/InterfaceBalanceModal.vue';
import sinon from 'sinon';
import {
  Tooling
} from '@@/helpers';


let showModal = sinon.stub();
const BModalStub = {
  name:'b-modal',
  template:'<div><slot></slot></div>',
  props:['to'],
  methods: {
    show: showModal
  }
}

const $t = ()=>{}
describe('InterfaceBalance.vue', () => {
	let localVue, i18n, wrapper, store;
    const balance = '100';
    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(InterfaceBalance, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          propsData: {
            balance:balance
          },
          stubs: {
            'b-modal':BModalStub,
            'interface-balance-modal': InterfaceBalanceModal
          }
        });
    });

  xit('[FAILING MAX STACK] should render correct contents', () => {
    expect(wrapper.vm.$el.querySelector('.balance-text p').textContent.trim()).toEqual(balance);


  });

  describe('InterfaceBalance.vue Methods', () => {
    xit('[FAILING MAX STACK] should render correct balanceModalOpen method', ()=>{
      wrapper.vm.balanceModalOpen();
      expect(showModal.called).toBe(true);
    });

    xit('[FAILING MAX STACK] should open balance modal when button clicked', () => {
        const divElements = wrapper.findAll('div');
        for(var i =0 ; i<divElements.length; i++) {
          let divElement = divElements.at(i);
          if(divElement.classes().length == 0) {
            divElement.trigger('click');
          }
        }
        expect(showModal.called).toBe(true);
    });
  });
});
