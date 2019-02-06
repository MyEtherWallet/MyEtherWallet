import Vuex from 'vuex';
import { shallowMount } from '@vue/test-utils';
import SwapContainer from '@/layouts/InterfaceLayout/containers/SwapContainer/SwapContainer.vue';
import { Tooling } from '@@/helpers';
import CurrencyPicker from '@/layouts/InterfaceLayout/components/CurrencyPicker/CurrencyPicker.vue';
import SwapConfirmationModal from '@/layouts/InterfaceLayout/containers/SwapContainer/components/SwapConfirmationModal/SwapConfirmationModal.vue';
import { state, getters } from '@@/helpers/mockStore';

import sinon from 'sinon';
const RouterLinkStub = {
  name: 'router-link',
  template: '<p> <slot> </slot></p>',
  // render: ()=>{},
  props: ['to']
};

const showModal = sinon.spy();

const BModalStub = {
  name: 'b-modal',
  template: '<div><slot></slot></div>',
  props: ['to'],
  methods: {
    show: showModal
  }
};

//xdescribe
describe('SwapContainer.vue', () => {
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

  xit('[Failing] should render correct fromArray to currenPicker element', () => {
    const containerElements = wrapper.vm.$el.querySelectorAll(
      '.item-container'
    );
    const fromToElements = containerElements[0];
    for (let i = 0; i < fromToElements.querySelectorAll('div').length; i++) {
      const currencyElement = fromToElements.querySelectorAll('div')[i];
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
    for (let i = 0; i < fromToElements.querySelectorAll('div').length; i++) {
      const currencyElement = fromToElements.querySelectorAll('div')[i];
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

  describe('SwapContainer.vue Methods', () => {
    let localVue, i18n, wrapper, store;

    beforeAll(() => {
      const baseSetup = Tooling.createLocalVueInstance();
      localVue = baseSetup.localVue;
      i18n = baseSetup.i18n;
      store = baseSetup.store;
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

    xit('[Failing] should open swapConfirmationModal when click button', () => {
      const btnSubmit = wrapper.find('.submit-button');
      btnSubmit.trigger('click');
      expect(showModal.called).toBe(true);
    });
  });
});
