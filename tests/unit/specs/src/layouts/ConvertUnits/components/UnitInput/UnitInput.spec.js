import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import UnitInput from '@/layouts/ConvertUnits/components/UnitInput/UnitInput.vue';

import {
  Tooling
} from '@@/helpers';


describe('UnitInput.vue', () => {
    let localVue, i18n, wrapper, store;

    let options = ['Wei','Kwei','Mwei','Gwei','Szabo'];
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
          propsData: { options },

        });
    });

  it('should render correct valueLeft data', () => {
    expect(wrapper.vm.$el.querySelector('.block-left input').value).toEqual(String(wrapper.vm.$data.valueLeft));
  });

  it('should render correct valueRight data', () => {
    expect(wrapper.vm.$el.querySelector('.block-right input').value).toEqual(String(wrapper.vm.$data.valueRight));
  });

  xit('[FAILING] should render correct options data', () => {
       for(var i=0; i< wrapper.vm.$el.querySelector('.block-right .select-block select').length; i++) {
        const dropDownText = wrapper.vm.$el.querySelector('.block-right .select-block select').options[i].text;
        expect(dropDownText.trim()).toEqual(options[i]);
    }
  });
  describe('UnitInput.vue Methods', () => {});
});
