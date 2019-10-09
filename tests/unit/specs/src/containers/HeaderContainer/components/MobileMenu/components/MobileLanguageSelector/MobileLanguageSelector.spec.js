import MobileLanguageSelector from '@/containers/HeaderContainer/components/MobileMenu/components/MobileLanguageSelector/MobileLanguageSelector.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';

xdescribe('MobileLanguageSelector.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(MobileLanguageSelector, {
      localVue,
      i18n,
      store,
      attachToDocument: true
    });
  });

  it('should render correct menuOpen data', () => {
    wrapper.setData({ menuOpen: true });
    expect(
      wrapper
        .find('.mobile-language-selector')
        .classes()
        .indexOf('open')
    ).toBeGreaterThan(-1);
    wrapper.setData({ menuOpen: false });
    expect(
      wrapper
        .find('.mobile-language-selector')
        .classes()
        .indexOf('open')
    ).toBe(-1);
  });

  it('should render correct open props', () => {
    wrapper.setProps({ open: true });
    expect(wrapper.vm.$data.menuOpen).toBe(wrapper.props().open);
  });

  it('should render correct supportedLanguages data', () => {
    const liElements = wrapper.vm.$el.querySelectorAll(
      '.language-menu-content-container ul li'
    );
    for (let i = 0; i < liElements.length; i++) {
      // eslint-disable-next-line
      const liElement = liElements[i];
    }
  });
});
