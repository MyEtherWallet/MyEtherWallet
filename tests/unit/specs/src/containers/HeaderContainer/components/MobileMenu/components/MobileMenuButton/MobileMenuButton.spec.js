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

  xit('should render correct isMobileMenuOpen data', () => {
    wrapper.setData({ isMobileMenuOpen: true });
    expect(
      wrapper
        .find('.menu-button')
        .classes()
        .indexOf('menu-open')
    ).toBeGreaterThan(-1);
    wrapper.setData({ isMobileMenuOpen: false });
    expect(
      wrapper
        .find('.menu-button')
        .classes()
        .indexOf('menu-open')
    ).toBe(-1);
  });

  xit('should render correct ismenuopen props', () => {
    wrapper.setProps({ ismenuopen: true });
    expect(
      wrapper
        .find('.menu-button')
        .classes()
        .indexOf('menu-open')
    ).toBeGreaterThan(-1);
    wrapper.setProps({ ismenuopen: false });
    expect(
      wrapper
        .find('.menu-button')
        .classes()
        .indexOf('menu-open')
    ).toBe(-1);
  });

  describe('MobileMenuButton.vue Methods', () => {
    xit('should change isMobileMenuOpen data when button clicked', () => {
      wrapper.find('.menu-button').trigger('click');
      expect(
        wrapper
          .find('.menu-button')
          .classes()
          .indexOf('menu-open')
      ).toBeGreaterThan(-1);
      wrapper.find('.menu-button').trigger('click');
      expect(
        wrapper
          .find('.menu-button')
          .classes()
          .indexOf('menu-open')
      ).toBe(-1);
    });
  });
});
