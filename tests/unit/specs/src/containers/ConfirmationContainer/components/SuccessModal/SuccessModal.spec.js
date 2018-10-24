import Vue from 'vue';
import { shallowMount ,createLocalVue} from '@vue/test-utils'
import SuccessModal from '@/containers/ConfirmationContainer/components/SuccessModal/SuccessModal.vue';

import {
  Tooling
} from '@@/helpers';



describe('SuccessModal.vue', () => {
    let localVue, i18n, wrapper, store;
    const message = 'message'
    const linkMessage = 'linkMessage'
    const linkTo = 'linkTo';

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(SuccessModal, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          propsData: { message, linkTo, linkMessage}
        });
    });

  it('should render correct message props', () => {
      expect(wrapper.vm.$el.querySelector('.d-block p').textContent.trim()).toEqual(message);
  });

  it('should render correct linkMessage props', () => {
      expect(wrapper.vm.$el.querySelector('.button-container').textContent.trim()).toEqual(linkMessage);
  });

  describe('SuccessModal.vue Methods', () => {}); 
});
