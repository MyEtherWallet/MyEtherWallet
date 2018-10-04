import Vue from 'vue';

import { shallowMount } from '@vue/test-utils'
import WhatIsMyEtherWallet from '@/layouts/GettingStarted/components/WhatIsMyEtherWallet/WhatIsMyEtherWallet.vue';


describe('WhatIsMyEtherWallet.vue', () => {
  it('should render correct contents', () => {
    const progressBarValue = 'WhatIsMyEtherWallet progressBarValue';
  
    const wrapper = shallowMount(WhatIsMyEtherWallet, {
      propsData: { progressBarValue }
    });

    console.log('WhatIsMyEtherWallet component:%O', wrapper.vm.$el.querySelector('.block-progressbar__progressbar div').className);
    expect(wrapper.vm.$el.querySelector('.block-progressbar__progressbar div').className.trim()).toEqual(progressBarValue);
  });

  describe('WhatIsMyEtherWallet.vue Methods', () => {});
});
