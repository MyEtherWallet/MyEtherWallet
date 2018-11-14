import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import SignMessageContainer from '@/layouts/InterfaceLayout/containers/SignMessageContainer/SignMessageContainer.vue';
import PopOver from '@/components/PopOver/PopOver.vue';
import {
  Tooling
} from '@@/helpers';

describe('SignMessageContainer.vue', () => {
   let localVue, i18n, wrapper, store;

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(SignMessageContainer, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          stubs:{
            'popover':PopOver
          }
        });
    });

  it('should render correct contents', () => {
    
  });

  describe('SignMessageContainer.vue Methods', () => {
    it('should render correct contents', () => {
      const textArea = wrapper.find('.domain-name .custom-textarea-1');
      wrapper.find('.copy-buttons span').trigger('click');
      expect(wrapper.vm.$el.querySelector('.domain-name .custom-textarea-1').textContent.trim()).toEqual('')
    });
  });
});
