import Vue from 'vue';

import { shallowMount } from '@vue/test-utils'
import SomeHelpfulTips from '@/layouts/GettingStarted/components/SomeHelpfulTips/SomeHelpfulTips.vue';


describe('SomeHelpfulTips.vue', () => {
  it('should render correct contents', () => {
    const progressBarValue = 'SomeHelpfulTips progressBarValue';
  
    const wrapper = shallowMount(SomeHelpfulTips, {
      propsData: { progressBarValue }
    });

    console.log('SomeHelpfulTips component:%O', wrapper.vm.$el.querySelector('.block-progressbar__progressbar div').className);
    expect(wrapper.vm.$el.querySelector('.block-progressbar__progressbar div').className.trim()).toEqual(progressBarValue);
  });

  describe('SomeHelpfulTips.vue Methods', () => {});
});

