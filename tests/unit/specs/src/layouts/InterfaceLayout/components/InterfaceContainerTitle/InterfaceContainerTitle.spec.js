import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle/InterfaceContainerTitle.vue';

describe('InterfaceContainerTitle.vue', () => {
  it('should render correct contents', () => {
    const title = 'InterfaceContainerTitle title';
  
    const wrapper = shallowMount(InterfaceContainerTitle, {
      propsData: { title }
    });

    console.log('InterfaceContainerTitle component title:%O', wrapper.vm.$el.querySelector('.content-title h2').textContent.trim());
    expect(wrapper.vm.$el.querySelector('.content-title h2').textContent.trim()).toEqual(title);
  });

  describe('InterfaceContainerTitle.vue Methods', () => {});
});
