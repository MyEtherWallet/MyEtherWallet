import Vue from 'vue';
import StandardInput from '@/components/StandardInput/StandardInput.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';

describe('StandardInput.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(StandardInput, {
      localVue,
      i18n,
      store,
      attachToDocument: true
    });
  });

  it('should render correct inputValue data', () => {
    const options = {
      isTextarea: true,
      value: 'value'
    };
    wrapper.setProps({ options });
    const inputValue = 'inputValue';

    wrapper.setData({ inputValue });
    expect(
      wrapper.vm.$el.querySelector('.input-container textarea').value
    ).toEqual(inputValue);
  });

  it('should render correct borderClass computed property', () => {
    const options = {
      passwordStrength: '1'
    };

    wrapper.setProps({ options });
    expect(
      wrapper
        .find('.input-container')
        .classes()
        .indexOf(wrapper.vm.borderClass)
    ).toBeGreaterThan(-1);
  });

  it('should render correct options props', () => {
    const options = {
      title: 'title',
      popover: 'popover',
      buttonRandom: true,
      buttonClear: true,
      buttonCopy: true,
      buttonCustom: true,
      topTextInfo: 'topTextInfo',
      titleText: 'titleText',
      rightInputText: 'rightInputText'
    };
    wrapper.setProps({ options });
    expect(
      wrapper.vm.$el.querySelector('.input-title').textContent.trim()
    ).toEqual(options.title);
    expect(
      wrapper.vm.$el.querySelector('.input-title-text').textContent.trim()
    ).toEqual(options.titleText);
    expect(
      wrapper.vm.$el.querySelector('.right-input-text').textContent.trim()
    ).toEqual(options.rightInputText);
    expect(wrapper.find('.random').exists()).toBe(true);
    expect(wrapper.find('.clean').exists()).toBe(true);
    expect(
      wrapper.vm.$el.querySelector('.the-text').textContent.trim()
    ).toEqual(options.topTextInfo);
  });
});
