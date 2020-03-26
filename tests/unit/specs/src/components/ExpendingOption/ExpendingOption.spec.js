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

  afterEach(() => {
    wrapper.destroy();
    wrapper = null;
  });

  it('should render correct title props', async () => {
    const title = 'title';
    wrapper.setProps({ title });
    await wrapper.vm.$nextTick();
    expect(
      wrapper.vm.$el
        .querySelector('.title-bar-container .input-title')
        .textContent.trim()
    ).toEqual(title);
  });

  it('should render correct hidebottomborder props', async () => {
    expect(
      wrapper
        .find('.expanding-option')
        .classes()
        .indexOf('hide-bottom-border')
    ).toBe(-1);
    wrapper.setProps({ hidebottomborder: true });
    await wrapper.vm.$nextTick();
    expect(
      wrapper
        .find('.expanding-option')
        .classes()
        .indexOf('hide-bottom-border')
    ).toBeGreaterThan(-1);
  });

  it('should render correct expanded data', async () => {
    expect(
      wrapper
        .find('.contnet-container')
        .classes()
        .indexOf('expanded')
    ).toBe(-1);
    wrapper.setData({ expanded: true });
    await wrapper.vm.$nextTick();
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

  it('should dismount properly', () => {
    expect(wrapper.destroy()).toBe(undefined);
  });
});
