import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import UnitInput from '@/layouts/ConvertUnits/components/UnitInput/UnitInput.vue';

import {
  Tooling
} from '@@/helpers';


describe('UnitInput.vue', () => {
    let localVue, i18n, wrapper, store;
    const content = 'UnitInput content';

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(UnitInput, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          propsData: { content },
     
        });
    });

  it('should render correct contents', () => {
    for(var i=0; i< wrapper.vm.$el.querySelector('.block-left .select-block select').length; i++) {
        const dropDownText = wrapper.vm.$el.querySelector('.block-left .select-block select').options[i].text;
        const unitInputData = wrapper.vm.$data.leftDropDown[i].label;
        expect(dropDownText.trim()).toEqual(unitInputData);
    }

    for(var i=0; i< wrapper.vm.$el.querySelector('.block-right .select-block select').length; i++) {
        const dropDownText = wrapper.vm.$el.querySelector('.block-right .select-block select').options[i].text;
        const unitInputData = wrapper.vm.$data.rightDropDown[i].label;
        expect(dropDownText.trim()).toEqual(unitInputData);
    }

  });

  describe('UnitInput.vue Methods', () => {});
});
