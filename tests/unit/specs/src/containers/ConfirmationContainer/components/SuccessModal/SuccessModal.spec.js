import Vue from 'vue';

import { shallowMount ,createLocalVue} from '@vue/test-utils'
import SuccessModal from '@/containers/ConfirmationContainer/components/SuccessModal/SuccessModal.vue';
import BootstrapVue from "bootstrap-vue"
const localVue = createLocalVue()
localVue.use(BootstrapVue);

describe('SuccessModal.vue', () => {
  it('should render correct contents', () => {
      const message = 'message'
      const linkMessage = 'linkMessage'
      const linkTo = 'linkTo';
      const wrapper = shallowMount(SuccessModal, {
        localVue,
        attachToDocument:true, 
        propsData: { message, linkTo, linkMessage}
      });

      expect(wrapper.vm.$el.querySelector('.d-block p').textContent.trim()).toEqual(message);
      expect(wrapper.vm.$el.querySelector('.button-container').textContent.trim()).toEqual(linkMessage);
  });

  describe('SuccessModal.vue Methods', () => {});
});
