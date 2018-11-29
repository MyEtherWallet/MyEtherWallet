import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import HardwarePasswordModal from '@/layouts/AccessWalletLayout/components/HardwarePasswordModal/HardwarePasswordModal.vue';

import {
  Tooling
} from '@@/helpers';


describe('HardwarePasswordModal.vue', () => {
    let localVue, i18n, wrapper, store;

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(HardwarePasswordModal, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
        });
    });



  xit('[FAILING MAX STACK] should render correct error data', () => {
    const error = 'error';
    wrapper.setData({error});
    expect(wrapper.find('p.error').text()).toEqual( error );
  });

   xit('[FAILING MAX STACK] should render correct password data', () => {
    const password = 'password';
    wrapper.setData({password})
    expect(wrapper.vm.$el.querySelector('.input-container input').value).toEqual(password);
  });

  xit('[FAILING MAX STACK] should render correct hardwareBrand props', () => {
    const hardwareBrand = 'hardwareBrand';
    wrapper.setProps({hardwareBrand})
    expect(wrapper.find('.submit-button').text().indexOf(hardwareBrand)).toBeGreaterThan(-1)
  });

  describe('HardwarePasswordModal.vue Methods', () => {
    xit('[FAILING MAX STACK] should change password data when input triggers', () => {
      var inputElement = wrapper.find('.input-container input')
      var inputText= 'testpassword';
      inputElement.setValue(inputText);
      inputElement.trigger('change');
      expect(wrapper.vm.$data.password).toBe(inputText);
    });

     xit('[FAILING MAX STACK] should change show data when button click', () => {
        var imgElement = wrapper.find('.input-container img')
        imgElement.trigger('click')
        expect(wrapper.vm.$data.show).toBe(true)
        imgElement = wrapper.find('.input-container img')
        imgElement.trigger('click')
        expect(wrapper.vm.$data.show).toBe(false)
    });
  });
});
