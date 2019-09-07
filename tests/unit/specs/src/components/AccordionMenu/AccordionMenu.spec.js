import AccordionMenu from '@/components/AccordionMenu/AccordionMenu.vue';
import { shallowMount } from '@vue/test-utils';

import { Tooling } from '@@/helpers';

describe('AccordionMenu.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(AccordionMenu, {
      localVue,
      i18n,
      store,
      attachToDocument: true
    });
  });

  it('should render correct greytitle props', () => {
    expect(
      wrapper
        .find('.menu-title')
        .classes()
        .indexOf('grey-title')
    ).toBe(-1);
    wrapper.setProps({ greytitle: true });
    expect(
      wrapper
        .find('.menu-title')
        .classes()
        .indexOf('grey-title')
    ).toBeGreaterThan(-1);
  });

  it('should render correct number props', () => {
    wrapper.setProps({ number: String(100) });
    expect(
      wrapper.vm.$el.querySelector('.title-number span').textContent.trim()
    ).toEqual(wrapper.props().number);
  });

  it('should render correct title props', () => {
    const title = 'title';
    wrapper.setProps({ title });
    expect(
      wrapper.vm.$el.querySelectorAll('.menu-title div')[1].textContent.trim()
    ).toEqual(title);
  });

  it('should render correct isopen props', () => {
    expect(
      wrapper
        .find('.wrap')
        .classes()
        .indexOf('opened')
    ).toBe(-1);
    wrapper.setProps({ isopen: true });
    expect(
      wrapper
        .find('.wrap')
        .classes()
        .indexOf('opened')
    ).toBeGreaterThan(-1);
  });

  it('should render correct rightText props', () => {
    expect(wrapper.find('.edit-button').exists()).toBe(false);
    wrapper.setProps({ rightText: 'rightText' });
    expect(wrapper.find('.edit-button').exists()).toBe(true);
    expect(
      wrapper.vm.$el.querySelector('.edit-button').textContent.trim()
    ).toEqual(wrapper.props().rightText);
  });

  describe('AccordionMenu.vue Methods', () => {
    it('should emit `titleClicked` when button clicked', () => {
      wrapper.find('.menu-title').trigger('click');
      expect(wrapper.emitted().titleClicked).toBeTruthy();
    });
  });
});
