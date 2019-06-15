import Vue from 'vue';
import CheckBox from '@/components/CheckBox/CheckBox.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';

describe('IssuesLogModal.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(CheckBox, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
    });
  });

  it('should render correct terms props', () => {
    expect(wrapper.find('.terms').exists()).toBe(false);
    wrapper.setProps({terms: true});
    expect(wrapper.find('.terms').exists()).toBe(true);
  });

  describe('CheckBox.vue Methods', () => {
   it('should switch checkboxChecked data when button clicked', () => {
    wrapper.find('.check-box-container input').trigger('click');
    expect(wrapper.vm.$data.checkboxChecked).toBe(true);
    wrapper.find('.check-box-container input').trigger('click');
    expect(wrapper.vm.$data.checkboxChecked).toBe(false);
   })
  });
});
