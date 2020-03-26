import { shallowMount, RouterLinkStub } from '@vue/test-utils';
import SwapContainer from '@/layouts/InterfaceLayout/containers/SwapContainer/SwapContainer.vue';
import { Tooling } from '@@/helpers';
import CurrencyPicker from '@/layouts/InterfaceLayout/components/CurrencyPicker/CurrencyPicker.vue';
import SwapConfirmationModal from '@/layouts/InterfaceLayout/containers/SwapContainer/components/SwapConfirmationModal/SwapConfirmationModal.vue';
import sinon from 'sinon';
import VueX from 'vuex';
import { state, getters } from '@@/helpers/mockStore';

const showModal = sinon.spy();

const BModalStub = {
  name: 'b-modal',
  template: '<div><slot></slot></div>',
  props: ['to'],
  methods: {
    show: showModal
  }
};

describe('SwapContainer.vue', () => {
  let localVue, i18n, wrapper, store;
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
    wrapper = shallowMount(SwapContainer, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'currency-picker': CurrencyPicker,
        'swap-confirmation-modal': SwapConfirmationModal,
        'router-link': RouterLinkStub,
        'b-modal': BModalStub
      }
    });
  });

  afterEach(() => {
    wrapper.destroy();
    wrapper = null;
  });

  xit('[Failing] should render correct fromArray to currenPicker element', () => {
    const containerElements = wrapper.vm.$el.querySelectorAll(
      '.item-container'
    );
    const fromToElements = containerElements[0];
    for (const [i, currencyElement] of fromToElements
      .querySelectorAll('div')
      .entries()) {
      if (i > 0) {
        const symbol = wrapper.vm.$data.fromArray[i - 1].symbol;
        const name = wrapper.vm.$data.fromArray[i - 1].name;
        expect(currencyElement.querySelector('p').textContent.trim()).toEqual(
          symbol + ' - ' + name
        );
        expect(
          currencyElement.querySelector('span').textContent.trim()
        ).toEqual('- ' + name);
      }
    }
  });

  xit('[Failing] should render correct toArray to currenPicker element', () => {
    const containerElements = wrapper.vm.$el.querySelectorAll(
      '.item-container'
    );
    const fromToElements = containerElements[1];
    for (const [i, currencyElement] of fromToElements
      .querySelectorAll('div')
      .entries()) {
      if (i > 0) {
        const symbol = wrapper.vm.$data.fromArray[i - 1].symbol;
        const name = wrapper.vm.$data.fromArray[i - 1].name;
        expect(currencyElement.querySelector('p').textContent.trim()).toEqual(
          symbol + ' - ' + name
        );
        expect(
          currencyElement.querySelector('span').textContent.trim()
        ).toEqual('- ' + name);
      }
    }
  });

  it('should clear the form', () => {
    wrapper.setData({
      fromCurrency: 'BTC',
      toCurrency: 'ETH',
      overrideFrom: { name: 'Bitcoin', symbol: 'BTC' },
      overrideTo: { name: 'Ether', symbol: 'ETH' },
      fromValue: '5',
      providerSelectedName: 'Simplex',
      toAddress: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
      exitFromAddress: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
      refundAddress: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
    });
    wrapper.find('.clear-all-btn').trigger('click');
    expect(wrapper.vm.$data.fromCurrency).toEqual('ETH');
    expect(wrapper.vm.$data.toCurrency).toEqual('BTC');
    expect(wrapper.vm.$data.overrideFrom).toEqual({
      name: 'Ether',
      symbol: 'ETH'
    });
    expect(wrapper.vm.$data.overrideTo).toEqual({
      name: 'Bitcoin',
      symbol: 'BTC'
    });
    expect(wrapper.vm.$data.fromValue).toEqual(1);
    expect(wrapper.vm.$data.providerSelectedName).toEqual('');
    expect(wrapper.vm.$data.toAddress).toEqual('');
    expect(wrapper.vm.$data.refundAddress).toEqual('');
    expect(wrapper.vm.$data.exitFromAddress).toEqual('');
  });
  // describe('SwapContainer.vue Methods', () => {
  //   let localVue, i18n, wrapper, store;

  //   beforeAll(() => {
  //     const baseSetup = Tooling.createLocalVueInstance();
  //     localVue = baseSetup.localVue;
  //     i18n = baseSetup.i18n;
  //     store = baseSetup.store;
  //   });
  // });

  //   beforeEach(() => {
  //     wrapper = shallowMount(SwapContainer, {
  //       localVue,
  //       i18n,
  //       store,
  //       attachToDocument: true,
  //       stubs: {
  //         'currency-picker': CurrencyPicker,
  //         'swap-confirmation-modal': SwapConfirmationModal,
  //         'router-link': RouterLinkStub,
  //         'b-modal': BModalStub
  //       }
  //     });
  //   });

  //   xit('[Failing] should open swapConfirmationModal when click button', () => {
  //     const btnSubmit = wrapper.find('.submit-button');
  //     btnSubmit.trigger('click');
  //     expect(showModal.called).toBe(true);
  //   });
  // });

  it('dismounts', () => {
    wrapper.destroy();
    expect(wrapper.exists()).toBe(false);
  });
});
