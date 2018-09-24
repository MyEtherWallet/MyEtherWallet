import Vue from 'vue';

import { shallowMount } from '@vue/test-utils'
import WhatIfILoseMyKeysOrPassword from '@/layouts/GettingStarted/components/WhatIfILoseMyKeysOrPassword/WhatIfILoseMyKeysOrPassword.vue';


describe('WhatIfILoseMyKeysOrPassword.vue', () => {
  it('should render correct contents', () => {
    const progressBarValue = 'WhatIfILoseMyKeysOrPassword progressBarValue';
  
    const wrapper = shallowMount(WhatIfILoseMyKeysOrPassword, {
      propsData: { progressBarValue }
    });

    console.log('WhatIfILoseMyKeysOrPassword component:%O', wrapper.vm.$el.querySelector('.block-progressbar__progressbar div').className);
    expect(wrapper.vm.$el.querySelector('.block-progressbar__progressbar div').className.trim()).toEqual(progressBarValue);
  });

  describe('WhatIfILoseMyKeysOrPassword.vue Methods', () => {});
});
