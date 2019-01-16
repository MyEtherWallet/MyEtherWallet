import InterfaceBottomText from '@/components/InterfaceBottomText/InterfaceBottomText.vue';
import { shallowMount } from '@vue/test-utils';

import { Tooling } from '@@/helpers';

describe('InterfaceBottomText.vue', () => {
  let localVue, i18n, wrapper, store;
  const link = 'link';
  const linkText = 'linkText';
  const question = 'question';
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(InterfaceBottomText, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: { link, linkText, question }
    });
  });

  it('should render correct question', () => {
    const divText = wrapper.vm.$el.querySelector('div p').textContent.trim();
    expect(divText.indexOf(question)).toBeGreaterThan(-1);
    expect(divText.indexOf(linkText)).toBeGreaterThan(-1);
  });

  it('should render correct linkText', () => {
    expect(wrapper.vm.$el.querySelector('div p a').textContent.trim()).toEqual(
      linkText
    );
  });

  it('should render correct link', () => {
    expect(
      wrapper.vm.$el.querySelector('div p a').getAttribute('href')
    ).toEqual(link);
  });

  describe('InterfaceBottomText.vue Methods', () => {});
});
