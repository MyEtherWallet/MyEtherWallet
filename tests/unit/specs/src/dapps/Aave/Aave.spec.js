import Aave from '@/dapps/Aave/Aave.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';
import VueX from 'vuex';
import { state, getters } from '@@/helpers/mockStore';
import PopOver from '@/components/PopOver/PopOver.vue';
import { RouterViewStub } from '@@/helpers/setupTooling';

describe('Aave.vue', () => {
  let localVue, wrapper, i18n, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
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
    const mockRoute = {
      fullPath: '/interface/dapps/aave/action',
      params: {
        token: {},
        actionType: ''
      }
    };

    const mockApolloClient = {
      render: () => {},
      methods: {
        getLiquidityRateHistoryUpdate: () => true
      }
    };

    wrapper = shallowMount(Aave, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: {
        tokensWithBalance: [{}]
      },
      mocks: {
        $route: mockRoute
      },
      stubs: {
        popover: PopOver,
        apolloClient: mockApolloClient,
        'router-view': RouterViewStub
      }
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('should render the correct data', () => {
    expect(wrapper.vm.$data.activeDepositTab).toEqual(true);
    expect(wrapper.vm.$data.activeBorrowTab).toEqual(false);
    expect(wrapper.vm.$data.loadingHome).toEqual(true);
    expect(wrapper.vm.$data.loadingReserves).toEqual(true);
    expect(wrapper.vm.$data.reservesData).toEqual([]);
    expect(wrapper.vm.$data.rawReserveData).toEqual([]);
    expect(wrapper.vm.$data.reservesStable).toEqual([]);
    expect(wrapper.vm.$data.actionType).toEqual('');
    expect(wrapper.vm.$data.userReserveData).toEqual([]);
    expect(wrapper.vm.$data.token).toEqual({});
    expect(wrapper.vm.$data.usdPriceEth).toEqual('');
    expect(wrapper.vm.$data.userSummary).toEqual({});
    expect(wrapper.vm.$data.rateHistory).toEqual({
      labels: [],
      stableRates: [],
      variableRates: []
    });
    expect(wrapper.vm.$data.pendingToken).toEqual({});
  });

  it('should show the loader', () => {
    expect(wrapper.find('i.fa-spinner').exists()).toBe(true);
  });

  it('should display the correct action title', () => {
    expect(wrapper.vm.actionTitle).toEqual('Deposit');
  });

  it('should change the action title to Borrow', async () => {
    wrapper.setData({ activeDepositTab: false });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.actionTitle).toEqual('Borrow');
  });

  it('should change the action title to Withdraw', async () => {
    wrapper.setData({ actionType: 'Withdraw' });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.actionTitle).toEqual('Withdraw');
  });

  it('watches routes param token', async () => {
    wrapper.setData({ $route: { params: { token: { symbol: 'ETH' } } } });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$data.token).toEqual({ symbol: 'ETH' });
  });

  it('watches routes param actionType', async () => {
    wrapper.setData({ $route: { params: { actionType: 'Repay' } } });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$data.actionType).toEqual('Repay');
  });
});
