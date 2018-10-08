import Vue from 'vue';
import VueRouter from 'vue-router';

import { shallowMount } from '@vue/test-utils';
import BackButton from '@/layouts/InterfaceLayout/components/BackButton/BackButton.vue';

import {
  Tooling
} from '@@/helpers';

describe('BackButton.vue', () => {
  let localVue, i18n, wrapper, router, store;
  const resetView = jest.fn(() => console.log('resetView function called'));
  // const backMethodMock = jest.fn(() => console.log('back method called'));
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    router = baseSetup.router;
  });

  beforeEach(() => {
    wrapper = shallowMount(BackButton, {
      localVue,
      i18n,
      store,
      router,
      attachToDocument: true,
      propsData: {
        resetView: resetView
      }
    });
    // console.log(wrapper.vm); // todo remove dev item

  });

  it('should render correct content', () => {
    const backMethodSpy = jest.spyOn(wrapper.vm, 'back')
    wrapper.find('.back-container').trigger('click');
    expect(backMethodSpy).toHaveBeenCalled()
    expect(backMethodSpy).toHaveBeenCalledTimes(1)
  });

  describe('BackButton.vue Methods', () => {

  });
});
