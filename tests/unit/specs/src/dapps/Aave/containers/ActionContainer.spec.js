import ActionContainer from '@/dapps/Aave/containers/ActionContainer/ActionContainer.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';
import VueX from 'vuex';
import { state, getters, actions } from '@@/helpers/mockStore';
import { fetch } from 'whatwg-fetch';

describe('ActionContainer.vue', () => {
  let localVue, wrapper, i18n, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = new VueX.Store({
      modules: {
        aave: {
          namespaced: true,
          state,
          getters,
          actions
        },
        main: {
          namespaced: true,
          state,
          getters
        }
      }
    });
  });

  beforeEach(() => {
    global.fetch = fetch;
    const mockRoute = {
      params: {
        token: { user: {}, price: {} },
        actionType: ''
      }
    };

    wrapper = shallowMount(ActionContainer, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: {
        userSummary: {},
        activeBorrowTab: false,
        activeDepositTab: true,
        reserves: []
      },
      mocks: {
        $route: mockRoute
      }
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('should render the correct data', () => {
    expect(wrapper.vm.$data.errorMsg).toEqual('');
    expect(wrapper.vm.$data.amount).toEqual(null);
    expect(wrapper.vm.$data.ethPrice).toEqual(0);
    expect(wrapper.vm.$data.disableBtn).toEqual(false);
    expect(wrapper.vm.$data.actionType).toEqual(null);
    expect(wrapper.vm.$data.token).toEqual({ user: {}, price: {} });
    expect(wrapper.vm.$data.percentBtns).toEqual({
      twentyFivePercentEnabled: false,
      fiftyPercentEnabled: false,
      seventyFivePercentEnabled: false,
      maxEnabled: false
    });
    expect(wrapper.vm.$data.actionTitles).toEqual({
      deposit: 'Deposit',
      withdraw: 'Withdraw',
      repay: 'Repay',
      borrow: 'Borrow'
    });
  });

  it('should set the correct route params', async () => {
    wrapper.setData({
      $route: {
        params: {
          actionType: 'Deposit',
          token: { user: { id: '123' }, price: { ethPrice: 123 } }
        }
      }
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$data.token).toEqual({
      user: { id: '123' },
      price: { ethPrice: 123 }
    });
  });

  it('should error if amount is less than 0', async () => {
    wrapper.setData({ amount: '-1' });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$data.errorMsg).toEqual('Must be higher than 0');
  });

  it('should error if the amount exceeds the balance', async () => {
    wrapper.setData({
      token: { tokenBalance: '20' },
      amount: '21'
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$data.errorMsg).toEqual('Cannot exceed balance of 20.00');
  });

  it('should call convertToFixed', async () => {
    wrapper.setData({
      token: { user: { principalATokenBalance: '2.0000121' } },
      activeDepositTab: true
    });
    await wrapper.vm.$nextTick();
    expect(
      wrapper.vm.$el.querySelectorAll('.token-balance')[0].textContent.trim()
    ).toBe('2.00');
  });

  it('should set the correct actionTitle', async () => {
    wrapper.setData({
      actionType: 'Withdraw'
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.actionTitle).toBe('Withdraw');
  });
});
