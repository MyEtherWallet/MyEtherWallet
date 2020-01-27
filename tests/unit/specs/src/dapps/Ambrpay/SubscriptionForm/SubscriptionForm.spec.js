import SubscriptionForm from '@/dapps/Ambrpay/containers/SubscriptionForm/SubscriptionForm.vue';
import { shallowMount } from '@vue/test-utils';
import Blockie from '@/components/Blockie';
import Vue from 'vue';
import { Tooling } from '@@/helpers';
import VueX from 'vuex';
import { state, getters } from '@@/helpers/mockStore';
import BigNumber from 'bignumber.js';

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

    localVue.use(VueX);

    state.web3.utils = {
      fromWei: jest.fn()
    };
    state.account = {
      balance: '4'
    };

    store = new VueX.Store({
      modules: {
        main: {
          namespaced: true,
          state,
          getters
        }
      }
    });
  });

  beforeEach(() => {
    wrapper = shallowMount(SubscriptionForm, {
      localVue,
      attachToDocument: true,
      stubs: {
        blockie: Blockie
      },
      i18n,
      store
    });
  });

  afterEach(() => {
    wrapper.destroy();
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

  it('should set an amount error message if sendAmount < 0.01', () => {
    const sendAmount = 0.001;
    wrapper.setData({ sendAmount });

    expect(wrapper.vm.$data.amountErrMsg).toEqual(
      'The minimum amount is 0.01 or greater'
    );
  });

  it('should set an amount error message if sendAmount > account balance', () => {
    let sendAmount = '0.01';
    wrapper.setData({ sendAmount });
    sendAmount = '0.01';
    wrapper.setData({ sendAmount });
    expect(wrapper.vm.$data.amountErrMsg).toEqual('');
  });

  it('should set an interval error message if the number is invalid', () => {
    const intervalDays = '000';
    wrapper.setData({ intervalDays });

    expect(wrapper.vm.$data.intervalErrMsg).toEqual(
      'Please enter a correct number'
    );
  });

  it('should call sendEntireBalance on click to entire balance', () => {
    const sendAmount = '3';
    wrapper.setData({ sendAmount });
    wrapper.find('.action-text').trigger('click');
    const entireBal = state.web3.utils.fromWei(
      new BigNumber(state.account.balance).toFixed(),
      'ether'
    );

    expect(wrapper.vm.$data.sendAmount).toEqual(entireBal);
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
});
