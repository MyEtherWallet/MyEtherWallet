import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import BackButton from '@/layouts/InterfaceLayout/components/BackButton/BackButton.vue';
import sinon from 'sinon';
import {
  Tooling
} from '@@/helpers';


describe('BackButton.vue', () => {
    let localVue, i18n, wrapper, store;
    let spy = sinon.stub()
    const mockRoute = {
      go: spy
    };

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(BackButton, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          mocks: {
            $router: mockRoute,
          }
        });
    });

    it('should render correct content', () => {
       
    });

  describe('BackButton.vue Methods', () => {
    it('should go back when button clicked', () => {
        wrapper.find('.back-container').trigger('click')
        expect(spy.called).toBe(true)
    });
  });
});
