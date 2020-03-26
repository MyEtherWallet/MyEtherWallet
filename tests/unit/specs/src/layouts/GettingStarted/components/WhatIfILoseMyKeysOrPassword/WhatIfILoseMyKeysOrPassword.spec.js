import { shallowMount } from '@vue/test-utils';
import WhatIfILoseMyKeysOrPassword from '@/layouts/GettingStarted/components/WhatIfILoseMyKeysOrPassword/WhatIfILoseMyKeysOrPassword.vue';
import { Tooling } from '@@/helpers';

describe('WhatIfILoseMyKeysOrPassword.vue', () => {
  let localVue, i18n, wrapper, store;
  const progressBarValue = 'Congratulations progressBarValue';

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(WhatIfILoseMyKeysOrPassword, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: { progressBarValue }
    });
  });

  afterEach(() => {
    wrapper.destroy();
    wrapper = null;
  });

  it('should render correct contents', () => {
    expect(
      wrapper.vm.$el
        .querySelector('.block-progressbar__progressbar div')
        .className.trim()
    ).toEqual(progressBarValue);
  });

  describe('WhatIfILoseMyKeysOrPassword.vue Methods', () => {});

  it('should dismount properly', () => {
    expect(wrapper.destroy()).toBe(undefined);
  });
});
