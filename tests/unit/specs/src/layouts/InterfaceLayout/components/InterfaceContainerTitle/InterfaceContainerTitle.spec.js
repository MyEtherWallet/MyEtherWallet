import { shallowMount } from '@vue/test-utils';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle/InterfaceContainerTitle.vue';

import { Tooling } from '@@/helpers';

const title = 'InterfaceContainerTitle title';

describe('InterfaceContainerTitle.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(InterfaceContainerTitle, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: { title }
    });
  });

  xit('issues:2019-07-19 should render correct title', () => {
    expect(
      wrapper.vm.$el.querySelector('.content-title h2').textContent.trim()
    ).toEqual(title);
  });

  describe('InterfaceContainerTitle.vue Methods', () => {});
});
