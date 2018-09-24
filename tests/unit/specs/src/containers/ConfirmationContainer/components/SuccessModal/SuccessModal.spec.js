import Vue from 'vue';

import { shallowMount } from '@vue/test-utils'
import SuccessModal from '@/containers/ConfirmationContainer/components/SuccessModal/SuccessModal.vue';

describe('SuccessModal.vue', () => {
  it('should render correct contents', () => {
      const message = 'message'
      const linkMessage = 'linkMessage'
      const linkTo = 'linkTo';
      const wrapper = shallowMount(SuccessModal, {
        propsData: { message, linkTo, linkMessage}
      });

      console.log('SuccessModal message:%O', wrapper.vm.$el.querySelector('.d-block p').textContent.trim());
      
      console.log('SuccessModal linkMessage:%O', wrapper.vm.$el.querySelector('.button-container').textContent.trim());

      expect(wrapper.vm.$el.querySelector('.d-block p').textContent.trim()).toEqual(message);
      expect(wrapper.vm.$el.querySelector('.button-container').textContent.trim()).toEqual(linkMessage);
  });

  describe('SuccessModal.vue Methods', () => {});
});
