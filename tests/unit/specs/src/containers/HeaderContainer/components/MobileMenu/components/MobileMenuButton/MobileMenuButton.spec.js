import MobileMenuButton from '@/containers/HeaderContainer/components/MobileMenu/components/MobileMenuButton/MobileMenuButton.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';

describe('MobileMenuButton.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(MobileMenuButton, {
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

  it('should render correct isMobileMenuOpen data', async () => {
    wrapper.setData({ isMobileMenuOpen: true });
    await wrapper.vm.$nextTick();
    expect(
      wrapper
        .find('.menu-button')
        .classes()
        .indexOf('menu-open')
    ).toBeGreaterThan(-1);
    wrapper.setData({ isMobileMenuOpen: false });
    await wrapper.vm.$nextTick();
    expect(
      wrapper
        .find('.menu-button')
        .classes()
        .indexOf('menu-open')
    ).toBe(-1);
  });

  it('should render correct ismenuopen props', async () => {
    wrapper.setProps({ ismenuopen: true });
    await wrapper.vm.$nextTick();
    expect(
      wrapper
        .find('.menu-button')
        .classes()
        .indexOf('menu-open')
    ).toBeGreaterThan(-1);
    wrapper.setProps({ ismenuopen: false });
    await wrapper.vm.$nextTick();
    expect(
      wrapper
        .find('.menu-button')
        .classes()
        .indexOf('menu-open')
    ).toBe(-1);
  });

  describe('MobileMenuButton.vue Methods', () => {
    it('should change isMobileMenuOpen data when button clicked', async () => {
      wrapper.find('.menu-button').trigger('click');
      await wrapper.vm.$nextTick();
      expect(
        wrapper
          .find('.menu-button')
          .classes()
          .indexOf('menu-open')
      ).toBeGreaterThan(-1);
      wrapper.find('.menu-button').trigger('click');
      await wrapper.vm.$nextTick();
      expect(
        wrapper
          .find('.menu-button')
          .classes()
          .indexOf('menu-open')
      ).toBe(-1);
    });
  });

  it('should dismount properly', () => {
    expect(wrapper.destroy()).toBe(undefined);
  });
});
