import BalanceDisplay from '@/dapps/Aave/components/BalanceDisplay/BalanceDisplay.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';
import VueX from 'vuex';
import { state, getters } from '@@/helpers/mockStore';

describe('BalanceDisplay.vue', () => {
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
    wrapper = shallowMount(BalanceDisplay, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: {
        percentageLeft: '',
        title: '',
        balanceEth: '',
        balanceUsd: '',
        composition: [],
        earningsBalance: 0,
        loadingHome: true
      }
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('should render the correct data', () => {
    expect(wrapper.vm.$data.compositionStyle).toEqual('');
    expect(wrapper.vm.$data.balanceTitles).toEqual({
      earnings: 'Earnings',
      collateral: 'Your Collateral',
      aggregatedBal: 'Aggregated Balance',
      borrowed: 'You Borrowed'
    });
  });

  it('should watch composition', async () => {
    wrapper.setProps({
      composition: [{ percentage: -1 }, { percentage: 2 }]
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.composition).toEqual([{ percentage: 2 }]);
  });

  it('should convert the amount to fixed', async () => {
    wrapper.setProps({
      balanceEth: '2.32423984723',
      loadingHome: false,
      title: 'Deposit'
    });
    await wrapper.vm.$nextTick();
    expect(
      wrapper.vm.$el.querySelectorAll('.eth-balance')[0].textContent.trim()
    ).toContain('2.324240');
  });
});
