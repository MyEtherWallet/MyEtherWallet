import Vue from 'vue';
import Vuex from 'vuex';
import { shallowMount } from '@vue/test-utils';
import InterfaceNetwork from '@/layouts/InterfaceLayout/components/InterfaceNetwork/InterfaceNetwork.vue';
import InterfaceNetworkModal from '@/layouts/InterfaceLayout/components/InterfaceNetworkModal/InterfaceNetworkModal.vue';
import InterfaceBalance from '@/layouts/InterfaceLayout/components/InterfaceBalance/InterfaceBalance.vue';
import sinon from 'sinon';
import { Tooling } from '@@/helpers';
import { state, getters } from '@@/helpers/mockStore';

const showModal = sinon.stub();

const BModalStub = {
  name: 'b-modal',
  template: '<div><slot></slot></div>',
  props: ['to'],
  methods: {
    show: showModal
  }
};

//xdescribe
describe('InterfaceNetwork.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;

    store = new Vuex.Store({
      getters,
      state
    });

    Vue.config.errorHandler = () => {};
    Vue.config.warnHandler = () => {};
    Vue.config.silent = true;
  });

  beforeEach(() => {
    wrapper = shallowMount(InterfaceNetwork, {
      localVue,
      i18n,
      store,
      stubs: {
        'interface-network-modal': InterfaceNetworkModal,
        'interface-balance': InterfaceBalance,
        'b-modal': BModalStub
      }
    });
  });

  xit('[Failing] should render correct blockNumber props', () => {
    const blockNumber = 100;
    wrapper.setProps({ blockNumber });
    expect(wrapper.find('.information-container span').text()).toEqual(
      String(blockNumber)
    );
  });

  describe('InterfaceNetwork.vue Methods', () => {
    xit('[Failing] should render correct networkModalOpen method', () => {
      wrapper.vm.networkModalOpen();
      expect(showModal.called).toBe(true);
    });
  });
});
