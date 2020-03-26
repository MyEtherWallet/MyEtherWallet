import { shallowMount } from '@vue/test-utils';
import Social from '@/layouts/HomeLayout/components/Social/Social.vue';
import { Tooling } from '@@/helpers';

describe('Social.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(Social, {
      localVue,
      i18n,
      store,
      attachToDocument: true
    });
  });

  it('should have correct data', () => {
    expect(wrapper.vm.$data.links.length).toBe(5);
  });
  afterEach(() => {
    wrapper.destroy();
    wrapper = null;
  });

  it('should render correct contents', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('Should dismount component', () => {
    wrapper.destroy();
    expect(wrapper.exists()).toBe(false);
  });
});
