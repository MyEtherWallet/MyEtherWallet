import Vue from 'vue';
import StandardDropdown from '@/components/StandardDropdown/StandardDropdown.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';

describe('StandardDropdown.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(StandardDropdown, {
      localVue,
      i18n,
      store,
      attachToDocument: true
    });
  });

  it('should render correct placeholder props', () => {
    const placeholder = 'placeholder';
    wrapper.setProps({ placeholder });
    expect(
      wrapper.vm.$el.querySelector('.placeholder').textContent.trim()
    ).toEqual(placeholder);
  });

  it('should render correct chosenValue data', () => {
    expect(wrapper.find('.placeholder').exists()).toBe(true);
    const chosenValue = 'chosenValue';
    wrapper.setData({ chosenValue });
    expect(
      wrapper.vm.$el.querySelector('.dropdown-button p').textContent.trim()
    ).toEqual(chosenValue);
    expect(wrapper.find('.placeholder').exists()).toBe(false);
  });

  it('should render correct search data', () => {
    const search = 'search';
    wrapper.setData({ search });
    wrapper.setData({ open: true });
    expect(
      wrapper.vm.$el.querySelector('.dropdown-search-container input').value
    ).toEqual(search);
  });

  it('should render correct open data', () => {
    let open = true;
    wrapper.setData({ open });
    expect(wrapper.find('.dropdown-search-container').exists()).toBe(true);
    open = false;
    wrapper.setData({ open });
    expect(wrapper.find('.dropdown-search-container').exists()).toBe(false);
  });

  describe('StandardDropdown.vue Methods', () => {
    it('should toggle open data when button clicked', () => {
      wrapper.find('.dropdown-button').trigger('click');
      expect(wrapper.vm.$data.open).toBe(true);
      wrapper.find('.dropdown-button').trigger('click');
      expect(wrapper.vm.$data.open).toBe(false);
    });
  });
});
