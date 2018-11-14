import Vue from 'vue';
import ScrollUpButton from '@/components/ScrollUpButton/ScrollUpButton.vue';
import { shallowMount } from '@vue/test-utils'

import {
  Tooling
} from '@@/helpers';

describe('ScrollUpButton.vue', () => {
  let localVue, i18n, wrapper, store;
    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(ScrollUpButton, {
          localVue,
          i18n,
          store,
          attachToDocument: true
        });
    });

  xit('[FAILING] should scroll To Top when block button clicked', () => {
    const buttonBlock = wrapper.find('.button-block');
    window.pageXOffset = 100;
    window.pageYOffset = 100;
    buttonBlock.trigger('click');
    expect(window.pageXOffset).toBe(0);
    expect(window.pageYOffset).toBe(0);
  });

  describe('ScrollUpButton.vue Methods', () => {});
});
