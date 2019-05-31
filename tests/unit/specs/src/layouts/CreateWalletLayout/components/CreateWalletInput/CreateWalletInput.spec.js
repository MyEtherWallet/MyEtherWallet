import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import CreateWalletInput from '@/layouts/CreateWalletLayout/components/CreateWalletInput/CreateWalletInput.vue';
import sinon from 'sinon';
import { Tooling } from '@@/helpers';

describe('CreateWalletInput.vue', () => {
  let localVue, i18n, wrapper, store;
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;

    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(CreateWalletInput, {
      localVue,
      i18n,
      store,
      attachToDocument: true
    });
  });

  it('should render correct value props', () => {
    const value = '100';
    wrapper.setProps({ value });
    expect(
      wrapper.vm.$el.querySelector('.user-input-field input').value
    ).toEqual(value);

    const strengthClass = 'strengthClass';
    wrapper.setData({ strengthClass });
    expect(
      wrapper
        .find('span')
        .classes()
        .indexOf(strengthClass)
    ).toBeGreaterThan(-1);

    const switcher = sinon.stub();
    const param = 'param';
    wrapper.setProps({ switcher });
    wrapper.setProps({ value: '111' });
    wrapper.setProps({ param });
    wrapper.find('.next-button').trigger('click');
    expect(switcher.calledWith(param)).toBe(true);
    let password = { showPassword: true };
    wrapper.setData({ password });
    expect(wrapper.find('img.show-password').exists()).toBe(true);
    expect(wrapper.find('img.hide-password').exists()).toBe(false);
    password = { showPassword: false };
    wrapper.setData({ password });
    expect(wrapper.find('img.show-password').exists()).toBe(false);
    expect(wrapper.find('img.hide-password').exists()).toBe(true);

    const strength = 'strength';
    wrapper.setData({ strength });
    expect(
      wrapper.vm.$el.querySelector('.passwd-strength span').textContent.trim()
    ).toEqual(strength);
  });

  describe('CreateWalletInput.vue Methods', () => {});
});
