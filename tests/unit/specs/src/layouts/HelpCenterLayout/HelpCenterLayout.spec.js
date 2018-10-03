import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import HelpCenterLayout from '@/layouts/HelpCenterLayout/HelpCenterLayout.vue';

import {
  Tooling
} from '@@/helpers';


describe('HelpCenterLayout.vue', () => {
  let localVue, i18n, wrapper, store;

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(HelpCenterLayout, {
          localVue,
          i18n,
          store,
          attachToDocument: true
        });
    });

  it('should render correct contents', () => {    
    var activeSpan = wrapper.findAll('.switcher span').at(1);
    activeSpan.trigger('click');

    expect(wrapper.vm.$data.openFAQs).toBe(false)
    expect(wrapper.vm.$data.openCategories).toBe(true)

    var activeSpan = wrapper.findAll('.switcher span').at(0);
    activeSpan.trigger('click');

    expect(wrapper.vm.$data.openFAQs).toBe(true)
    expect(wrapper.vm.$data.openCategories).toBe(false)

  });

  describe('HelpCenterLayout.vue Methods', () => {});
});
