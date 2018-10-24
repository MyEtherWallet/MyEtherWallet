import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
// import DomainSaleContainer from '@/layouts/InterfaceLayout/containers/DomainSaleContainer/DomainSaleContainer.vue';
import BackButton from '@/layouts/InterfaceLayout/components/BackButton/BackButton.vue';
import PopOver from '@/components/PopOver/PopOver.vue';
import {
  Tooling
} from '@@/helpers';


xdescribe('DomainSaleContainer.vue', () => {
    let localVue, i18n, wrapper, store;
    const resetView = jest.fn()
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
        wrapper.find('.back-container').trigger('click')
        expect( resetView ).toHaveBeenCalled()
    });

  describe('DomainSaleContainer.vue Methods', () => {
      let localVue, i18n, wrapper, store;
      const resetView = jest.fn(()=> console.log('resetView function called'))
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

      it('should expand domainCheckForm when click button', () => {
          wrapper.find('.switch input').trigger('click')
          expect(wrapper.find('.domain-check-form').classes().indexOf('hidden')).toEqual(-1)
      });
  });
});
