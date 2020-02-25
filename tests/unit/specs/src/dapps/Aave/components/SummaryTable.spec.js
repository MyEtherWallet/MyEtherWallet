import SummaryTable from '@/dapps/Aave/components/SummaryTable/SummaryTable.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';
import VueX from 'vuex';
import { state, getters } from '@@/helpers/mockStore';
import sinon from 'sinon';

describe('SummaryTable.vue', () => {
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
    const mockConfirmationModal = {
      name: 'rateModal',
      template: '<div><slot></slot></div>',
      methods: {
        hide: sinon.stub()
      }
    };

    wrapper = shallowMount(SummaryTable, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: {
        pendingToken: {},
        reserves: [],
        userReserves: [],
        activeDepositTab: true,
        healthFactor: ''
      },
      stubs: {
        confirmationModal: mockConfirmationModal
      }
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('should render the correct data', () => {
    expect(wrapper.vm.$data.token).toEqual({});
    expect(wrapper.vm.$data.collateralModalShown).toEqual(false);
    expect(wrapper.vm.$data.switchInterestShown).toEqual(false);
  });

  it('should check computed ownedReserves', async () => {
    wrapper.setProps({
      activeDepositTab: true,
      userReserves: [{ principalATokenBalance: 5, reserve: { symbol: 'ETH' } }]
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.ownedReserves).toEqual([
      { principalATokenBalance: 5, reserve: { symbol: 'ETH' } }
    ]);
  });
});
