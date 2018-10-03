
import Vue from 'vue';
import InterfaceBottomText from '@/components/InterfaceBottomText/InterfaceBottomText.vue';
import { shallowMount } from '@vue/test-utils'

import {
  Tooling
} from '@@/helpers';

describe('InterfaceBottomText.vue', () => {
    let localVue, i18n, wrapper, store;
    const link = 'link'
    const linkText = 'linkText'
    const question = 'question'
    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(InterfaceBottomText, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          propsData: {
            link:link,
            linkText:linkText,
            question:question
          }
        });
    });

  it('should render correct contents', () => {
    expect(wrapper.vm.$el.querySelector('div p').textContent.trim()).toEqual(
      question + " " + linkText 
    );
    expect(wrapper.vm.$el.querySelector('div p a').textContent.trim()).toEqual(
      linkText
    );
    expect(wrapper.vm.$el.querySelector('div p a').getAttribute('href')).toEqual(
      link
    );
  });

  describe('InterfaceBottomText.vue Methods', () => {});

});


