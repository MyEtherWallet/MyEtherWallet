import RateModal from '@/dapps/Aave/components/RateModal/RateModal.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';
import VueX from 'vuex';
import { state, getters } from '@@/helpers/mockStore';
import sinon from 'sinon';

describe('RateModal.vue', () => {
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
    const mockRateModal = {
      name: 'rateModal',
      template: '<div><slot></slot></div>',
      methods: {
        hide: sinon.stub()
      }
    };

    wrapper = shallowMount(RateModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: {
        userSummary: {},
        amount: '',
        token: {}
      },
      stubs: {
        rateModal: mockRateModal
      }
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('should render the correct data', () => {
    expect(wrapper.vm.$data.selectStable).toEqual(false);
    expect(wrapper.vm.$data.selectVariable).toEqual(false);
  });

  it('should trigger togglBtns for stable', async () => {
    wrapper.setData({ selectStable: true });
    wrapper.find('.selected-btn').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$data.selectStable).toBe(true);
    expect(wrapper.vm.$data.selectVariable).toBe(false);
  });

  it('should trigger togglBtns for variable', async () => {
    wrapper.setData({ selectVariable: true });
    wrapper.find('.selected-btn').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$data.selectStable).toBe(false);
    expect(wrapper.vm.$data.selectVariable).toBe(true);
  });
});
