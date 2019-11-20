import BottomHelpLink from '@/components/BottomHelpLink/BottomHelpLink.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';

describe('BottomHelpLink.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(BottomHelpLink, {
      localVue,
      i18n,
      store,
      attachToDocument: true
    });
  });

  it('should render correct issues props data', () => {
    expect(wrapper.find('.issues').exists()).toBe(true);
    const type = '';
    wrapper.setProps({ type });
    expect(wrapper.find('.issues').exists()).toBe(false);
  });
});
