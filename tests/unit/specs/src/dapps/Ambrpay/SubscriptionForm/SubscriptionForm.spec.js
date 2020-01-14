import SubscriptionForm from '@/dapps/Ambrpay/containers/SubscriptionForm/SubscriptionForm.vue';
import { shallowMount } from '@vue/test-utils';
import Blockie from '@/components/Blockie';
import Vue from 'vue';
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

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should be a vue instance', () => {
    expect(wrapper.isVueInstance).toBeTruthy();
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

  it('should set an amount error message if sendAmount < 0.01', async () => {
    const sendAmount = 0.001;
    wrapper.setData({ sendAmount });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$data.amountErrMsg).toEqual(
      'The minimum amount is 0.01 or greater'
    );
  });

  it('should set an amount error message if sendAmount > account balance', async () => {
    const sendAmount = 1;
    wrapper.setData({ sendAmount });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$data.amountErrMsg).toEqual(
      'Amount higher than balance (including 1% automation fee)'
    );
  });

  it('should set an interval error message if the number is invalid', async () => {
    const intervalDays = '000';
    wrapper.setData({ intervalDays });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$data.intervalErrMsg).toEqual(
      'Please enter a correct number'
    );
  });

  it('should call sendEntireBalance on click to entire balance', () => {
    wrapper.setData({ sendAmount: '3' });
    wrapper.find('.entire-balance').trigger('click');
    expect(wrapper.vm.$data.sendAmount).toBe('0');
  });

  it('should send $emit on button click', () => {
    wrapper.find('.mew-btn').trigger('click');
    wrapper.vm.$emit('startSubscription');

    expect(wrapper.emitted().startSubscription).toBeTruthy();
  });

  it('should clear the form', () => {
    wrapper.setData({
      address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
      isValidAddress: true,
      hexAddress: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
      intervalDays: '5',
      sendAmount: '1',
      amountErrMsg: 'There is an error',
      intervalErrMsg: 'There is an error'
    });
    wrapper.find('.clear-all-btn').trigger('click');
    expect(wrapper.vm.$data.address).toEqual('');
    expect(wrapper.vm.$data.isValidAddress).toEqual(false);
    expect(wrapper.vm.$data.hexAddress).toEqual('');
    expect(wrapper.vm.$data.intervalDays).toEqual('');
    expect(wrapper.vm.$data.sendAmount).toEqual('');
    expect(wrapper.vm.$data.amountErrMsg).toEqual('');
    expect(wrapper.vm.$data.intervalErrMsg).toEqual('');
  });

  it('should dismount properly', () => {
    expect(wrapper.destroy()).toBe(undefined);
  });
});
