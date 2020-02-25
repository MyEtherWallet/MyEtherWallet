import HomeContainer from '@/dapps/Aave/containers/HomeContainer/HomeContainer.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';
import VueX from 'vuex';
import { state, getters } from '@@/helpers/mockStore';

describe('HomeContainer.vue', () => {
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
    wrapper = shallowMount(HomeContainer, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: {
        pendingToken: {},
        reservesStable: [],
        userSummary: {},
        activeBorrowTab: false,
        activeDepositTab: false,
        loadingHome: true,
        loadingReserves: true,
        reserves: []
      }
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('should render the correct data', () => {
    expect(wrapper.vm.$data.compositionDeposit).toEqual([]);
    expect(wrapper.vm.$data.compositionBorrow).toEqual([]);
    expect(wrapper.vm.$data.compositionCollateral).toEqual([]);
    expect(wrapper.vm.$data.percentageLeft).toEqual('');
  });

  it('should call getCompositionPercentages after loadingHome', async () => {
    wrapper.setProps({
      userSummary: {
        reservesData: [
          { currentUnderlyingBalanceETH: 10, reserve: { symbol: 'ETH' } }
        ]
      }
    });
    wrapper.setProps({ loadingHome: false });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$data.compositionDeposit.length).toBe(1);
    expect(wrapper.vm.$data.compositionBorrow).toEqual([]);
    expect(wrapper.vm.$data.compositionCollateral).toEqual([]);
  });

  it('should call getCompositionPercentages after loadingHome', async () => {
    wrapper.setProps({
      userSummary: {
        reservesData: [{ currentBorrowsETH: 10, reserve: { symbol: 'ETH' } }]
      }
    });
    wrapper.setProps({ loadingHome: false });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$data.compositionBorrow.length).toBe(1);
    expect(wrapper.vm.$data.compositionDeposit).toEqual([]);
    expect(wrapper.vm.$data.compositionCollateral).toEqual([]);
  });
});
