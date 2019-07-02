import Vue from 'vue';
import RoundButton from '@/components/Buttons/RoundButton/RoundButton.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';

describe('RoundButton.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(RoundButton, {
      localVue,
      i18n,
      store,
      attachToDocument: true
    });
  });

  it('should render correct title props', () => {
    const title = 'title';
    wrapper.setProps({title});
    expect(
      wrapper.vm.$el.querySelector('.round-button button').textContent.trim()
    ).toEqual(title);
  });
});
