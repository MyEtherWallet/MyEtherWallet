import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import DomainSaleContainer from '@/dapps/DomainSaleContainer/DomainSaleContainer.vue';
import BackButton from '@/layouts/InterfaceLayout/components/BackButton/BackButton.vue';
import PopOver from '@/components/PopOver/PopOver.vue';
import {
  Tooling
} from '@@/helpers';


describe('DomainSaleContainer.vue', () => {
    let localVue, i18n, wrapper, store;
    const resetView = jest.fn();

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(DomainSaleContainer, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          stubs: {
            'back-button':BackButton,
            'popover':PopOver
          },
          propsData: {
            resetView:resetView,
          }
        });
    });

    it('should render correct content', () => {
      wrapper.find('.sliding-switch-white label.switch input').trigger('click');
      var checkFormElement = wrapper.find('.domain-check-form');
      expect(checkFormElement.classes().indexOf('hidden')).toBe(-1)
      wrapper.find('.sliding-switch-white label.switch input').trigger('click');
      expect(checkFormElement.classes().indexOf('hidden')).toBeGreaterThan(-1)
    });
});
