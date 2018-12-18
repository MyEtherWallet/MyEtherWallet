import { shallowMount } from '@vue/test-utils';
import WhatIsMyEtherWallet from '@/layouts/GettingStarted/components/WhatIsMyEtherWallet/WhatIsMyEtherWallet.vue';

import { Tooling } from '@@/helpers';

describe('WhatIsMyEtherWallet.vue', () => {
  let localVue, i18n, wrapper, store;
  const progressBarValue = 'Congratulations progressBarValue';

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(WhatIsMyEtherWallet, {
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

  describe('WhatIsMyEtherWallet.vue Methods', () => {});
});
