import SubscriptionForm from '@/dapps/Ambrpay/containers/SubscriptionForm/SubscriptionForm.vue';
import { shallowMount } from '@vue/test-utils';
import Blockie from '@/components/Blockie';
import Vue from 'vue';
import { Toast } from '@/helpers';
import { Tooling } from '@@/helpers';

describe('SubscriptionForm.vue', () => {
  let localVue, wrapper, i18n, store;

  beforeAll(() => {
    document.execCommand = jest.fn().mockImplementation(command => {
      return command;
    });

    Vue.toasted = jest.fn().mockImplementation(global => {
      return global;
    });

    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(SubscriptionForm, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        blockie: Blockie
      }
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('should return the correct data', () => {
    expect(wrapper.vm.$data.address).toEqual('');
    expect(wrapper.vm.$data.isValidAddress).toEqual(false);
    expect(wrapper.vm.$data.hexAddress).toEqual('');
    expect(wrapper.vm.$data.intervalDays).toEqual('');
    expect(wrapper.vm.$data.sendAmount).toEqual('');
    expect(wrapper.vm.$data.amountErrMsg).toEqual('');
    expect(wrapper.vm.$data.intervalErrMsg).toEqual('');
  });

  it('should render the correct address', () => {
    const address = '0x29D7d1dd5B6f9C864d9db560D72a247c178aE86B';
    wrapper.setData({ address });
    const inputAddress = wrapper.vm.$el.querySelectorAll(
      '.address-block .row-style input'
    )[0];

    expect(inputAddress.value).toEqual(address);
  });

  it('should render the correct address', () => {
    const address = '0x29D7d1dd5B6f9C864d9db560D72a247c178aE86B';
    wrapper.setData({ address });
    const inputAddress = wrapper.vm.$el.querySelectorAll(
      '.address-block .row-style input'
    )[0];

    expect(inputAddress.value).toEqual(address);
  });

  it('should render the correct address', () => {
    const address = '0x29D7d1dd5B6f9C864d9db560D72a247c178aE86B';
    wrapper.setData({ address });

    expect(wrapper.vm.$data.isValidAddress).toEqual(true);
  });

  it('should set an amount error message if sendAmount < 0.01', () => {
    const sendAmount = 0.001;
    wrapper.setData({ sendAmount });

    expect(wrapper.vm.$data.amountErrMsg).toEqual(
      'The minimum amount is 0.01 or greater'
    );
  });

  it('should set an amount error message if sendAmount > account balance', () => {
    const sendAmount = 1;
    wrapper.setData({ sendAmount });

    expect(wrapper.vm.$data.amountErrMsg).toEqual(
      'Amount higher than balance (including 1% automation fee)'
    );
  });

  it('should set an interval error message if the number is invalid', () => {
    const intervalDays = '000';
    wrapper.setData({ intervalDays });

    expect(wrapper.vm.$data.intervalErrMsg).toEqual(
      'Please enter a correct number'
    );
  });

  it('should call copyToClipboard on click to copy', () => {
    jest.spyOn(Toast, 'responseHandler').mockReturnValue('true');

    wrapper.find('p.copy-text').trigger('click');
    expect(document.execCommand).toHaveBeenCalledWith('copy');
    expect(Toast.responseHandler).toHaveBeenCalled();
  });

  it('should call sendEntireBalance on click to entire balance', () => {
    wrapper.setData({ sendAmount: '3' });
    wrapper.find('.entire-balance').trigger('click');
    expect(wrapper.vm.$data.sendAmount).toBe('0');
  });
});
