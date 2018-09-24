import Vue from 'vue';

import { shallowMount } from '@vue/test-utils'
import WhereAreMyFundsStored from '@/layouts/GettingStarted/components/WhereAreMyFundsStored/WhereAreMyFundsStored.vue';


describe('WhereAreMyFundsStored.vue', () => {
  it('should render correct contents', () => {
    const progressBarValue = 'WhereAreMyFundsStored progressBarValue';
  
    const wrapper = shallowMount(WhereAreMyFundsStored, {
      propsData: { progressBarValue }
    });

    console.log('WhereAreMyFundsStored component:%O', wrapper.vm.$el.querySelector('.block-progressbar__progressbar div').className);
    expect(wrapper.vm.$el.querySelector('.block-progressbar__progressbar div').className.trim()).toEqual(progressBarValue);
  });

  it('validate address when dropdown is selected', () => {
    const wrapper = shallowMount(WhereAreMyFundsStored);
    const dropdownOpen = wrapper.find('.switch input');
    dropdownOpen.trigger('click');
    console.log('Dropdown is opened');
    expect(wrapper.vm.$el.querySelector('.block-progressbar__sliding-switch-expender').getElementsByClassName('content').length).toEqual(1);
    dropdownOpen.trigger('click');
    console.log('Dropdown is closed');
    expect(wrapper.vm.$el.querySelector('.block-progressbar__sliding-switch-expender').getElementsByClassName('content').length).toEqual(0);
  });
  describe('WhereAreMyFundsStored.vue Methods', () => {});
});

