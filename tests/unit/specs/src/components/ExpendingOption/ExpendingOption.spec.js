import ExpandingOption from '@/components/ExpandingOption/ExpandingOption.vue';
import { shallowMount } from '@vue/test-utils';

import { Tooling } from '@@/helpers';

describe('ExpandingOption.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(ExpandingOption, {
      localVue,
      i18n,
      store,
      attachToDocument: true
    });
  });

  it('should render correct title props', () => {
    const title = 'title';
    wrapper.setProps({ title });
    expect(
      wrapper.vm.$el
        .querySelector('.title-bar-container .input-title')
        .textContent.trim()
    ).toEqual(title);
  });

  it('should render correct hidebottomborder props', () => {
    expect(
      wrapper
        .find('.expanding-option')
        .classes()
        .indexOf('hide-bottom-border')
    ).toBe(-1);
    wrapper.setProps({ hidebottomborder: true });
    expect(
      wrapper
        .find('.expanding-option')
        .classes()
        .indexOf('hide-bottom-border')
    ).toBeGreaterThan(-1);
  });

  it('should render correct expanded data', () => {
    expect(
      wrapper
        .find('.contnet-container')
        .classes()
        .indexOf('expanded')
    ).toBe(-1);
    wrapper.setData({ expanded: true });
    expect(
      wrapper
        .find('.contnet-container')
        .classes()
        .indexOf('expanded')
    ).toBeGreaterThan(-1);
  });
  describe('ExpandingOption.vue Methods', () => {
    it('should toggle expanded data when click checkbox', () => {
      expect(wrapper.vm.$data.expanded).toBe(false);
      wrapper.find('label.switch input').trigger('click');
      expect(wrapper.vm.$data.expanded).toBe(true);
    });
  });
});
