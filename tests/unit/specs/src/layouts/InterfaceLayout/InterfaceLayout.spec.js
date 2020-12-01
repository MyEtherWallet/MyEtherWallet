// import Vue from 'vue';
// import Vuex from 'vuex';
// import { shallowMount } from '@vue/test-utils';
// import InterfaceLayout from '@/layouts/InterfaceLayout/InterfaceLayout.vue';
// import InterfaceBalance from '@/layouts/InterfaceLayout/components/InterfaceBalance/InterfaceBalance.vue';
// import InterfaceNetwork from '@/layouts/InterfaceLayout/components/InterfaceNetwork/InterfaceNetwork.vue';
// import InterfaceAddress from '@/layouts/InterfaceLayout/components/InterfaceAddress/InterfaceAddress.vue';
// import { state, getters } from '@@/helpers/mockStore';
// import { Tooling } from '@@/helpers';

describe('InterfaceLayout.vue', () => {
  // let localVue, i18n, wrapper, store;
  // beforeAll(() => {
  //   const baseSetup = Tooling.createLocalVueInstance();
  //   localVue = baseSetup.localVue;
  //   i18n = baseSetup.i18n;
  //   store = baseSetup.store;
  //   Vue.config.warnHandler = () => {};
  //   Vue.config.errorHandler = () => {};
  //   const actions = {
  //     setGasPrice: jest.fn()
  //   };
  //   store = new Vuex.Store({
  //     actions,
  //     getters,
  //     state
  //   });
  // });
  // beforeEach(() => {
  //   wrapper = shallowMount(InterfaceLayout, {
  //     localVue,
  //     i18n,
  //     store,
  //     attachToDocument: true,
  //     stubs: {
  //       'interface-balance': InterfaceBalance,
  //       'interface-network': InterfaceNetwork,
  //       'interface-address': InterfaceAddress
  //     }
  //   });
  // });
  // xit('should render correct content', () => {
  //   expect(
  //     wrapper.vm.$el
  //       .querySelector('.information-container p.address')
  //       .textContent.trim()
  //   ).toEqual('0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D');
  // });
  xit('should render correct balance data', () => {
    //   const balance = '100';
    //   wrapper.setData({ balance });
    //   expect(
    //     wrapper.vm.$el.querySelector('.balance-text p').textContent.trim()
    //   ).toEqual(balance);
  });
  // xit('should render correct blockNumber data', () => {
  //   const blockNumber = 100;
  //   wrapper.setData({ blockNumber });
  //   expect(wrapper.find('.information-container span').text()).toEqual(
  //     String(blockNumber)
  //   );
  // });
  // describe('InterfaceLayout.vue Methods', () => {});
});
