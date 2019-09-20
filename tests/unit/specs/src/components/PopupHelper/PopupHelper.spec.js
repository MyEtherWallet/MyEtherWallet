import PopupHelper from '@/components/PopupHelper/PopupHelper.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';

describe('PopupHelper.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(PopupHelper, {
      localVue,
      i18n,
      store,
      attachToDocument: true
    });
  });

  it('should render correct text prop data', () => {
    const text = 'text';
    wrapper.setProps({ text });
    expect(
      wrapper.vm.$el.querySelector('.helper-box p').textContent.trim()
    ).toEqual(text);
  });
});
