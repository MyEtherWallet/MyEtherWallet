import { shallowMount } from '@vue/test-utils';
import SomeHelpfulTips from '@/layouts/GettingStarted/components/SomeHelpfulTips/SomeHelpfulTips.vue';
import { Tooling } from '@@/helpers';

describe('SomeHelpfulTips.vue', () => {
  let localVue, i18n, wrapper, store;
  const progressBarValue = 'Congratulations progressBarValue';

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(SomeHelpfulTips, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: { progressBarValue }
    });
  });

  it('should render correct contents', () => {
    expect(
      wrapper.vm.$el
        .querySelector('.block-progressbar__progressbar div')
        .className.trim()
    ).toEqual(progressBarValue);
  });

  describe('SomeHelpfulTips.vue Methods', () => {});
});
