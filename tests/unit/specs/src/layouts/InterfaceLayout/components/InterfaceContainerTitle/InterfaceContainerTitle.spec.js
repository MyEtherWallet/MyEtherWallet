import { shallowMount } from '@vue/test-utils';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle/InterfaceContainerTitle.vue';
import { Tooling } from '@@/helpers';

describe('InterfaceContainerTitle.vue', () => {
  let localVue, i18n, wrapper, store;
  const title = 'InterfaceContainer';
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

  it('should render correct title', () => {
    const hTitle = wrapper.vm.$el.querySelector('.content-title h2');
    expect(hTitle.textContent.trim()).toEqual(title);
  });
});
