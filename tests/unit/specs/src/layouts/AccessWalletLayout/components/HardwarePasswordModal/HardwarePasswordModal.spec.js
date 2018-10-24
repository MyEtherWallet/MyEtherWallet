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

  it('should render correct contents', () => {
    var imgElement = wrapper.find('.input-container img')
    imgElement.trigger('click')
    expect(wrapper.vm.$data.show).toBe(true)
    imgElement = wrapper.find('.input-container img')
    imgElement.trigger('click')
    expect(wrapper.vm.$data.show).toBe(false)
    var inputElement = wrapper.find('.input-container input')

    var inputText= 'testpassword'
    inputElement.setValue(inputText)
    inputElement.trigger('change')
    expect(wrapper.vm.$data.password).toBe(inputText)
  });

  describe('HardwarePasswordModal.vue Methods', () => {});
});
