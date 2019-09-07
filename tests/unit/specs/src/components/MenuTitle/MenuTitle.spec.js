import MenuTitle from '@/components/MenuTitle/MenuTitle.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';
import Vue from 'vue';

describe('MenuTitle.vue', () => {
  let localVue, i18n, wrapper, store;
  const title = 'title';
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(MenuTitle, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      props: { title }
    });
  });

  it('should render correct title props', () => {
    wrapper.setData({ title });
    expect(
      wrapper.vm.$el.querySelector('.the-title').textContent.trim()
    ).toEqual(title);
  });

  describe('MenuTitle.vue Methods', () => {});
});
