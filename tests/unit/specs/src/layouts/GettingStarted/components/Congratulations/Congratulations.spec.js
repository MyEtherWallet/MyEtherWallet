import Vue from 'vue';

import { shallowMount } from '@vue/test-utils'
import Congratulations from '@/layouts/GettingStarted/components/Congratulations/Congratulations.vue';

const RouterLinkStub = {
  name:'router-link',
  template:'<div class="routerlink"><slot> </slot></div>',
  props:['to']  
}

describe('Congratulations.vue', () => {
  it('should render correct contents', () => {
    const progressBarValue = 'Congratulations progressBarValue';
  
    const wrapper = shallowMount(Congratulations, {
      propsData: { progressBarValue },
      stubs: {'router-link':RouterLinkStub }
    });

    console.log('Congratulations component:%O', wrapper.vm.$el.querySelector('.block-progressbar__progressbar div').className);
    expect(wrapper.vm.$el.querySelector('.block-progressbar__progressbar div').className.trim()).toEqual(progressBarValue);
  });

  describe('Congratulations.vue Methods', () => {});
});

