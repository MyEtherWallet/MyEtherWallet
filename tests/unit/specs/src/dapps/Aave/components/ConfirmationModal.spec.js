import ConfirmationModal from '@/dapps/Aave/components/ConfirmationModal/ConfirmationModal.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';
import VueX from 'vuex';
import { state, getters } from '@@/helpers/mockStore';

describe('ConfirmationModal.vue', () => {
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
    wrapper = shallowMount(ConfirmationModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: {
        actionTitle: '',
        userSummary: {},
        activeDepositTab: false,
        isCollateralModal: false,
        amount: '',
        token: {},
        apr: '',
        rateType: '',
        healthFactor: ''
      }
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('should render the correct data', () => {
    expect(wrapper.vm.$data.currentHealthFactor).toEqual('');
    expect(wrapper.vm.$data.actionTitles).toEqual({
      deposit: 'Deposit',
      withdraw: 'Withdraw',
      repay: 'Repay',
      borrow: 'Borrow'
    });
  });

  it('should trigger emit on button click', async () => {
    wrapper.setProps({ isCollateralModal: true });
    wrapper.find('button').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted().emitTakeAction).toBeTruthy();
  });
});
