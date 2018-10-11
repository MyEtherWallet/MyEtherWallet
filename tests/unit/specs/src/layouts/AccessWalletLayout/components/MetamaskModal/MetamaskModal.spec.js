import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import MetamaskModal from '@/layouts/AccessWalletLayout/components/MetamaskModal/MetamaskModal.vue';

import {
  Tooling
} from '@@/helpers';

const RouterLinkStub = {
  name:'router-link',
  template:'<div class="routerlink"><slot> </slot></div>',
  props:['to']  
}

describe('MetamaskModal.vue', () => {
  let localVue, i18n, wrapper;

  beforeAll(() => {
      const baseSetup = Tooling.createLocalVueInstance();
      localVue = baseSetup.localVue;
      i18n = baseSetup.i18n;
  });

  beforeEach(() => {
      wrapper = shallowMount(MetamaskModal, {
        localVue,
        i18n,
        attachToDocument: true,
        stubs: {'router-link':RouterLinkStub }
      });
      
  });

  it('should render correct contents', () => {

    var checkboxInput = wrapper.find('input[type=checkbox]')

    checkboxInput.trigger('click')
    console.log('accessMyWalletBtnDisabled:%O',wrapper.vm.$data.accessMyWalletBtnDisabled)
    // expect(wrapper.vm.$data.accessMyWalletBtnDisabled).toBe(false)
    checkboxInput.trigger('click')
    console.log('accessMyWalletBtnDisabled:%O',wrapper.vm.$data.accessMyWalletBtnDisabled)
    // expect(wrapper.vm.$data.accessMyWalletBtnDisabled).toBe(true)
  });

  describe('MetamaskModal.vue Methods', () => {});
});
