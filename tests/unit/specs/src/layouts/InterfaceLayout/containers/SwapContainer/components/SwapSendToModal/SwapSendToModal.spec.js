import Vue from 'vue';
import Vuex from 'vuex';
import sinon from 'sinon';
import { shallowMount } from '@vue/test-utils';
import SwapSendToModal from '@/layouts/InterfaceLayout/containers/SwapContainer/components/SwapSendToModal/SwapSendToModal.vue';
import { Tooling } from '@@/helpers';
import CheckoutForm from '@/layouts/InterfaceLayout/containers/SwapContainer/components/CheckoutForm/CheckoutForm.vue';
import { state, getters } from '@@/helpers/mockStore';

const showModal = sinon.stub();
const hideModal = sinon.stub();
const BModalStub = {
  name: 'b-modal',
  template: '<div><slot></slot></div>',
  props: ['to'],
  methods: {
    show: showModal,
    hide: hideModal
  }
};

describe('SwapSendToModal.vue', () => {
  let localVue, i18n, wrapper, store, actions;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;

    Vue.config.warnHandler = () => {};

    actions = {
      addSwapNotification: sinon.stub()
    };

    store = new Vuex.Store({
      modules: {
        main: {
          namespaced: true,
          state,
          getters,
          actions
        }
      }
    });
  });

  beforeEach(() => {
    wrapper = shallowMount(SwapSendToModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'b-modal': BModalStub,
        'simplex-checkout-form': CheckoutForm
      }
    });
  });

  afterEach(() => {
    wrapper.destroy();
    wrapper = null;
  });

  xit('should render correct fromAddress data', async () => {
    const fromAddress = {
      name: 'name',
      value: 'value',
      address: 'address'
    };
    wrapper.setData({ fromAddress });
    wrapper.vm.$nextTick(() => {
      expect(
        wrapper.vm.$el.querySelector('.from-address .value').textContent.trim()
      ).toEqual(
        wrapper.vm.$data.fromAddress.value +
          '\n            ' +
          wrapper.vm.$data.fromAddress.name
      );
      expect(
        wrapper.vm.$el
          .querySelector('.from-address .address')
          .textContent.trim()
      ).toEqual(wrapper.vm.$data.fromAddress.address);
    });
  });

  it('should render correct toAddress data', () => {
    const toAddress = {
      name: 'name',
      value: 'value',
      address: 'address'
    };
    wrapper.setData({ toAddress });
    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('.to-address .value').text()).toEqual(
        wrapper.vm.$data.toAddress.value +
          '\n            ' +
          wrapper.vm.$data.toAddress.name
      );
      expect(wrapper.find('.to-address .address').text()).toEqual(
        wrapper.vm.$data.toAddress.address
      );
    });
  });

  it('should render correct confirm send button', () => {
    const fromAddress = {
      name: 'name',
      value: 'value',
      address: 'address'
    };
    wrapper.setData({ fromAddress });
    wrapper.vm.$nextTick(() => {
      const elContainer = wrapper.find('.confirm-send-button h4');
      expect(
        elContainer.text().indexOf(wrapper.vm.$data.fromAddress.value)
      ).toBeGreaterThan(-1);
      expect(
        elContainer.text().indexOf(wrapper.vm.$data.fromAddress.name)
      ).toBeGreaterThan(-1);
    });
  });

  it('should render correct swapDetails props', () => {
    const swapDetails = {
      dataForInitialization: true,
      fromCurrency: 'ETC',
      fromValue: '1.0000000',
      fromAddress: '0xF54F78F67feCDd37e0C009aB4cCD6549A69540D4',
      toCurrency: 'ETH',
      toValue: '0.0034523',
      toAddress: '0xF54F78F67feCDd37e0C009aB4cCD6549A69540D4'
    };
    wrapper.setProps({ swapDetails });
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.$data.fromAddress.value).toEqual(swapDetails.fromValue);
      expect(wrapper.vm.$data.fromAddress.name).toEqual(
        swapDetails.fromCurrency
      );
      expect(wrapper.vm.$data.fromAddress.address).toEqual(
        swapDetails.fromAddress
      );
      expect(wrapper.vm.$data.toAddress.value).toEqual(swapDetails.toValue);
      expect(wrapper.vm.$data.toAddress.name).toEqual(swapDetails.toCurrency);
      expect(wrapper.vm.$data.toAddress.address).toEqual(swapDetails.toAddress);
    });
  });

  describe('SwapSendToModal.vue Methods', () => {
    it('should render correct redirectToPartner method', () => {
      const swapDetails = {
        dataForInitialization: true
      };

      wrapper.setProps({ swapDetails });
      wrapper.vm.redirectToPartner();
      wrapper.vm.$nextTick(() => {
        expect(actions.addSwapNotification.called).toBe(true);
      });
    });
  });

  it('dismounts', () => {
    wrapper.destroy();
    expect(wrapper.exists()).toBe(false);
  });
});
