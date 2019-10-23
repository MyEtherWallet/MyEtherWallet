import { shallowMount } from '@vue/test-utils';
import SwapContainer from '@/layouts/InterfaceLayout/containers/SwapContainer/SwapContainer.vue';
import { Tooling } from '@@/helpers';
import CurrencyPicker from '@/layouts/InterfaceLayout/components/CurrencyPicker/CurrencyPicker.vue';
import SwapConfirmationModal from '@/layouts/InterfaceLayout/containers/SwapContainer/components/SwapConfirmationModal/SwapConfirmationModal.vue';
import sinon from 'sinon';
import { RouterLinkStub } from '@@/helpers/setupTooling';

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
});
