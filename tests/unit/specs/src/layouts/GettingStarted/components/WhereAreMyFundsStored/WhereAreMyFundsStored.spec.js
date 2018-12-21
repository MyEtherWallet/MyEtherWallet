import { shallowMount } from '@vue/test-utils';
import WhereAreMyFundsStored from '@/layouts/GettingStarted/components/WhereAreMyFundsStored/WhereAreMyFundsStored.vue';
import { Tooling } from '@@/helpers';

describe('WhereAreMyFundsStored.vue', () => {
  let localVue, i18n, wrapper, store;
  const progressBarValue = 'Congratulations progressBarValue';

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(WhereAreMyFundsStored, {
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

  it('validate address when dropdown is selected', () => {
    const dropdownOpen = wrapper.find('.switch input');
    dropdownOpen.trigger('click');
    expect(
      wrapper.vm.$el
        .querySelector('.block-progressbar__sliding-switch-expender')
        .getElementsByClassName('content').length
    ).toEqual(1);
    dropdownOpen.trigger('click');
    expect(
      wrapper.vm.$el
        .querySelector('.block-progressbar__sliding-switch-expender')
        .getElementsByClassName('content').length
    ).toEqual(0);
  });
  describe('WhereAreMyFundsStored.vue Methods', () => {});
});
