import Vue from 'vue';
import WarningMessage from '@/components/WarningMessage/WarningMessage.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';

describe('WarningMessage.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(WarningMessage, {
      localVue,
      i18n,
      store,
      attachToDocument: true
    });
  });

  xit('should render correct options props', () => {
    expect(
      wrapper.vm.$el.querySelector('.warning-message .title').textContent.trim()
    ).toEqual(wrapper.props().options.title);
    expect(
      wrapper.vm.$el
        .querySelector('.warning-message .message')
        .textContent.trim()
    ).toEqual(wrapper.props().options.message);
    expect(
      wrapper.vm.$el
        .querySelector('.warning-message .link a')
        .textContent.trim()
    ).toEqual(wrapper.props().options.link.text);
  });
});
