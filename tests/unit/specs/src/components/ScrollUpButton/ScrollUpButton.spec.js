import Vue from 'vue';
import ScrollUpButton from '@/components/ScrollUpButton/ScrollUpButton.vue';

import { shallowMount } from '@vue/test-utils'


describe('ScrollUpButton.vue', () => {
  window.scrollTo = ( x, y)=>{ window.pageXOffset = x; window.pageYOffset= y;};
  it('should render correct contents', () => {
    const wrapper = shallowMount(ScrollUpButton, {});
    const buttonBlock = wrapper.find('.button-block');

    window.pageXOffset = 100;
    window.pageYOffset = 100;
    console.log('before scroll window pageXOffset: %O' , window.pageXOffset);
    console.log('before scroll window pageYOffset: %O' , window.pageYOffset);

    buttonBlock.trigger('click');

    console.log('after scroll window pageXOffset: %O' , window.pageXOffset);
    console.log('afer scroll window pageYOffset: %O' , window.pageYOffset);

    expect(window.pageXOffset).toBe(0);
    expect(window.pageYOffset).toBe(0);

  });

  describe('ScrollUpButton.vue Methods', () => {});
});
