import ActionModal from '@/dapps/Aave/components/ActionModal/ActionModal.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';
import VueX from 'vuex';
import { state, getters } from '@@/helpers/mockStore';

describe('ActionModal.vue', () => {
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
    wrapper = shallowMount(ActionModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: {
        reservesStable: [],
        depositModal: true,
        availEth: '',
        loadingReserves: true,
        reserves: []
      }
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('should render the correct data', () => {
    expect(wrapper.vm.$data.localReserves).toEqual([]);
    expect(wrapper.vm.$data.stableTabActive).toEqual(false);
    expect(wrapper.vm.$data.allTabActive).toEqual(true);
    expect(wrapper.vm.$data.search).toEqual('');
  });

  it('clears search on depositModal', async () => {
    wrapper.setData({ search: 'abc' });
    await wrapper.vm.$nextTick();
    wrapper.setProps({ depositModal: false });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$data.search).toBe('');
  });

  it('watches reserves and gets localReserves', async () => {
    wrapper.setProps({ reserves: [{ symbol: 'ETH' }] });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$data.localReserves).toEqual([{ symbol: 'ETH' }]);
  });

  it('watches search value', async () => {
    wrapper.setProps({ reserves: [{ symbol: 'ETH' }] });
    wrapper.setData({ search: 'ETH' });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$data.localReserves).toEqual([{ symbol: 'ETH' }]);
  });

  it('computes disabledTooltip', async () => {
    wrapper.setData({ depositModal: true });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.disabledTooltip).toBe(
      'You will need to transfer this currency to your wallet to be able to deposit'
    );
  });
});
