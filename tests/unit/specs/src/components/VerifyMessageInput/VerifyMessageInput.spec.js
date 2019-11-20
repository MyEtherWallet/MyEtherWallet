import Vue from 'vue';
import VerifyMessageInput from '@/components/VerifyMessageInput/VerifyMessageInput.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';

describe('VerifyMessageInput.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(VerifyMessageInput, {
      localVue,
      i18n,
      store,
      attachToDocument: true
    });
  });

  it('should render correct message data', () => {
    wrapper.setData({ message: 'message' });
    expect(wrapper.vm.$el.querySelector('.the-form textarea').value).toEqual(
      wrapper.vm.$data.message
    );
    expect(wrapper.find('.success-message').exists()).toBe(false);

    wrapper.setData({
      message: JSON.stringify({
        msg: 'msg',
        address: 'address'
      })
    });
    wrapper.setData({ showMessage: true });
    expect(wrapper.find('.success-message').exists()).toBe(true);

    wrapper.setProps({
      signature: JSON.stringify({
        msg: 'msg',
        address: 'address'
      })
    });
    expect(wrapper.vm.$data.message).toEqual(wrapper.props().signature);

    wrapper
      .findAll('.copy-buttons span')
      .at(0)
      .trigger('click');
    expect(wrapper.vm.$data.showMessage).toBe(false);
    expect(wrapper.vm.$data.message).toBe('');
  });
});
