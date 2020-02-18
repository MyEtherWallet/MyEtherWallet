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
        pendingToken: {},
        reservesStable: [],
        userSummary: {},
        activeBorrowTab: false,
        activeDepositTab: false,
        loadingHome: true,
        loadingReserves: true,
        reserves: []
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
    expect(wrapper.vm.$data.compositionDeposit).toEqual([]);
    expect(wrapper.vm.$data.compositionBorrow).toEqual([]);
    expect(wrapper.vm.$data.compositionCollateral).toEqual([]);
    expect(wrapper.vm.$data.percentageLeft).toEqual('');
  });
});
